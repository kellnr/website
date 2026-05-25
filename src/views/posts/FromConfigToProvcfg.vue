<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
</script>

<template>
  <BlogPostTemplate title="From config to provcfg: Tracking Where a Setting Came From" date="25. May, 2026">
    <TextBlock>
      Kellnr started small. A handful of fields in a TOML file, a port, a data directory, that was it. Five years and
      many releases later it spans roughly 70 individual settings across 11 sections, covering everything from
      PostgreSQL credentials to OAuth2 scopes, S3 endpoints, proxy timeouts, toolchain mirrors, and per-user session
      lifetimes. Each of those settings can be supplied four different ways: a compiled-in default, a TOML config
      file, an environment variable, or a command-line flag. And the rules for which one wins matter, both for users
      debugging a misconfigured deployment and for operators auditing a running instance.
    </TextBlock>

    <TextBlock>
      "Where did this value actually come from?" turned out to be a question we asked ourselves over and over. The
      <code>--port</code> flag is obvious, the TOML file is obvious, but a stray <code>KELLNR_REGISTRY__DATA_DIR</code>
      env var on a CI runner? Far less so. We added the <i>Startup Configuration</i> screen in the web UI specifically
      to answer it: every leaf shows its current value next to a coloured badge telling you whether it came from the
      defaults, a TOML file, an env var, or a CLI flag.
    </TextBlock>

    <ImageBlock src="/images/kellnr/blog/provcfg/startup-config-origin-view.png"
                alt="Kellnr Startup Configuration screen with the Registry section expanded, each leaf showing its current value, default, and the TOML/ENV/CLI badge for its active source" />

    <TextBlock>
      The screen made debugging much easier, but building it the first time around was painful. The problem was not
      the UI, the problem was that the configuration layer didn't actually know where each value came from.
    </TextBlock>

    <SubHeader id="config-crate">The Old Setup: the <code>config</code> Crate and a Lot of Glue</SubHeader>
    <TextBlock>
      Under the hood, Kellnr used the popular <a href="https://crates.io/crates/config"><code>config</code></a> crate
      to merge layers of configuration. <code>config</code> is a fine library, it gives you a single
      <code>Config</code> object built from any number of sources and lets you deserialize it into your own struct. But
      its model is value-only: the merged object hands you the final scalar for each key, and the provenance of that
      scalar is gone by the time your code sees it.
    </TextBlock>

    <TextBlock>
      To get the <i>"where did this come from?"</i> column working we had to maintain a parallel
      <code>HashMap&lt;String, ConfigSource&gt;</code> next to the actual <code>Settings</code> struct, populated by
      hand during deserialization. Every new setting meant remembering to add a row to the map. Forget to do it and
      the UI silently labelled the value <i>"default"</i>, even when an env var was actively overriding it.
    </TextBlock>

    <TextBlock>
      The CLI side told a similar story. To support partial CLI overrides we had to layer
      <a href="https://crates.io/crates/clap_serde_derive"><code>clap_serde_derive</code></a> on top of
      <code>clap</code>, which generates a sibling <code>Opt</code> struct full of <code>Option&lt;T&gt;</code> fields
      per setting. Then we hand-wrote a merge step that copied each <code>Some(...)</code> from the Opt into the
      partial config layer that <code>config</code> understood. Three derives, two parallel structs, one merge
      function per section, and a fragile contract that everything stayed in lockstep.
    </TextBlock>

    <TextBlock>
      The <i>real</i> headache lived in the Vue file behind the Startup Configuration screen. Because the backend
      couldn't enumerate its own settings with metadata, the frontend hard-coded all of it:
    </TextBlock>

    <CodeBlock lang="typescript">
const sections: ConfigSection[] = [
  {
    key: 'registry',
    title: 'Registry',
    icon: 'mdi-package-variant-closed',
    items: [
      { key: 'registry.data_dir', label: 'Data Directory', cli: '--registry-data-dir, -d' },
      { key: 'registry.session_age_seconds', label: 'Session Age (seconds)', cli: '--registry-session-age' },
      { key: 'registry.cache_size', label: 'Cache Size', cli: '--registry-cache-size' },
      // ...about 60 more entries...
      { key: 's3.allow_http', label: 'Allow HTTP', type: 'boolean', warningWhenTrue: true, cli: '--s3-allow-http' },
    ]
  },
  // ...eight more sections...
];
    </CodeBlock>

    <TextBlock>
      Roughly 130 lines of hand-maintained schema describing what the Rust code already knew. Every time we added a
      setting, renamed a CLI flag, or changed a default, we had to keep three places in sync: the Rust
      <code>Settings</code> struct, the merge glue around <code>config</code>, and this Vue table. Inevitably the
      table drifted, leaves disappeared from the UI, and CLI flag strings went stale.
    </TextBlock>

    <SubHeader id="provcfg">Enter provcfg</SubHeader>
    <TextBlock>
      We took a step back and asked: what would a configuration library look like if provenance were a first-class
      concept, baked in from the start? The answer became
      <a href="https://crates.io/crates/provcfg"><code>provcfg</code></a>, a small crate we built to do exactly one
      thing: merge layered sources <i>while preserving where each leaf came from.</i>
    </TextBlock>

    <TextBlock>
      The core idea is a derive macro and a companion <code>Prov</code> type. You write your settings struct
      normally, slap <code>#[derive(Configurable)]</code> on it, and the macro generates a parallel
      <code>SettingsProv</code> struct in which every leaf is a <code>ValueHistory&lt;T&gt;</code>, a typed value plus
      the chain of sources that touched it. Building the config is a fluent chain of source layers:
    </TextBlock>

    <CodeBlock lang="rust">
use provcfg::{Config, Configurable};

#[derive(Configurable, Default, Deserialize, Clone)]
struct Settings {
    #[configurable(nested)] pub registry: Registry,
    #[configurable(nested)] pub docs: Docs,
    // ...
}

let prov: SettingsProv = Config::new()
    .add_toml_file("kellnr.toml")?
    .add_env_with_list_keys("KELLNR", ["registry.required_crate_fields"])
    .add_cli(cli_partial)
    .build::&lt;SettingsProv&gt;()?;

// Active value, plus the source that set it.
assert_eq!(prov.registry.data_dir.value(), "/var/lib/kellnr");
assert_eq!(prov.registry.data_dir.source().category(), Category::Cli);
    </CodeBlock>

    <TextBlock>
      No parallel <code>HashMap</code>. No merge glue. The "source of truth" for every leaf lives next to its value,
      typed and inspectable.
    </TextBlock>

    <TextBlock>
      A second derive, <code>ClapArgs</code> from the companion <code>provcfg-clap</code> crate, generates the clap
      <code>Args</code> struct and the conversion from CLI flags into a <code>Partial</code> layer that
      <code>add_cli</code> consumes. The hand-written merge step between <code>clap_serde_derive</code> and
      <code>config</code> disappears entirely:
    </TextBlock>

    <CodeBlock lang="rust">
#[derive(Configurable, ClapArgs, Default, Deserialize, Clone)]
#[configurable(clap_prefix = "registry")]
pub struct Registry {
    /// Data directory for crates, index, and database.
    #[arg(short = 'd')]
    pub data_dir: String,

    /// Required crate fields (comma-separated).
    #[configurable(env_list)]
    #[arg(value_delimiter = ',')]
    pub required_crate_fields: Vec&lt;String&gt;,

    /// Cookie signing key (for multi-instance setups).
    #[configurable(secret)]
    pub cookie_signing_key: Option&lt;String&gt;,
    // ...
}
    </CodeBlock>

    <TextBlock>
      Three attributes carry the metadata that previously had to live in the Vue table:
      <ul>
        <li><code>#[configurable(clap_prefix = "...")]</code> auto-derives the CLI flag (so the data-dir flag becomes
          <code>--registry-data-dir</code>) and the dotted env key
          (<code>KELLNR_REGISTRY__DATA_DIR</code>) at the same time.</li>
        <li><code>#[configurable(env_list)]</code> tells the env source to split comma-separated values into a
          <code>Vec</code>, no parsing glue needed.</li>
        <li><code>#[configurable(secret)]</code> marks a leaf as sensitive so that the
          <code>kellnr config show</code> printer redacts it and the UI masks the value.</li>
      </ul>
    </TextBlock>

    <SubHeader id="dynamic-ui">A Dynamic Configuration UI</SubHeader>
    <TextBlock>
      Once the backend could enumerate its own settings, the natural next step was to let the UI <i>ask</i> instead of
      hard-coding. provcfg's <code>walk_leaves</code> walks every leaf with its path, value, source category, and
      <code>secret</code> flag in one pass. We pair that with clap reflection to recover the CLI flag string per
      leaf:
    </TextBlock>

    <CodeBlock lang="rust">
fn build_leaves(prov: &amp;SettingsProv) -&gt; Vec&lt;LeafMeta&gt; {
    let defaults = serde_json::to_value(Settings::default()).unwrap();
    let flag_map = cli_flag_map(); // dotted path -&gt; "--registry-data-dir, -d"

    let mut leaves = Vec::new();
    prov.walk_leaves("", &amp;mut |path, value, category, secret| {
        leaves.push(LeafMeta {
            key: path.to_string(),
            value: json_from_erased(value).unwrap(),
            default: lookup_default(&amp;defaults, path),
            source: category.into(),
            kind: infer_kind(value),
            secret,
            cli_flag: flag_map.get(path).cloned(),
            label: leaf_label(path).map(String::from),
        });
    });
    leaves.sort_by(|a, b| a.key.cmp(&amp;b.key));
    leaves
}
    </CodeBlock>

    <TextBlock>
      The <code>/settings</code> endpoint embeds this <code>leaves</code> vector in its response, and the Vue
      component iterates over it. The Vue file went from owning a 130-line schema table to owning eleven lines of
      pure presentation:
    </TextBlock>

    <CodeBlock lang="typescript">
const sectionDescriptors: SectionDescriptor[] = [
  { key: 'registry',   title: 'Registry',    icon: 'mdi-package-variant-closed' },
  { key: 'local',      title: 'Local',       icon: 'mdi-server' },
  { key: 'origin',     title: 'Origin',      icon: 'mdi-earth' },
  { key: 'log',        title: 'Log',         icon: 'mdi-file-document-outline' },
  { key: 'proxy',      title: 'Proxy',       icon: 'mdi-transit-connection-variant' },
  { key: 'docs',       title: 'Docs',        icon: 'mdi-file-document-multiple-outline' },
  { key: 'postgresql', title: 'PostgreSQL',  icon: 'mdi-database' },
  { key: 's3',         title: 'S3 Storage',  icon: 'mdi-cloud-outline' },
  { key: 'toolchain',  title: 'Toolchain',   icon: 'mdi-wrench' },
];
    </CodeBlock>

    <TextBlock>
      Titles and icons are presentation choices, and they belong in the UI. <i>Everything else</i>, the leaves
      themselves, their types, their CLI flags, their secret flags, comes from the backend. Add a new setting to the
      Rust struct and it appears in the right section automatically. Rename a CLI flag and the UI reflects the new
      name on the next request, without anyone touching Vue.
    </TextBlock>

    <SubHeader id="summary">What Kellnr Lost (and Gained)</SubHeader>
    <TextBlock>
      The migration touched 32 files. The headline numbers across the diff:
      <ul>
        <li>The <code>clap_serde_derive</code> dependency and roughly 11 hand-written
          <code>impl ClapSerde</code>-style merge blocks: <b>gone</b>.</li>
        <li>The parallel <code>HashMap&lt;String, ConfigSource&gt;</code> on <code>Settings</code> and its
          maintenance code: <b>gone</b>.</li>
        <li>The hand-coded <code>Settings::try_from(Config)</code> with its provenance bookkeeping: <b>gone</b>,
          replaced by a macro-generated <code>From&lt;&amp;SettingsProv&gt; for Settings</code>.</li>
        <li>The Vue startup-config schema: shrunk from a 130-line entry-per-leaf table to 11 lines of section
          descriptors. The Settings JavaScript bundle dropped from 53.9 KB (13.8 KB gzip) to 49.6 KB
          (12.9 KB gzip).</li>
        <li>CLI flag strings, secret markers, and per-leaf types: no longer duplicated on the frontend at all.</li>
      </ul>
    </TextBlock>

    <TextBlock>
      In raw lines the refactor was net-neutral, the new code that <i>does</i> live in the repo is the
      <code>Configurable</code>/<code>ClapArgs</code>-derived struct definitions plus a tiny label-override table.
      The savings show up in <i>what's no longer there to maintain</i>: three parallel descriptions of the same
      settings collapsed into one, with the macro generating the rest.
    </TextBlock>

    <TextBlock>
      And the bug class we were trying to kill, the UI silently mis-labelling a value because someone forgot to keep
      the schema in sync, simply cannot happen anymore. The backend doesn't have a parallel description to drift
      from; there's just the struct.
    </TextBlock>

    <SubHeader id="provcfg-standalone"><code>provcfg</code> Is Standalone</SubHeader>
    <TextBlock>
      <code>provcfg</code> doesn't depend on Kellnr in any way. It is published on
      <a href="https://crates.io/crates/provcfg">crates.io</a> alongside the optional
      <code>provcfg-clap</code> companion crate, and we'd love for other projects with similar configuration needs to
      try it. The source lives at
      <a href="https://github.com/secana/provcfg">github.com/secana/provcfg</a>, and contributions are
      welcome.
    </TextBlock>

    <TextBlock>
      For Kellnr itself, the win was the boring kind: every change to the config schema now requires touching
      exactly one place. That's the kind of simplification that quietly pays for itself for years.
    </TextBlock>
  </BlogPostTemplate>
</template>
