<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import AttentionBlock from "@/components/elements/AttentionBlock.vue";
import WarnBlock from "@/components/elements/WarnBlock.vue";
</script>

<template>
  <BlogPostTemplate title="A Safer Kellnr Helm Chart: Splitting Config and Secrets (Chart v6.0.0)" date="4. June, 2026">
    <TextBlock>
      The Kellnr Helm chart just got a major release: <b>chart version 6.0.0</b>. It is the biggest rework of how the
      chart handles configuration since the chart was first published, and it is a breaking change. The headline is
      security: sensitive values no longer live in a plaintext ConfigMap. Along the way the chart also gained health
      probes, a values schema, a smoke test, and a handful of new settings. This post walks through what changed, why,
      and how to upgrade.
    </TextBlock>

    <AttentionBlock>
      The chart version is independent of the Kellnr application version. Chart <code>6.0.0</code> deploys Kellnr
      <code>6.3.0</code> by default (the chart's <code>appVersion</code>). This release is about the
      <i>packaging</i>, not the registry itself, so don't confuse it with the earlier
      <router-link to="/blog/release6">Kellnr 6.0.0 application release</router-link>.
    </AttentionBlock>

    <SubHeader id="the-problem">The Problem: One Toggle for Everything</SubHeader>
    <TextBlock>
      Until now, the chart had a single switch, <code>secret.enabled</code>, that flipped the <i>entire</i>
      configuration between two storage modes:
    </TextBlock>

    <CodeBlock lang="yaml">
secret:
  enabled: false      # everything in a ConfigMap (default)
  # enabled: true     # everything in a Secret instead (e.g. for SOPS)
  useExisting: false  # ... or point at a Secret you manage yourself
  name: kellnr-secret
    </CodeBlock>

    <TextBlock>
      It worked, but it forced an awkward all-or-nothing choice. In the default mode, genuinely sensitive values, the
      cookie signing key, the S3 keys, the OAuth2 client secret, sat in a plaintext ConfigMap right next to harmless
      tuning knobs like cache sizes and log levels. Flipping the switch to "Secret mode" hid <i>everything</i> in a
      Secret, including the non-sensitive settings, which then no longer showed up where operators expected them. There
      was no way to keep the boring config readable in a ConfigMap <i>and</i> the secrets in a Secret at the same time.
    </TextBlock>

    <TextBlock>
      This single design also generated a steady trickle of GitHub issues:
      <a href="https://github.com/kellnr/helm/issues/68">#68</a> asked to use a ConfigMap and a Secret together,
      <a href="https://github.com/kellnr/helm/issues/61">#61</a> asked for a way to inject arbitrary environment
      variables, and <a href="https://github.com/kellnr/helm/issues/67">#67</a> (thanks to community contributor
      <a href="https://github.com/vmoudy">@vmoudy</a>) asked to move the cookie signing key out of the ConfigMap and
      into a Secret. All three are symptoms of the same root cause: the chart split storage by a global mode, not by
      whether a value is actually a secret.
    </TextBlock>

    <SubHeader id="the-fix">The Fix: Split by Sensitivity</SubHeader>
    <TextBlock>
      Chart 6.0.0 follows the convention mature Helm charts converge on. It always renders <b>both</b> a ConfigMap and
      a Secret, and mounts them both into the pod. Non-sensitive settings go into the ConfigMap; sensitive ones, the
      admin password and token, the cookie signing key, the S3 access and secret keys, and the OAuth2 client secret,
      go into the Secret. There is no mode toggle anymore, because there is nothing to toggle: each value goes where it
      belongs.
    </TextBlock>

    <CodeBlock lang="yaml">
# The ConfigMap and Secret are both created and mounted automatically.
configMap:
  name: kellnr-config   # non-sensitive settings
secret:
  name: kellnr-secret   # sensitive settings
  existingSecret: ""    # optional: mount a Secret you manage instead
    </CodeBlock>

    <TextBlock>
      If you manage your secrets yourself, for example with a SOPS-encrypted Secret, set
      <code>secret.existingSecret</code> to its name. The chart then skips creating its own Secret and mounts yours.
      This replaces the old <code>secret.useExisting</code> flag with a clearer, single setting.
    </TextBlock>

    <SubHeader id="cookie-key">The Cookie Signing Key</SubHeader>
    <TextBlock>
      The cookie signing key keeps user sessions valid across replicas, so it is exactly the kind of value you do not
      want sitting in a ConfigMap. In 6.0.0 it is stored in the chart's Secret when you provide it inline, or you can
      point at an existing Secret you manage:
    </TextBlock>

    <CodeBlock lang="yaml">
kellnr:
  registry:
    # Option A: inline value, stored in the chart-managed Secret.
    cookieSigningKey: "replace-with-64-or-more-random-characters-xxxxxxxxxxxxxxxxxxxxxxxx"

    # Option B: reference an existing Secret (takes precedence over the inline value).
    cookieSigningKeySecretRef:
      name: my-cookie-secret
      key: cookieSigningKey
    </CodeBlock>

    <AttentionBlock>
      The environment variable Kellnr reads is still <code>KELLNR_REGISTRY__COOKIE_SIGNING_KEY</code>. If neither
      option is set, Kellnr generates a random key per pod, which is fine for a single replica but logs users out when
      they are routed to a different replica. Set it explicitly for multi-replica deployments.
    </AttentionBlock>

    <SubHeader id="extra-env">Arbitrary Environment Variables</SubHeader>
    <TextBlock>
      Some setups need environment variables the chart does not model, AWS credentials for an S3 backend are the
      classic example. Three new escape hatches cover this: <code>extraEnvVars</code> for raw variables (including
      <code>valueFrom</code> references), and <code>extraEnvVarsCM</code> / <code>extraEnvVarsSecret</code> to mount an
      existing ConfigMap or Secret wholesale.
    </TextBlock>

    <CodeBlock lang="yaml">
extraEnvVars:
  - name: AWS_REGION
    value: "eu-central-1"
  - name: MY_TOKEN
    valueFrom:
      secretKeyRef:
        name: my-secret
        key: token
extraEnvVarsCM: my-extra-config
extraEnvVarsSecret: my-aws-credentials
    </CodeBlock>

    <SubHeader id="hardening">Health Probes, Schema, and a Smoke Test</SubHeader>
    <TextBlock>
      The release also closes a few quality gaps that had nothing to do with secrets:
      <ul>
        <li><b>Health probes.</b> The deployment now ships startup, liveness, and readiness probes against Kellnr's
          <code>/api/v1/health</code> endpoint, enabled by default and fully tunable. Rolling updates wait for a pod to
          actually be healthy before sending traffic to it.</li>
        <li><b>No service-account token by default.</b> Kellnr never talks to the Kubernetes API, so the chart sets
          <code>automountServiceAccountToken: false</code> to remove that unused attack surface.</li>
        <li><b>A values schema.</b> A new <code>values.schema.json</code> validates your values when you install or
          template the chart, catching typos and type mistakes (and requiring <code>kellnr.origin.hostname</code>)
          with a clear error instead of a confusing runtime failure.</li>
        <li><b>A built-in smoke test.</b> <code>helm test kellnr</code> now runs a small pod that checks the health
          endpoint is reachable through the Service.</li>
        <li><b>New tuning settings.</b> Download timeouts and concurrency
          (<code>kellnr.registry.downloadTimeoutSeconds</code> and friends) and S3 connect/request timeouts are now
          exposed in <code>values.yaml</code>.</li>
      </ul>
    </TextBlock>

    <TextBlock>
      And because a chart that nobody tests slowly rots, every pull request now runs <code>helm lint</code>,
      chart-testing, and an actual install onto a <a href="https://kind.sigs.k8s.io/">kind</a> cluster that exercises
      the new smoke test. The chart is verified end-to-end on every change before it is released.
    </TextBlock>

    <SubHeader id="upgrade">How to Upgrade</SubHeader>
    <TextBlock>
      For most installations the upgrade is uneventful. Update the repository and upgrade as usual:
    </TextBlock>

    <CodeBlock lang="bash">
helm repo update
helm upgrade kellnr kellnr/kellnr
    </CodeBlock>

    <TextBlock>
      If you set the cookie signing key, the S3 keys, or the OAuth2 client secret <i>inline</i> in your values, you do
      not need to change anything: those values now transparently land in the chart's Secret instead of the ConfigMap.
    </TextBlock>

    <WarnBlock>
      The breaking change is the removal of <code>secret.enabled</code> and <code>secret.useExisting</code>. If you
      relied on <code>secret.useExisting: true</code> to mount your own (e.g. SOPS-encrypted) Secret, switch to
      <code>secret.existingSecret</code>:
    </WarnBlock>

    <CodeBlock lang="yaml">
# Before (chart &lt; 6.0.0)
secret:
  enabled: true
  useExisting: true
  name: my-sops-secret

# After (chart 6.0.0)
secret:
  existingSecret: my-sops-secret
    </CodeBlock>

    <TextBlock>
      Two behavioural changes are worth knowing about even though they need no configuration. Pods now have health
      probes, so a misconfigured instance that never becomes healthy will be reported as not ready instead of silently
      accepting traffic. And the service-account token is no longer mounted; if you have tooling that relied on it, set
      <code>serviceAccount.automountServiceAccountToken: true</code> to restore the old behaviour.
    </TextBlock>

    <TextBlock>
      The full, step-by-step migration notes live in the
      <a href="https://github.com/kellnr/helm/blob/main/README.md#chart-version-600">chart README</a>, and the
      complete change set is in <a href="https://github.com/kellnr/helm">the helm repository</a>. As always, if the
      chart is missing something you need, open an issue, several of the improvements in this release started exactly
      that way.
    </TextBlock>
  </BlogPostTemplate>
</template>
