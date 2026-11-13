<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import CalloutBlock from "@/components/elements/CalloutBlock.vue";
</script>

<template>
  <BlogPostTemplate title="Kellnr 7: What Changes and What to Check Before Upgrading">
    <TextBlock>
      Kellnr 7 is the result of a review of the whole code base. Most of the work is invisible: about 70 bug
      fixes, stricter types inside Kellnr, a simpler internal structure and a much faster test suite. For you as an
      operator, Kellnr behaves as before in almost all cases. A few changes to the HTTP API are breaking, which is why
      this is a new major version. This post lists them, together with the one database migration that may need your
      attention.
    </TextBlock>

    <SubHeader id="before-upgrading">Before Upgrading: Crate Names</SubHeader>
    <TextBlock>
      Like cargo and crates.io, Kellnr 7 treats crate names that only differ in case or in <code>-</code> and
      <code>_</code> as the same crate. The API, the web UI and the hosted docs find a crate under any spelling of its
      name, and publishing a new version under another spelling (<code>mycrate</code> onto <code>MyCrate</code>) is
      rejected with 400. Index files, crate files and docs keep the name the crate was published with.
    </TextBlock>

    <CalloutBlock variant="warn">
      Kellnr versions before 6.11.0 allowed crates whose names only differ in <code>-</code> and <code>_</code>, for
      example <code>foo-bar</code> and <code>foo_bar</code>. If your database holds such crates, the migration to
      Kellnr 7 fails without changing any data and Kellnr does not start. The error lists the affected crates. Delete
      all but one crate of each group, for example in the web UI of your current Kellnr version, then start Kellnr 7
      again. As always, take a database backup before upgrading.
    </CalloutBlock>

    <SubHeader id="api-changes">Breaking Changes in the HTTP API</SubHeader>
    <TextBlock>
      Cargo itself is not affected by any of these changes. They matter if you have scripts or tools that call the
      Kellnr API directly.
      <ul>
        <li><b>One error format.</b> Every API error now has the body that cargo's registry API uses. The web UI API
          (<code>/api/v1/ui</code>, users, groups, auth, acl, docs, oauth2) answered with plain text or an empty body
          before, the toolchain API with <code>{"success":false,"message":...}</code>. Successful responses do not
          change. A download that is denied by the license filter still answers with plain text, because cargo shows
          that text to the user as it is.</li>
        <li><b>403 for missing rights, like crates.io.</b> Read-only users get 403 instead of 400 when they publish,
          yank, unyank or upload docs. Non-admins get 403 instead of 401 on the webhook and empty-crate endpoints.
          Requests without valid credentials still get 401, which cargo needs to ask for a token.</li>
        <li><b>Crate users and groups have one API.</b> The routes <code>/api/v1/acl/{crate}/users</code> and
          <code>/api/v1/acl/{crate}/groups</code> (with <code>/{name}</code> for PUT and DELETE) are removed. Use
          <code>/api/v1/crates/{crate}/crate_users</code> and <code>/api/v1/crates/{crate}/crate_groups</code>
          instead, which the web UI uses as well. <code>GET</code> and <code>PUT /api/v1/acl/{crate}</code> for the
          download restriction stay.</li>
        <li><b>crates.io crate data is JSON.</b> <code>GET /api/v1/ui/cratesio_data</code> answers with the content type
          <code>application/json</code> instead of <code>text/plain</code>. The body does not change.</li>
      </ul>
    </TextBlock>

    <CodeBlock lang="json">
{"errors":[{"detail":"ERROR: Read-only users cannot modify the registry"}]}
    </CodeBlock>

    <TextBlock>
      Many endpoints also answer with more precise status codes than before. For example, errors caused by the request
      return 400, 404, 409 or 413 instead of 500, unknown API paths return 404 instead of the web UI page, and a
      crates.io that cannot be reached returns 502. Crate lists and search accept a page size of 1 to 100. If a script
      checks for an exact status code, test it against Kellnr 7 first.
    </TextBlock>

    <SubHeader id="stricter-checks">Stricter Checks</SubHeader>
    <TextBlock>
      <ul>
        <li><b>Names of users, groups and tokens.</b> User and group names may have up to 64 characters, token names up
          to 128, and none of them may contain control characters. User names must not contain <code>:</code>, as
          cargo's basic auth splits the credentials at the first <code>:</code>. Existing accounts are not changed.</li>
        <li><b>SSO configuration.</b> With OAuth2 enabled, Kellnr no longer starts with an empty
          <code>oauth2.issuer_url</code> or <code>oauth2.client_id</code>, which could never work. Setting only one of a
          group claim and its value logs a warning.</li>
        <li><b>Webhook targets.</b> Deliveries to 100.100.100.200 (a cloud metadata address) are always refused, like
          the other link-local and metadata addresses. With <code>webhooks.block_private_targets</code>, multicast and
          reserved addresses are refused as well, and IPv6 addresses with an embedded IPv4 address are checked by that
          IPv4 address. Deliveries that can never succeed, because of an invalid URL, a blocked target or an invalid
          secret, are no longer retried.</li>
      </ul>
    </TextBlock>

    <SubHeader id="new">New Settings and Fixes Worth Knowing</SubHeader>
    <TextBlock>
      <ul>
        <li><b>Crate cache size.</b> <code>registry.cache_max_size</code> (in MB) limits the total size of the in-memory
          crate cache, next to <code>registry.cache_size</code>, which limits the number of crates. The default
          <code>0</code> keeps the previous behavior.</li>
        <li><b>Webhooks and proxies.</b> <code>webhooks.ignore_env_proxy</code> sends webhooks directly instead of
          through <code>HTTP_PROXY</code>/<code>HTTPS_PROXY</code>, so the target check covers the real address.</li>
        <li><b>Webhook payloads</b> contain the crate name exactly as it was published in
          <code>original_name</code>.</li>
        <li><b><code>--origin-protocol</code></b> sets <code>origin.protocol</code> on the command line, like every other
          setting.</li>
        <li><b>Environment values that look like numbers</b>, like <code>KELLNR_ORIGIN__HOSTNAME=123456</code> or a
          password <code>000123</code>, no longer stop Kellnr at startup.</li>
        <li><b>Docs builds</b> work when Kellnr runs with <code>CARGO_TARGET_DIR</code> set.</li>
        <li><b>The OpenAPI document</b> at <code>/api/openapi.json</code> (Swagger UI at <code>/api/docs</code>)
          describes every endpoint and is valid, so client generators accept it.</li>
        <li><b>Shutdown</b> waits for running toolchain processing and the docs storage migration, and background tasks
          restart after a crash instead of stopping silently.</li>
      </ul>
    </TextBlock>

    <CodeBlock lang="toml">
[registry]
cache_size = 1000
cache_max_size = 0 # MB, 0 = no limit

[webhooks]
ignore_env_proxy = false
    </CodeBlock>

    <TextBlock>
      All settings are described in the <a href="/documentation">documentation</a>. If something does not work as
      expected after the upgrade, please open an issue on
      <a href="https://github.com/kellnr/kellnr/issues">GitHub</a>.
    </TextBlock>
  </BlogPostTemplate>
</template>
