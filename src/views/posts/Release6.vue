<script setup lang="ts">
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
import CodeBlock from "../../components/elements/CodeBlock.vue";
import WarnBlock from "../../components/elements/WarnBlock.vue";
</script>

<template>
    <BlogPostTemplate title="Kellnr Version 6.0.0" date="28. January, 2026">
        <TextBlock>
            Kellnr 6.0.0 is here with a completely redesigned command-line interface, OAuth2/OIDC authentication support,
            and important changes to how configuration works. This is a major release with breaking changes that require
            attention when upgrading from previous versions.
        </TextBlock>

        <WarnBlock>
            Before upgrading to v6.0.0, you must be running Kellnr v5.14.x or later. If you are on an earlier version,
            upgrade to v5.14.x first, then upgrade to v6.0.0. Direct upgrades from versions prior to v5.14.x are not supported.
        </WarnBlock>

        <SubHeader id="cli">New Command-Line Interface</SubHeader>
        <TextBlock>
            The most significant change in v6.0.0 is the introduction of a proper CLI with subcommands. Previously, Kellnr
            was started by simply running the binary. Now, explicit commands are required.
        </TextBlock>

        <TextBlock>
            <b>Starting the Server</b><br />
            The server is now started with the <code>run</code> command:
        </TextBlock>

        <CodeBlock lang="bash">
# Old way (no longer works)
./kellnr

# New way
kellnr run -d /var/lib/kellnr

# With custom port
kellnr run -d /var/lib/kellnr -p 8080

# With configuration file
kellnr -c /etc/kellnr/kellnr.toml run
        </CodeBlock>

        <TextBlock>
            <b>Configuration Management</b><br />
            New commands help manage configuration files:
        </TextBlock>

        <CodeBlock lang="bash">
# Create a default configuration file
kellnr config init -o /etc/kellnr/kellnr.toml

# Show the current configuration
kellnr config show

# Show configuration from a specific file
kellnr -c /etc/kellnr/kellnr.toml config show
        </CodeBlock>

        <SubHeader id="configuration">Configuration Changes</SubHeader>
        <TextBlock>
            Configuration handling has been completely reworked. The automatic discovery of configuration files from
            default directories has been removed. You must now explicitly provide configuration through one of these methods:
        </TextBlock>

        <TextBlock>
            <b>Configuration Priority (highest to lowest):</b>
            <ol>
                <li>CLI arguments (e.g., <code>--local-port 8080</code>)</li>
                <li>Environment variables (e.g., <code>KELLNR_LOCAL__PORT=8080</code>)</li>
                <li>Configuration file (via <code>-c</code> flag or <code>KELLNR_CONFIG_FILE</code> env var)</li>
                <li>Default values</li>
            </ol>
        </TextBlock>

        <TextBlock>
            <b>Data Directory is Now Required</b><br />
            The data directory no longer has a default value. You must explicitly configure it via CLI argument,
            environment variable, or configuration file. Kellnr will exit with an error if no data directory is configured.
        </TextBlock>

        <CodeBlock lang="bash">
# Via CLI argument
kellnr run -d /var/lib/kellnr

# Via environment variable
export KELLNR_REGISTRY__DATA_DIR=/var/lib/kellnr
kellnr run

# Via configuration file
kellnr -c kellnr.toml run
        </CodeBlock>

        <SubHeader id="oauth2">OAuth2/OIDC Authentication</SubHeader>
        <TextBlock>
            Kellnr now supports OAuth2/OpenID Connect authentication, allowing users to log in with their existing
            identity provider credentials (Authentik, Keycloak, Okta, Azure AD, etc.). When enabled, an SSO login
            button appears on the login page alongside the traditional username/password form.
        </TextBlock>

        <TextBlock>
            Key features include:
            <ul>
                <li>PKCE (Proof Key for Code Exchange) for secure authorization</li>
                <li>Automatic user provisioning on first login</li>
                <li>Group-based admin and read-only role assignment</li>
                <li>Customizable login button text</li>
            </ul>
        </TextBlock>

        <CodeBlock lang="toml">
[oauth2]
enabled = true
issuer_url = "https://authentik.example.com/application/o/kellnr/"
client_id = "your-client-id"
# Set client_secret via KELLNR_OAUTH2__CLIENT_SECRET env var
scopes = ["openid", "profile", "email"]
auto_provision_users = true
admin_group_claim = "groups"
admin_group_value = "kellnr-admins"
button_text = "Login with SSO"
        </CodeBlock>

        <TextBlock>
            For detailed configuration options, see the <router-link to="/documentation#oauth2">OAuth2/OIDC documentation</router-link>.
        </TextBlock>

        <SubHeader id="docker">Docker Changes</SubHeader>
        <TextBlock>
            Docker users need to update their deployment configuration. The entrypoint has changed to use the new CLI:
        </TextBlock>

        <CodeBlock lang="bash">
# Old Docker run command
docker run -p 8000:8000 \
  -e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" \
  -v $(pwd):/opt/kdata \
  ghcr.io/kellnr/kellnr:5

# New Docker run command (v6)
docker run -p 8000:8000 \
  -e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" \
  -e "KELLNR_REGISTRY__DATA_DIR=/opt/kdata" \
  -v $(pwd):/opt/kdata \
  ghcr.io/kellnr/kellnr:6
        </CodeBlock>

        <TextBlock>
            If you use a custom configuration file, mount it and set the <code>KELLNR_CONFIG_FILE</code> environment variable:
        </TextBlock>

        <CodeBlock lang="bash">
docker run -p 8000:8000 \
  -e "KELLNR_CONFIG_FILE=/etc/kellnr/kellnr.toml" \
  -v /path/to/kellnr.toml:/etc/kellnr/kellnr.toml:ro \
  -v /path/to/data:/opt/kdata \
  ghcr.io/kellnr/kellnr:6
        </CodeBlock>

        <SubHeader id="env-vars">Environment Variable Changes</SubHeader>
        <TextBlock>
            Compile-time environment variables used during the build process have been renamed with a new prefix.
            This only affects users who build Kellnr from source:
        </TextBlock>

        <TextBlock>
            <table class="table">
                <thead>
                    <tr>
                        <th>Old Name</th>
                        <th>New Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>KELLNR_VERSION</code></td>
                        <td><code>KELLNR_COMPTIME__VERSION</code></td>
                    </tr>
                    <tr>
                        <td><code>KELLNR_CONFIG_DIR</code></td>
                        <td><code>KELLNR_COMPTIME__CONFIG_FILE</code></td>
                    </tr>
                    <tr>
                        <td><code>KELLNR_DATA_DIR</code></td>
                        <td><code>KELLNR_COMPTIME__DATA_DIR</code></td>
                    </tr>
                </tbody>
            </table>
        </TextBlock>

        <SubHeader id="upgrade">Upgrade Guide</SubHeader>
        <TextBlock>
            Follow these steps to safely upgrade from v5.x to v6.0.0:
        </TextBlock>

        <TextBlock>
            <b>Step 1: Verify Your Current Version</b><br />
            Ensure you are running Kellnr v5.14.x or later. If not, upgrade to v5.14.x first.
        </TextBlock>

        <TextBlock>
            <b>Step 2: Back Up Your Data</b><br />
            Back up your data directory (default: <code>/opt/kdata</code>) and any configuration files.
        </TextBlock>

        <CodeBlock lang="bash">
# Backup data directory
cp -r /opt/kdata /opt/kdata.backup

# Backup configuration (if using a config file)
cp /etc/kellnr/kellnr.toml /etc/kellnr/kellnr.toml.backup
        </CodeBlock>

        <TextBlock>
            <b>Step 3: Create or Update Configuration</b><br />
            Generate a new configuration file and migrate your settings:
        </TextBlock>

        <CodeBlock lang="bash">
# Download the new version
curl --output kellnr-latest.zip \
  "https://github.com/kellnr/kellnr/releases/latest/download/kellnr-x86_64-unknown-linux-gnu.zip"
unzip kellnr-latest.zip -d kellnr-new

# Generate a default configuration
./kellnr-new/kellnr config init -o kellnr.toml

# Edit kellnr.toml and migrate your settings from the old configuration
        </CodeBlock>

        <TextBlock>
            <b>Step 4: Update Startup Scripts</b><br />
            Update any systemd services, Docker Compose files, or startup scripts to use the new CLI:
        </TextBlock>

        <CodeBlock lang="bash">
# Example systemd service update
# Old: ExecStart=/opt/kellnr/kellnr
# New:
ExecStart=/opt/kellnr/kellnr run
Environment=KELLNR_CONFIG_FILE=/etc/kellnr/kellnr.toml
        </CodeBlock>

        <TextBlock>
            <b>Step 5: Start Kellnr</b><br />
            Start Kellnr with the new CLI and verify it runs correctly:
        </TextBlock>

        <CodeBlock lang="bash">
kellnr -c /etc/kellnr/kellnr.toml run
        </CodeBlock>

        <SubHeader id="help">Your Help Is Required</SubHeader>
        <TextBlock>
            As with every major release, there may be bugs. If you find any issues in Kellnr itself, the documentation,
            installer script, or Helm chart, please report them on the corresponding GitHub page. Pull requests that
            fix issues are always welcome.
        </TextBlock>

        <TextBlock>
            You find all the repositories here:
            <ul>
                <li><a href="https://github.com/kellnr/kellnr">Kellnr</a></li>
                <li><a href="https://github.com/kellnr/installer">Installer Script</a></li>
                <li><a href="https://github.com/kellnr/helm">Helm Chart</a></li>
            </ul>
        </TextBlock>
    </BlogPostTemplate>
</template>
