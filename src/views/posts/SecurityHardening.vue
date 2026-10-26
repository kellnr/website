<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import AttentionBlock from "@/components/elements/AttentionBlock.vue";
import WarnBlock from "@/components/elements/WarnBlock.vue";
</script>

<template>
  <BlogPostTemplate title="Kellnr 6.11.0: Security Hardening, New Settings and What to Check Before Upgrading" date="24. October, 2026">
    <TextBlock>
      Kellnr 6.11.0 is a security release. It closes several vulnerabilities found in a review of
      the whole code base and hardens Kellnr in many smaller places. Please upgrade soon. Most of the changes need no
      action from you, but a few change behaviour you might rely on. This post lists the new settings and the things to
      check before upgrading.
    </TextBlock>

    <SubHeader id="new-settings">New Settings</SubHeader>
    <TextBlock>
      All new settings are optional and default to safe values. As usual, each one can be set in the TOML config, as a
      <code>KELLNR_*</code> environment variable, or as a CLI flag.
      <ul>
        <li><b>Login throttling.</b> <code>registry.auth_max_failed_attempts</code> (default <code>10</code>, <code>0</code>
          disables it) and <code>registry.auth_failed_attempts_window_seconds</code> (default <code>300</code>) limit
          failed password checks per username. Above the limit, Kellnr answers with HTTP 429 until the window expires.
          This applies to the web login and to cargo's basic auth.</li>
        <li><b>Docs build limits.</b> <code>docs.build_timeout_seconds</code> (default <code>1800</code>) kills a
          rustdoc build that runs too long. <code>docs.build_wrapper</code> lets you put a sandbox like bubblewrap in
          front of every build.</li>
        <li><b>Secure cookies behind a proxy.</b> <code>origin.cookie_secure</code> forces the <code>Secure</code> flag on
          Kellnr's cookies, for setups where TLS ends at a reverse proxy and <code>origin.protocol</code> is
          <code>http</code>.</li>
        <li><b>Webhook targets.</b> <code>webhooks.block_private_targets</code> (default <code>false</code>) additionally
          refuses webhook deliveries to loopback and private networks. Link-local and cloud metadata addresses are
          always refused.</li>
        <li><b>Signed webhooks.</b> When registering a webhook you can now pass a <code>secret</code>. Kellnr then signs
          every delivery following the <a href="https://www.standardwebhooks.com/">Standard Webhooks</a> spec, so your
          receiver can verify that a request really came from Kellnr.</li>
      </ul>
    </TextBlock>

    <CodeBlock lang="toml">
[registry]
auth_max_failed_attempts = 10
auth_failed_attempts_window_seconds = 300

[docs]
build_timeout_seconds = 1800
build_wrapper = []

[origin]
cookie_secure = true

[webhooks]
block_private_targets = false
    </CodeBlock>

    <SubHeader id="before-upgrading">What to Check Before Upgrading</SubHeader>
    <TextBlock>
      <ul>
        <li><b>Everyone logs in again once.</b> Sessions are now stored hashed, so existing sessions are removed during
          the upgrade. Cargo tokens keep working.</li>
        <li><b>Passwords are rehashed with argon2id.</b> This happens at each user's next login. After that, an older
          Kellnr version can no longer verify the password, so take a database backup if you might need to roll
          back.</li>
        <li><b>OAuth2 roles come only from the configured claim.</b> Admin and read-only roles were also granted from
          generic claims like <code>groups</code> or <code>roles</code> when the configured claim was missing. If you
          relied on that, set <code>admin_group_claim</code> and <code>read_only_group_claim</code> to the claim your
          identity provider actually sends.</li>
        <li><b>Stricter publishing for new crates and versions.</b> Like crates.io, Kellnr now rejects
          <code>homepage</code>, <code>repository</code> and <code>documentation</code> URLs that are not
          <code>http(s)</code>, new crate names that only differ from an existing one by <code>-</code> or
          <code>_</code>, and versions that only differ by build metadata (<code>1.0.0+a</code> vs.
          <code>1.0.0+b</code>). Existing crates and versions are not affected.</li>
        <li><b>Download restricted crates are hidden.</b> Users without access no longer see them in listings, search,
          the sparse index or the crate page. Crate owners can now manage the users and groups of their crates in the
          web UI, changing the restriction itself stays admin only.</li>
        <li><b>Webhooks no longer follow redirects.</b> If a callback URL relies on a redirect, for example from
          <code>http</code> to <code>https</code>, point it at the final address.</li>
        <li><b>Hosted docs are sandboxed.</b> Docs pages can no longer open popups, so rustdoc's playground "Run" links
          do not open. Docs archives larger than 20 times <code>docs.max_size</code> after decompression are
          rejected.</li>
      </ul>
    </TextBlock>

    <WarnBlock>
      Building docs (<code>docs.enabled</code>) compiles every published crate, which runs its build scripts and proc
      macros on the Kellnr host. Builds now run in a separate process without any <code>KELLNR_*</code> settings or
      secrets, but they can still read every file Kellnr can read. Only enable docs builds for publishers you trust, or
      confine them with <code>docs.build_wrapper</code>.
    </WarnBlock>

    <SubHeader id="docker-helm">Docker and Helm</SubHeader>
    <TextBlock>
      Both Docker images now run Kellnr as the unprivileged <code>kellnr</code> user (uid 1000). The container still
      starts as root to trust custom CA certificates and to take over data volumes written by older images, then
      switches users. Nothing changes for a plain <code>docker run</code>. Some things to know:
      <ul>
        <li>If the container has no <code>CHOWN</code>, <code>SETUID</code> and <code>SETGID</code> capabilities, Kellnr
          keeps running as root and logs a warning instead of failing.</li>
        <li>You can also start the container directly as <code>--user 1000:1000</code>. Custom CAs in
          <code>/usr/local/share/ca-certificates</code> are still trusted in that mode.</li>
        <li><code>CARGO_HOME</code> moved to <code>/home/kellnr/.cargo</code>. If you mount your own cargo config for the
          docs build, mount it there.</li>
      </ul>
    </TextBlock>

    <TextBlock>
      Helm chart <code>6.3.0</code> exposes all new settings and grants exactly the three capabilities the image needs:
    </TextBlock>

    <CodeBlock lang="yaml">
kellnr:
  registry:
    authMaxFailedAttempts: 10
  docs:
    buildTimeoutSeconds: 1800
  origin:
    cookieSecure: true
  webhooks:
    blockPrivateTargets: false
    </CodeBlock>

    <AttentionBlock>
      The doc builder token of the Helm chart (<code>docBuilder.tokenSecretRef</code>) is visible to the build scripts of
      the documented crates. Use a token of a dedicated read-only user for it.
    </AttentionBlock>

    <TextBlock>
      Thanks to everyone who reports security issues responsibly. If you find something, please use a
      <a href="https://github.com/kellnr/kellnr/security/advisories/new">private security advisory</a> on GitHub instead
      of a public issue.
    </TextBlock>
  </BlogPostTemplate>
</template>
