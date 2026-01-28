<script setup lang="ts">
import CodeBlock from "../components/elements/CodeBlock.vue";
import TextBlock from "../components/elements/TextBlock.vue";
import WarnBlock from "../components/elements/WarnBlock.vue";
import TableBlock from "../components/elements/TableBlock.vue";
import SubHeader from "../components/elements/SubHeader.vue";
import MainHeader from "../components/elements/MainHeader.vue";
import ConfigCard from "../components/elements/ConfigCard.vue";
import ConfigGrid from "../components/elements/ConfigGrid.vue";
</script>

<template>
  <div>
    <!-- Hero Start -->
    <section class="bg-half bg-light d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title"> Documentation </h4>
              <h5 class="title">Kellnr v5</h5>
              <div class="page-next">
                <nav aria-label="breadcrumb" class="d-inline-block">
                  <ul class="breadcrumb bg-white rounded shadow mb-0">
                    <li class="breadcrumb-item">
                      <router-link to="/">Kellnr</router-link>
                    </li>
                    <li class="breadcrumb-item">
                      <router-link to="#">Docs</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">Documentation</li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->
    </section>
    <!--end section-->
    <!-- Hero End -->

    <!-- Shape Start -->
    <div class="position-relative">
      <div class="shape overflow-hidden text-white">
        <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
    <!--Shape End-->

    <!-- Documentation Start -->
    <section class="section">
      <div class="container">
        <div class="doc-layout">
          <!-- Sticky Sidebar TOC -->
          <aside class="toc-sidebar">
            <h6 class="toc-title">On this page</h6>
            <ul class="toc-list">
              <li>
                <router-link to="#installation">Installation</router-link>
                <ul>
                  <li><router-link to="#docker-container">Docker Container</router-link></li>
                  <li><router-link to="#package-managers">Package Managers</router-link></li>
                  <li><router-link to="#script">Script</router-link></li>
                  <li><router-link to="#cargo-install">Cargo Install</router-link></li>
                  <li><router-link to="#manual-installation">Manual Installation</router-link></li>
                  <li><router-link to="#helm-chart">Helm Chart</router-link></li>
                </ul>
              </li>
              <li><router-link to="#uninstall">Uninstall</router-link></li>
              <li>
                <router-link to="#configuration">Configuration</router-link>
                <ul>
                  <li><router-link to="#config-file">Config File</router-link></li>
                  <li><router-link to="#env-variables">Environment Variables</router-link></li>
                  <li><router-link to="#config-values">Config Values</router-link></li>
                  <li><router-link to="#authentication">Authentication</router-link></li>
                  <li><router-link to="#oauth2">OAuth2/OIDC</router-link></li>
                  <li><router-link to="#cratesio-proxy">Crates.io Proxy Cache</router-link></li>
                  <li><router-link to="#database">Database Backend</router-link></li>
                  <li><router-link to="#webhooks">Webhooks</router-link></li>
                </ul>
              </li>
              <li>
                <router-link to="#cli">Command Line Interface</router-link>
                <ul>
                  <li><router-link to="#cli-run">Run Command</router-link></li>
                  <li><router-link to="#cli-config">Config Command</router-link></li>
                  <li><router-link to="#cli-arguments">CLI Arguments</router-link></li>
                </ul>
              </li>
              <li>
                <router-link to="#configure-cargo">Configure Cargo</router-link>
                <ul>
                  <li><router-link to="#global-config">Global Configuration</router-link></li>
                  <li><router-link to="#per-proj-config">Per Project Configuration</router-link></li>
                  <li><router-link to="#pull-publish-to-kellnr">Pull & Push to Kellnr</router-link></li>
                  <li><router-link to="#cratesio-proxy-cache">Crates.io Proxy Cache</router-link></li>
                  <li><router-link to="#pull-specific-crates">Pull specific Crates</router-link></li>
                  <li><router-link to="#replace-cratesio">Replace Crates.io</router-link></li>
                </ul>
              </li>
              <li>
                <router-link to="#rustdoc">Rustdoc</router-link>
                <ul>
                  <li><router-link to="#manual-rustdoc">Manual Upload</router-link></li>
                </ul>
              </li>
              <li><router-link to="#backup">Backup</router-link></li>
            </ul>
          </aside>

          <!-- Main Content -->
          <div class="doc-content">
            <MainHeader id="installation" icon="download">Installation</MainHeader>
            <TextBlock>
              There are several methods to install Kellnr. Check all options and chose the right one
              for you.
            </TextBlock>

            <SubHeader id="docker-container">Docker Container</SubHeader>
            <TextBlock>
              The easiest way to run Kellnr is a Docker container, as no further installation steps
              are required.
              You can find the latest version tag on the <a
                href="https://github.com/kellnr/kellnr/pkgs/container/kellnr">Kellnr
                images</a> page. There is a minimal image, which does not support building <i>rustdocs</i> with <i>kellnr</i>. However, uploading pre-built <i>rustdocs</i> is still possible. You find the minimal images here: <a href="https://github.com/kellnr/kellnr/pkgs/container/kellnr-minimal">Kellnr minimal images</a>.
            </TextBlock>

            <CodeBlock lang="bash">
              # Run Kellnr non-persistent for testing.
              # All data (crates, users) will be deleted with the container when the container terminates
              docker run --rm -it \
              -p 8000:8000 \
              -e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" ghcr.io/kellnr/kellnr:5

              # To run the container with persistence for all data (crates, users) mount a volume into the container
              docker run --rm -it \
              -p 8000:8000 \
              -e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" \
              -v $(pwd):/opt/kdata ghcr.io/kellnr/kellnr:5
            </CodeBlock>

            <TextBlock>
              You may want to change the admin password used to log into
              the web-ui and the admin token, used by Cargo to authenticate to Kellnr. The <b>hostname</b> is, where
              Kellnr is reachable. If not set correctly, Cargo
              will not be able to publish crates to Kellnr. Defaults to <i>localhost</i>.<br />
              The values can be set with environment variables on the first start of Kellnr. If you ran
              the container with a mounted volume for persistence, all variables are ignored.
            </TextBlock>

            <SubHeader id="package-managers">Package Managers</SubHeader>
            <TextBlock>
              Kellnr can be found in the Arch User Repo (aur): <a
                href="https://aur.archlinux.org/packages/kellnr">Kellnr - AUR</a>
              If you use the <a href="https://github.com/Jguer/yay">yay</a> package manager you can install Kellnr with
              the following command.
            </TextBlock>
            <CodeBlock lang="bash">
              # Install Kellnr with yay
              yay -S kellnr
            </CodeBlock>

            <SubHeader id="script">Script</SubHeader>
            <TextBlock>
              The installation script is tested on current Debian Server versions. Any other modern Linux
              distribution may work, but we cannot guarantee that. If the script does not work for your distribution,
              try the <i>-m</i> flag. This forces the installer script to use a static binary compiled with <i>musl</i>,
              which works independent of any distribution. If that does not work, have a look at "Manual Installation".
              The script will automatically install the right
              version for your architecture. Currently supported are x64 and aarch64 (arm64). <br />
              <br />
              Before starting the installation process, make sure you have the needed rights (sudo) and
              checked the list with possible options below.
              Remember that if you used rustup to install cargo there might be a high chance that rustc is only
              installed for your own user and not root.
            </TextBlock>

            <CodeBlock lang="bash">
              # Go to the directory where Kellnr should be installed. For example:
              cd ~

              # Example: Download and install Kellnr as a systemd service with custom admin password for Kellnr
              curl -s https://raw.githubusercontent.com/kellnr/installer/main/install.sh | sudo bash -s -- -s -p myadminpwd
              # Alternatively, you can use the following command if you installed cargo using rustup:
              curl -s https://raw.githubusercontent.com/kellnr/installer/main/install.sh | sudo PATH="$HOME/.cargo/bin:$PATH" bash -s -- -s -p myadminpwd

              # Start the service (if installed with -s flag)
              sudo systemctl enable kellnr
              sudo systemctl start kellnr

              # Check if the service runs
              sudo systemctl status kellnr

              # Open the configured port (default 8000)
            </CodeBlock>

            <TableBlock>
              <thead>
                <tr>
                  <th scope="col">Argument</th>
                  <th scope="col">Description</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-d /data/dir</td>
                  <td>Directory where Kellnr saves all data, e.g. uploaded crates</td>
                  <td>Must be different to the installation directory. Default is <i>$HOME/kdata</i></td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-h</td>
                  <td>Show help</td>
                  <td>-</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-v "1.0.0"</td>
                  <td>Install a specific version</td>
                  <td>Default is the latest version</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-p password</td>
                  <td>Password for the admin user</td>
                  <td>Default is random (printed on installation)</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-t access_token</td>
                  <td>Cargo access token for the admin user</td>
                  <td>Default is random (printed on installation)</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-s</td>
                  <td>Create systemd service for Kellnr</td>
                  <td>Needs "sudo" rights</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>-m</td>
                  <td>Install a static binary compiled with musl</td>
                  <td>Defaults to "false"</td>
                  <td>No</td>
                </tr>
              </tbody>
            </TableBlock>

            <SubHeader id="cargo-install">Cargo Install</SubHeader>
            <TextBlock>
              If you have Rust and Cargo installed on your system, you can install Kellnr with Cargo as
              well. This will build Kellnr from source on your system.
            </TextBlock>
            <CodeBlock lang="bash">
              # Install Kellnr with Cargo
              cargo install kellnr
              # If you run into issues with OpenSSL, try the following command:
              cargo install kellnr --features vendored-openssl
              # Run kellnr (if not in PATH, the binary is located in $HOME/.cargo/bin/)
              kellnr run -d /path/to/data/dir
            </CodeBlock>

            <SubHeader id="manual-installation">Manual Installation</SubHeader>
            <TextBlock>
              Manually installing Kellnr is possible as well. If the Docker or script approach does not
              work for you, this is the best alternative.<br />
              <br />
              Required dependencies:
              <ul>
                <li>zip (unzip)</li>
                <li>curl</li>
              </ul>
            </TextBlock>
            <CodeBlock lang="bash">
              # Download latest Kellnr version
              # $ARCH can be:
              # - x86_64-unknown-linux-gnu
              # - aarch64-unknown-linux-gnu
              # - x86_64-unknown-linux-musl
              # - aarch64-unknown-linux-musl
              curl --output kellnr-latest.zip "https://github.com/kellnr/kellnr/releases/latest/download/kellnr-$ARCH.zip"

              # Unzip
              unzip -o kellnr-latest.zip -d ./kellnr
              cd ./kellnr

              # (Optional) Create a configuration file
              ./kellnr config init -o kellnr.toml
              # Edit kellnr.toml to set admin_pwd, origin hostname, etc.

              # Open the ports (default 8000)

              # Start Kellnr with the data directory
              ./kellnr run -d /path/to/data/dir

              # Or start with a configuration file
              ./kellnr -c kellnr.toml run
            </CodeBlock>

            <SubHeader id="helm-chart">Helm Chart</SubHeader>
            <TextBlock>
              The recommended way to install Kellnr on Kubernetes is with a Helm Chart. You can find the
              documentation for installing Kellnr with a Helm Chart here: <a
                href="https://github.com/kellnr/helm">Kellnr
                Helm Chart</a>
            </TextBlock>

            <MainHeader id="uninstall" icon="delete">Uninstall</MainHeader>
            <TextBlock>
              To uninstall Kellnr and delete all data (crates, users, ...), if you installed it manully,
              execute the uninstall script besides the Kellnr installation directory.
            </TextBlock>

            <CodeBlock lang="bash">
              # Change to the directory containing the Kellnr installation
              cd ~
              # Run the uninstaller
              curl -s https://raw.githubusercontent.com/kellnr/installer/main/uninstall.sh | sudo bash
            </CodeBlock>

            <TextBlock>
              If you installed Kellnr with the Helm Chart run the command below. Beware that all data
              (crates, users, ...) will be deleted if you created the <i>PersistentVolume</i> with the
              Helm chart.
            </TextBlock>

            <CodeBlock lang="bash">
              # Uninstall Kellnr Helm Chart
              helm uninstall kellnr
            </CodeBlock>

            <MainHeader id="configuration" icon="cog">Configuration</MainHeader>
            <TextBlock>
              Kellnr expects all configuration settings to be set on application startup. If you need to
              change the configuration, update the config file, set environment variables, or pass CLI
              arguments, then restart Kellnr. Configuration sources are applied in the following priority
              (highest to lowest):
              <ol>
                <li>CLI arguments (e.g., <code>--local-port 8080</code>)</li>
                <li>Environment variables (e.g., <code>KELLNR_LOCAL__PORT=8080</code>)</li>
                <li>Configuration file</li>
                <li>Default values</li>
              </ol>
              For CLI argument details, see the <router-link to="#cli">Command Line Interface</router-link> section.
            </TextBlock>

            <SubHeader id="config-file">Config File</SubHeader>
            <TextBlock>
              Kellnr can use a TOML configuration file. You can generate a default configuration file using
              <code>kellnr config init</code> or specify a custom config file path with the <code>-c</code>
              flag (e.g., <code>kellnr -c /etc/kellnr.toml run</code>). Values from the config file can be
              overwritten by environment variables or CLI arguments. See below for possible values.
            </TextBlock>

            <SubHeader id="env-variables">Environment Variables</SubHeader>
            <TextBlock>
              All values from the config file can be overwritten by environment variables. This is the
              recommended way for Kubernetes and Docker installations. Environment variables follow the
              pattern <code>KELLNR_SECTION__KEY</code> (note the double underscore). See below for possible values.
            </TextBlock>

            <SubHeader id="config-values">Config Values</SubHeader>
            <TextBlock>
              Beware that the default values and required values differ for the Helm chart. See
              <router-link to="#helm-chart">Helm Chart
              </router-link>
              for more information. Some values are only used on
              first start and than written to the internal database of Kellnr. These values cannot be
              overwritten after the first start of Kellnr, except through the UI of Kellnr.
            </TextBlock>

            <h5 class="mt-4 mb-3">Setup</h5>
            <ConfigGrid>
              <ConfigCard
                title="Admin Password"
                toml="[setup] admin_pwd"
                env-var="KELLNR_SETUP__ADMIN_PWD"
                default-value="admin"
                description="Password for the admin user. Used on first start only."
              />
              <ConfigCard
                title="Admin Token"
                toml="[setup] admin_token"
                env-var="KELLNR_SETUP__ADMIN_TOKEN"
                default-value="Zy9HhJ02RJmg0GCrgLfaCVfU6IwDfhXD"
                description="Authentication token for the admin user. Used on first start only."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Registry</h5>
            <ConfigGrid>
              <ConfigCard
                title="Data Directory"
                toml="[registry] data_dir"
                env-var="KELLNR_REGISTRY__DATA_DIR"
                default-value="/opt/kdata"
                description="Directory where Kellnr stores all its data."
              />
              <ConfigCard
                title="Session Age"
                toml="[registry] session_age_seconds"
                env-var="KELLNR_REGISTRY__SESSION_AGE_SECONDS"
                default-value="28800"
                description="Seconds until a user is logged out of his browser session."
              />
              <ConfigCard
                title="Cache Size"
                toml="[registry] cache_size"
                env-var="KELLNR_REGISTRY__CACHE_SIZE"
                default-value="1000"
                description="Number of crates cached in-memory to decrease disk I/O. If set to '0' the cache is disabled."
              />
              <ConfigCard
                title="Max Crate Size"
                toml="[registry] max_crate_size"
                env-var="KELLNR_REGISTRY__MAX_CRATE_SIZE"
                default-value="10"
                description="Max size of crates allowed to be uploaded in MB."
              />
              <ConfigCard
                title="Max DB Connections"
                toml="[registry] max_db_connections"
                env-var="KELLNR_REGISTRY__MAX_DB_CONNECTIONS"
                default-value="0"
                description="Max number of internal database connections. '0' disables the limit."
              />
              <ConfigCard
                title="Cookie Signing Key"
                toml="[registry] cookie_signing_key"
                env-var="KELLNR_REGISTRY__COOKIE_SIGNING_KEY"
                default-value="None"
                description="Signing key for UI auth cookies. If not set, a random one is generated. Needs to be set to an (at least 64 byte) long string if you intend to run multiple instances of kellnr which share a login."
              />
              <ConfigCard
                title="Authentication Required"
                toml="[registry] auth_required"
                env-var="KELLNR_REGISTRY__AUTH_REQUIRED"
                default-value="false"
                description="Enable/Disable authentication for crates pulls and disable anonymous users for the web UI."
              />
              <ConfigCard
                title="Required Crate Fields"
                toml="[registry] required_crate_fields"
                env-var="KELLNR_REGISTRY__REQUIRED_CRATE_FIELDS"
                default-value="[]"
                description="Requires fields to be defined on upload crates. Leave empty to not add restrictions. If set to e.g. ['authors', 'repository'], all uploaded crates have to have the authors and repository defined in their Cargo.toml's."
              />
              <ConfigCard
                title="New Crates Restricted"
                toml="[registry] new_crates_restricted"
                env-var="KELLNR_REGISTRY__NEW_CRATES_RESTRICTED"
                default-value="false"
                description="If set to true, new crates can only be created by 'crate users'. This means an admin user has to push the first version of a crate and add crate users to the crate."
              />
              <ConfigCard
                title="Allow Ownerless Crates"
                toml="[registry] allow_ownerless_crates"
                env-var="KELLNR_REGISTRY__ALLOW_OWNERLESS_CRATES"
                default-value="false"
                description="If set to true, crates are allowed to have no owner. Else, at least one owner is required."
              />
              <ConfigCard
                title="Token Cache Enabled"
                toml="[registry] token_cache_enabled"
                env-var="KELLNR_REGISTRY__TOKEN_CACHE_ENABLED"
                default-value="true"
                description="If set to true, instead of validating the Cargo token each time against the DB, cache it."
              />
              <ConfigCard
                title="Token Cache TTL"
                toml="[registry] token_cache_ttl_seconds"
                env-var="KELLNR_REGISTRY__TOKEN_CACHE_TTL_SECONDS"
                default-value="1800"
                description="Cache TTL in seconds (default: 30 mins)."
              />
              <ConfigCard
                title="Token Cache Max Capacity"
                toml="[registry] token_cache_max_capacity"
                env-var="KELLNR_REGISTRY__TOKEN_CACHE_MAX_CAPACITY"
                default-value="10000"
                description="Maximum number of cached tokens."
              />
              <ConfigCard
                title="Token DB Retry Count"
                toml="[registry] token_db_retry_count"
                env-var="KELLNR_REGISTRY__TOKEN_DB_RETRY_COUNT"
                default-value="3"
                description="Number of retries for token database operations."
              />
              <ConfigCard
                title="Token DB Retry Delay"
                toml="[registry] token_db_retry_delay_ms"
                env-var="KELLNR_REGISTRY__TOKEN_DB_RETRY_DELAY_MS"
                default-value="100"
                description="Delay between retries in milliseconds."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Local Server</h5>
            <ConfigGrid>
              <ConfigCard
                title="IP Address"
                toml="[local] ip"
                env-var="KELLNR_LOCAL__IP"
                default-value="0.0.0.0"
                description="IP address where Kellnr listens. Usually this does not need to be changed."
              />
              <ConfigCard
                title="Port"
                toml="[local] port"
                env-var="KELLNR_LOCAL__PORT"
                default-value="8000"
                description="Port where Kellnr listens."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Origin (External Access)</h5>
            <ConfigGrid>
              <ConfigCard
                title="Hostname"
                toml="[origin] hostname"
                env-var="KELLNR_ORIGIN__HOSTNAME"
                default-value="127.0.0.1"
                description="Hostname where Kellnr is reachable from, e.g. DNS name behind a reverse proxy."
              />
              <ConfigCard
                title="Port"
                toml="[origin] port"
                env-var="KELLNR_ORIGIN__PORT"
                default-value="8000"
                description="If a proxy is in front of Kellnr with a different port as Kellnr itself, the port from the proxy has to be set here."
              />
              <ConfigCard
                title="Protocol"
                toml="[origin] protocol"
                env-var="KELLNR_ORIGIN__PROTOCOL"
                default-value="http"
                description="Either 'http' or 'https'. This does not enable TLS on Kellnr, but needs to be set if a TLS proxy is used in front of Kellnr."
              />
              <ConfigCard
                title="Path"
                toml="[origin] path"
                env-var="KELLNR_ORIGIN__PATH"
                default-value=""
                description="Run Kellnr on a sub path of a URL, e.g. '/kellnring/' for https://www.example.com/kellnring/"
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Logging</h5>
            <ConfigGrid>
              <ConfigCard
                title="Log Level"
                toml="[log] level"
                env-var="KELLNR_LOG__LEVEL"
                default-value="info"
                description="Log level for debugging. Either 'trace', 'debug', 'info', 'warn' or 'error'."
              />
              <ConfigCard
                title="Web Server Log Level"
                toml="[log] level_web_server"
                env-var="KELLNR_LOG__LEVEL_WEB_SERVER"
                default-value="warn"
                description="Log level for the web server. Either 'trace', 'debug', 'info', 'warn' or 'error'."
              />
              <ConfigCard
                title="Log Format"
                toml="[log] format"
                env-var="KELLNR_LOG__FORMAT"
                default-value="compact"
                description="Format of the log output. Either 'compact', 'pretty' or 'json'."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Crates.io Proxy</h5>
            <ConfigGrid>
              <ConfigCard
                title="Proxy Enabled"
                toml="[proxy] enabled"
                env-var="KELLNR_PROXY__ENABLED"
                default-value="false"
                description="Enable crates.io proxy to use Kellnr as a proxy-cache for crates.io."
              />
              <ConfigCard
                title="Number of Threads"
                toml="[proxy] num_threads"
                env-var="KELLNR_PROXY__NUM_THREADS"
                default-value="10"
                description="Number of threads used to keep crates.io cache up-to-date."
              />
              <ConfigCard
                title="Download on Update"
                toml="[proxy] download_on_update"
                env-var="KELLNR_PROXY__DOWNLOAD_ON_UPDATE"
                default-value="false"
                description="Periodically pre-fetch crates from crates.io that had an update."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">Documentation</h5>
            <ConfigGrid>
              <ConfigCard
                title="Rustdoc Generation"
                toml="[docs] enabled"
                env-var="KELLNR_DOCS__ENABLED"
                default-value="false"
                description="If 'true', rustdocs are generated for each uploaded crate automatically."
              />
              <ConfigCard
                title="Max Doc Size"
                toml="[docs] max_size"
                env-var="KELLNR_DOCS__MAX_SIZE"
                default-value="100"
                description="Max size of crate docs allowed to be uploaded in MB."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">PostgreSQL</h5>
            <ConfigGrid>
              <ConfigCard
                title="PostgreSQL Enabled"
                toml="[postgresql] enabled"
                env-var="KELLNR_POSTGRESQL__ENABLED"
                default-value="false"
                description="Enable PostgreSQL instead of Sqlite."
              />
              <ConfigCard
                title="Server Address"
                toml="[postgresql] address"
                env-var="KELLNR_POSTGRESQL__ADDRESS"
                default-value="localhost"
                description="Address of the PostgreSQL server."
              />
              <ConfigCard
                title="Server Port"
                toml="[postgresql] port"
                env-var="KELLNR_POSTGRESQL__PORT"
                default-value="5432"
                description="Port of the PostgreSQL server."
              />
              <ConfigCard
                title="Database Name"
                toml="[postgresql] db"
                env-var="KELLNR_POSTGRESQL__DB"
                default-value="kellnr"
                description="Database name of the PostgreSQL server."
              />
              <ConfigCard
                title="Username"
                toml="[postgresql] user"
                env-var="KELLNR_POSTGRESQL__USER"
                default-value=""
                description="User name of the PostgreSQL database."
              />
              <ConfigCard
                title="Password"
                toml="[postgresql] pwd"
                env-var="KELLNR_POSTGRESQL__PWD"
                default-value=""
                description="Password of the PostgreSQL database."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">S3 Storage</h5>
            <ConfigGrid>
              <ConfigCard
                title="S3 Enabled"
                toml="[s3] enabled"
                env-var="KELLNR_S3__ENABLED"
                default-value="false"
                description="Enable S3 storage instead of local file system."
              />
              <ConfigCard
                title="Access Key"
                toml="[s3] access_key"
                env-var="KELLNR_S3__ACCESS_KEY"
                default-value="minioadmin"
                description="Access key for the S3 storage."
              />
              <ConfigCard
                title="Secret Key"
                toml="[s3] secret_key"
                env-var="KELLNR_S3__SECRET_KEY"
                default-value="minioadmin"
                description="Secret key for the S3 storage."
              />
              <ConfigCard
                title="Region"
                toml="[s3] region"
                env-var="KELLNR_S3__REGION"
                default-value="us-east-1"
                description="Region of the S3 storage."
              />
              <ConfigCard
                title="Endpoint"
                toml="[s3] endpoint"
                env-var="KELLNR_S3__ENDPOINT"
                default-value="http://localhost:9000"
                description="Endpoint of the S3 storage."
              />
              <ConfigCard
                title="Allow HTTP"
                toml="[s3] allow_http"
                env-var="KELLNR_S3__ALLOW_HTTP"
                default-value="true"
                description="Allow unsecure S3 connection with HTTP."
              />
              <ConfigCard
                title="Crates Bucket"
                toml="[s3] crates_bucket"
                env-var="KELLNR_S3__CRATES_BUCKET"
                default-value="kellnr-crates"
                description="Bucket where Kellnr stores uploaded crates."
              />
              <ConfigCard
                title="Crates.io Bucket"
                toml="[s3] cratesio_bucket"
                env-var="KELLNR_S3__CRATESIO_BUCKET"
                default-value="kellnr-cratesio"
                description="Bucket for crates.io crates if the proxy is enabled."
              />
            </ConfigGrid>

            <h5 class="mt-4 mb-3">OAuth2/OIDC</h5>
            <ConfigGrid>
              <ConfigCard
                title="OAuth2 Enabled"
                toml="[oauth2] enabled"
                env-var="KELLNR_OAUTH2__ENABLED"
                default-value="false"
                description="Enable OAuth2/OpenID Connect authentication."
              />
              <ConfigCard
                title="Issuer URL"
                toml="[oauth2] issuer_url"
                env-var="KELLNR_OAUTH2__ISSUER_URL"
                default-value=""
                description="OIDC issuer URL for discovery (e.g., https://authentik.example.com/application/o/kellnr/)."
              />
              <ConfigCard
                title="Client ID"
                toml="[oauth2] client_id"
                env-var="KELLNR_OAUTH2__CLIENT_ID"
                default-value=""
                description="OAuth2 client ID from your identity provider."
              />
              <ConfigCard
                title="Client Secret"
                toml="[oauth2] client_secret"
                env-var="KELLNR_OAUTH2__CLIENT_SECRET"
                default-value=""
                description="OAuth2 client secret. Recommended to set via environment variable."
              />
              <ConfigCard
                title="Scopes"
                toml="[oauth2] scopes"
                env-var="KELLNR_OAUTH2__SCOPES"
                default-value='["openid", "profile", "email"]'
                description="OAuth2 scopes to request from the identity provider."
              />
              <ConfigCard
                title="Auto Provision Users"
                toml="[oauth2] auto_provision_users"
                env-var="KELLNR_OAUTH2__AUTO_PROVISION_USERS"
                default-value="true"
                description="Automatically create local user accounts on first OAuth2 login."
              />
              <ConfigCard
                title="Admin Group Claim"
                toml="[oauth2] admin_group_claim"
                env-var="KELLNR_OAUTH2__ADMIN_GROUP_CLAIM"
                default-value=""
                description="JWT claim name containing group memberships (e.g., 'groups')."
              />
              <ConfigCard
                title="Admin Group Value"
                toml="[oauth2] admin_group_value"
                env-var="KELLNR_OAUTH2__ADMIN_GROUP_VALUE"
                default-value=""
                description="Group name that grants admin privileges (e.g., 'kellnr-admins')."
              />
              <ConfigCard
                title="Read-Only Group Claim"
                toml="[oauth2] read_only_group_claim"
                env-var="KELLNR_OAUTH2__READ_ONLY_GROUP_CLAIM"
                default-value=""
                description="JWT claim name for read-only group memberships."
              />
              <ConfigCard
                title="Read-Only Group Value"
                toml="[oauth2] read_only_group_value"
                env-var="KELLNR_OAUTH2__READ_ONLY_GROUP_VALUE"
                default-value=""
                description="Group name that grants read-only access (e.g., 'kellnr-readonly')."
              />
              <ConfigCard
                title="Button Text"
                toml="[oauth2] button_text"
                env-var="KELLNR_OAUTH2__BUTTON_TEXT"
                default-value="Login with SSO"
                description="Text displayed on the OAuth2 login button in the web UI."
              />
            </ConfigGrid>

            <SubHeader id="authentication">Authentication</SubHeader>
            <TextBlock>
              Authentication is required by cargo and Kellnr to push crates. See
              <router-link to="#configure-cargo">Configure Cargo
              </router-link>
              for more information. Authentication on
              pull can be enabled by setting <code>registry.auth_required = true</code> in the config file,
              the environment variable <code>KELLNR_REGISTRY__AUTH_REQUIRED=true</code>, or the CLI flag
              <code>--registry-auth-required</code>. This will force cargo to authenticate on pull as well
              and forces users of the web UI to log in to see any details of crates.
              <br />
              <br />
              If <code>auth_required</code> is set to <code>true</code>, Kellnr needs to be able to authenticate against
              itself. If the doc generation is enabled, the docs can only be build successfully, if Kellnr can pull the
              dependencies from itself.
              To allow that, you have to provide Kellnr with a valid registry authentication token for itself. See <a
                href="https://doc.rust-lang.org/cargo/reference/config.html#hierarchical-structure">Cargo Config</a>,
              where Kellnr searches for a config.
              <br />
              <br />
              It is also possible to restrict crate pulls on a per-crate basis using crate access restriction (available
              in the web UI for administrator users in the settings tab). When only specific crate users are allowed to
              download crates, cargo shall be authenticated on pull using the credentials of a user added to the crate
              users list.
              <br />
              <br />
              In the case of the Kellnr Docker image, you can mount a volume that contains the config file with the
              authentication token to <i>/usr/local/cargo/config.toml</i>.
              <br />
              <br />
              E.g. <i>docker run -v /path/to/config.toml:/usr/local/cargo/config.toml:ro ghcr.io/kellnr/kellnr:5.2.4</i>
              <br />
              <br />
              For more information about authentication and how to configure cargo to use it see: <a
                href="https://doc.rust-lang.org/nightly/cargo/reference/registry-authentication.html">Registry
                Authentication</a>
            </TextBlock>

            <SubHeader id="oauth2">OAuth2/OIDC</SubHeader>
            <TextBlock>
              Kellnr supports OAuth2/OpenID Connect (OIDC) authentication, allowing users to log in with their existing
              identity provider credentials (e.g., Authentik, Keycloak, Okta, Azure AD). When enabled, an SSO login button
              appears on the login page alongside the traditional username/password form.<br />
              <br />
              <b>Features</b>
              <ul>
                <li>PKCE (Proof Key for Code Exchange) for secure authorization code flow</li>
                <li>Automatic user provisioning on first login</li>
                <li>Group-based admin and read-only role assignment</li>
                <li>Customizable login button text</li>
              </ul>
            </TextBlock>

            <TextBlock>
              <b>Configuration Example</b><br />
              To enable OAuth2, configure the following settings in your <i>default.toml</i> or via environment variables:
            </TextBlock>

            <CodeBlock lang="toml">
              [oauth2]
              enabled = true
              issuer_url = "https://authentik.example.com/application/o/kellnr/"
              client_id = "your-client-id"
              # client_secret should be set via KELLNR_OAUTH2__CLIENT_SECRET env var
              scopes = ["openid", "profile", "email"]
              auto_provision_users = true
              admin_group_claim = "groups"
              admin_group_value = "kellnr-admins"
              button_text = "Login with SSO"
            </CodeBlock>

            <TextBlock>
              <b>Identity Provider Setup</b><br />
              When configuring your identity provider (e.g., Authentik), you need to:
              <ol>
                <li>Create a new OAuth2/OIDC application</li>
                <li>Set the redirect URI to: <i>https://your-kellnr-host/api/v1/oauth2/callback</i></li>
                <li>Enable the required scopes: <i>openid</i>, <i>profile</i>, <i>email</i></li>
                <li>Note the client ID and client secret</li>
                <li>Find the issuer URL (typically the provider's base URL + application path)</li>
              </ol>
            </TextBlock>

            <TextBlock>
              <b>User Provisioning</b><br />
              When <i>auto_provision_users</i> is enabled (default), Kellnr automatically creates a local user account
              when someone logs in via OAuth2 for the first time. The username is determined in the following order:
              <ol>
                <li><i>preferred_username</i> claim from the ID token</li>
                <li>Local part of the <i>email</i> claim (before the @)</li>
                <li>The <i>sub</i> (subject) claim as a last resort</li>
              </ol>
              If the username already exists, a numeric suffix is appended (e.g., <i>john_2</i>).<br />
              <br />
              OAuth2 users can generate Cargo API tokens just like regular users, allowing them to publish and pull crates.
            </TextBlock>

            <TextBlock>
              <b>Group-Based Roles</b><br />
              You can automatically assign admin or read-only roles based on group memberships from your identity provider.
              Configure the claim name (e.g., <i>groups</i>) and the group value that should grant the role:
            </TextBlock>

            <CodeBlock lang="toml">
              [oauth2]
              # Users in "kellnr-admins" group become admins
              admin_group_claim = "groups"
              admin_group_value = "kellnr-admins"

              # Users in "kellnr-readonly" group get read-only access
              read_only_group_claim = "groups"
              read_only_group_value = "kellnr-readonly"
            </CodeBlock>

            <WarnBlock>
              The client secret should be kept confidential. It is recommended to set it via the
              <i>KELLNR_OAUTH2__CLIENT_SECRET</i> environment variable rather than storing it in the config file.
            </WarnBlock>

            <SubHeader id="cratesio-proxy">Crates.io Proxy Cache</SubHeader>
            <TextBlock>
              Kellnr can be used as a proxy cache for <a href="https://crates.io/">crates.io</a>. If the
              proxy is enabled, Kellnr caches all crates requested from <a href="https://crates.io/">crates.io</a>
              after their first download. All subsequent request for that crate are then served by Kellnr
              instead of <a href="https://crates.io/">crates.io</a>. To enable the proxy, set
              <code>proxy.enabled = true</code> in the config file, the environment variable
              <code>KELLNR_PROXY__ENABLED=true</code>, or use the CLI flag <code>--proxy-enabled</code>.<br />
              <br />
              <b>Attention</b><br />
              If you enable the proxy, Kellnr caches every crate from crates.io that is requested through Kellnr. This
              means that the first download of a crate is a bit slower, as it is first downloaded from crates.io and
              then cached by Kellnr. All subsequent request are faster, as Kellnr now responds from the cache and
              crates.io is not requested anymore.
              <br />
              We strongly recommend to run Kellnr on fast SSD storage if you enable the crates.io proxy.
              The index is very IO heavy and the speed of the disk determines how fast cargo is able to
              resolve and update the index if you create a new Rust project.<br />
              <br />
              As the proxy caches all crates that are requested, it can grow significantly in size. The
              index alone takes several GB. We recommend 50GB-100GB for the cached crates.<br />
              <br />
              For information on how to configure cargo to Kellnr instead of crates.io, see
              <router-link to="#configure-cargo">Configure Cargo
              </router-link>.
            </TextBlock>

            <SubHeader id="database">Database Backend</SubHeader>
            <TextBlock>
              Kellnr uses <a href="https://sqlite.org/index.html">Sqlite</a> as its default database
              backend. This is the default way to run Kellnr. If you want to use <a
                href="https://www.postgresql.org/">PostgreSQL</a> instead,
              you can enable it by setting <code>postgresql.enabled = true</code> in the config file,
              the environment variable <code>KELLNR_POSTGRESQL__ENABLED=true</code>, or the CLI flag
              <code>--postgresql-enabled</code>.<br />
              <br />
              If you enable PostgreSQL, you need to set the following values in the config file,
              environment variables, or CLI arguments:
              <ul>
                <li><code>postgresql.address</code> / <code>KELLNR_POSTGRESQL__ADDRESS</code> / <code>--postgresql-address</code></li>
                <li><code>postgresql.port</code> / <code>KELLNR_POSTGRESQL__PORT</code> / <code>--postgresql-port</code></li>
                <li><code>postgresql.db</code> / <code>KELLNR_POSTGRESQL__DB</code> / <code>--postgresql-db</code></li>
                <li><code>postgresql.user</code> / <code>KELLNR_POSTGRESQL__USER</code> / <code>--postgresql-user</code></li>
                <li><code>postgresql.pwd</code> / <code>KELLNR_POSTGRESQL__PWD</code> / <code>--postgresql-pwd</code></li>
              </ul>
              The PostgreSQL database needs to be created manually before starting Kellnr. Kellnr will
              create all tables and indexes automatically on first start.
            </TextBlock>

            <SubHeader id="webhooks">Webhooks</SubHeader>
            <TextBlock>
              Kellnr offers a basic webhook functionality allowing callback notifications
            when crates are added or modified.<br /><br />
              Webhooks can be registered by admin users via API calls:
            </TextBlock>

            <CodeBlock lang="bash">
              curl kellnr_url/api/v1/webhook -X POST \
              -H "Authorization: Bearer ADMIN-TOKEN" \
              -H "Content-Type: application/json" \
              -d '{
                "type": "crate_yank",
                "callback_url": "http://my-other-service:8000/crate-yank",
                "name": "My yank webhook"
              }'

              # Successful response will contain registered webhook's id:
              {"id":"f9e8a090-7144-48ff-89d6-fa774d24f59b"}

              # Sample payload sent after a yank event:
              {
                "data": { "crate_name": "test_crate", "crate_version": "0.1.2" },
                "timestamp": "2025-09-24T15:19:04.842575427Z",
                "type": "crate_yank"
              }
            </CodeBlock>

            <TextBlock>
              Available event types are:
              <ul>
                <li><i>crate_add</i></li>
                <li><i>crate_update</i></li>
                <li><i>crate_yank</i></li>
                <li><i>crate_unyank</i></li>
              </ul>

              Unsuccessful deliveries are retried in increasing time intervals, based on Github's guidelines:
              <a href="https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#deliverability-and-reliability">
                https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#deliverability-and-reliability
              </a>

              <br /><br />
              Other administration tasks are also performed via API calls:
            </TextBlock>

            <CodeBlock lang="bash">
              # View specific webhook
              curl kellnr_url/api/v1/webhook/f9e8a090-7144-48ff-89d6-fa774d24f59b \
                  -X GET -H "Authorization: Bearer ADMIN-TOKEN"

              # View all
              curl kellnr_url/api/v1/webhook -X GET -H "Authorization: Bearer ADMIN-TOKEN"

              # Unregister a given webhook
              curl kellnr_url/api/v1/webhook/f9e8a090-7144-48ff-89d6-fa774d24f59b \
                  -X DELETE -H "Authorization: Bearer ADMIN-TOKEN"

              # Test a webhook (sends a dummy payload to the callback_url)
              curl kellnr_url/api/v1/webhook/f9e8a090-7144-48ff-89d6-fa774d24f59b/test \
                  -X GET -H "Authorization: Bearer ADMIN-TOKEN"
            </CodeBlock>

            <MainHeader id="cli" icon="console">Command Line Interface</MainHeader>
            <TextBlock>
              Kellnr provides a command line interface (CLI) to run and configure the server. The CLI supports
              multiple configuration sources with the following priority (highest to lowest):
              <ol>
                <li>CLI arguments</li>
                <li>Environment variables</li>
                <li>Configuration file</li>
                <li>Default values</li>
              </ol>
            </TextBlock>

            <CodeBlock lang="bash">
              # Show help and available commands
              kellnr --help

              # Show version
              kellnr --version
            </CodeBlock>

            <SubHeader id="cli-run">Run Command</SubHeader>
            <TextBlock>
              The <code>run</code> command starts the Kellnr server. The data directory is required and must be set
              via CLI argument, environment variable, or configuration file.
            </TextBlock>

            <CodeBlock lang="bash">
              # Start Kellnr with data directory
              kellnr run -d /var/lib/kellnr

              # Start with custom port
              kellnr run -d /var/lib/kellnr -p 8080

              # Start with debug logging
              kellnr run -d /var/lib/kellnr -l debug

              # Start with a configuration file
              kellnr -c /etc/kellnr.toml run
            </CodeBlock>

            <SubHeader id="cli-config">Config Command</SubHeader>
            <TextBlock>
              The <code>config</code> command provides utilities for managing Kellnr configuration files.
            </TextBlock>

            <CodeBlock lang="bash">
              # Show current configuration as TOML
              kellnr config show

              # Show configuration with a custom config file
              kellnr -c /etc/kellnr.toml config show

              # Create a default configuration file
              kellnr config init

              # Create configuration file at a specific path
              kellnr config init -o /etc/kellnr.toml
            </CodeBlock>

            <SubHeader id="cli-arguments">CLI Arguments</SubHeader>
            <TextBlock>
              All configuration values can be set via CLI arguments when using the <code>run</code> command.
              CLI arguments take precedence over environment variables and configuration file values.
            </TextBlock>

            <h5 class="mt-4 mb-3">Global Options</h5>
            <TableBlock>
              <thead>
                <tr>
                  <th scope="col">Argument</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>-c, --config &lt;FILE&gt;</code></td>
                  <td>Path to TOML configuration file</td>
                </tr>
                <tr>
                  <td><code>--help</code></td>
                  <td>Show help information</td>
                </tr>
                <tr>
                  <td><code>--version</code></td>
                  <td>Show version information</td>
                </tr>
              </tbody>
            </TableBlock>

            <h5 class="mt-4 mb-3">Server Options (run command)</h5>
            <TableBlock>
              <thead>
                <tr>
                  <th scope="col">Argument</th>
                  <th scope="col">Description</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>-d, --registry-data-dir</code></td>
                  <td>Directory where Kellnr stores all data (required)</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td><code>-p, --local-port</code></td>
                  <td>Port where Kellnr listens</td>
                  <td>8000</td>
                </tr>
                <tr>
                  <td><code>--local-ip</code></td>
                  <td>IP address where Kellnr listens</td>
                  <td>0.0.0.0</td>
                </tr>
                <tr>
                  <td><code>-l, --log-level</code></td>
                  <td>Log level (trace, debug, info, warn, error)</td>
                  <td>info</td>
                </tr>
                <tr>
                  <td><code>--log-format</code></td>
                  <td>Log format (compact, pretty, json)</td>
                  <td>compact</td>
                </tr>
                <tr>
                  <td><code>--origin-hostname</code></td>
                  <td>External hostname where Kellnr is reachable</td>
                  <td>127.0.0.1</td>
                </tr>
                <tr>
                  <td><code>--origin-port</code></td>
                  <td>External port (if behind a proxy)</td>
                  <td>8000</td>
                </tr>
                <tr>
                  <td><code>--origin-protocol</code></td>
                  <td>Protocol (http or https)</td>
                  <td>http</td>
                </tr>
              </tbody>
            </TableBlock>

            <h5 class="mt-4 mb-3">Feature Flags (run command)</h5>
            <TableBlock>
              <thead>
                <tr>
                  <th scope="col">Argument</th>
                  <th scope="col">Description</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>--docs-enabled</code></td>
                  <td>Enable automatic rustdoc generation</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td><code>--proxy-enabled</code></td>
                  <td>Enable crates.io proxy cache</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td><code>--registry-auth-required</code></td>
                  <td>Require authentication for crate pulls</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td><code>--postgresql-enabled</code></td>
                  <td>Use PostgreSQL instead of SQLite</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td><code>--s3-enabled</code></td>
                  <td>Use S3 storage instead of local filesystem</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td><code>--oauth2-enabled</code></td>
                  <td>Enable OAuth2/OIDC authentication</td>
                  <td>false</td>
                </tr>
              </tbody>
            </TableBlock>

            <TextBlock>
              For a complete list of all CLI arguments, run <code>kellnr run --help</code>. All configuration
              values documented in the <router-link to="#config-values">Config Values</router-link> section
              have corresponding CLI arguments. The argument name follows the pattern
              <code>--section-key</code> (e.g., <code>--postgresql-address</code> for
              <code>[postgresql] address</code>).
            </TextBlock>

            <MainHeader id="configure-cargo" icon="package-variant">Configure Cargo</MainHeader>
            <TextBlock>
              Cargo needs to know about your Kellnr instance to be able to pull and publish crates from
              it.
            </TextBlock>

            <SubHeader id="global-config">Global Configuration</SubHeader>
            <TextBlock>
              To allow all Rust projects on the current system the usage of Kellnr, it needs to be
              registered in your .cargo/config.toml. The advantage of this method is that Kellnr needs to
              be configured only once and can be used from any Rust project from now on this system.<br />
              <br />
              <ul>
                <li>Windows default location: <i>%USERPROFILE%\.cargo\config.toml</i></li>
                <li>Unix default location: <i>$HOME/.cargo/config.toml</i></li>
              </ul>
            </TextBlock>
            <CodeBlock lang="toml">
              # Example .cargo/config.toml
              # The index needs to point to the host where your Kellnr instance runs
              # The token is the authentication token for the user configured in Kellnr
              [registries.kellnr]
              index = "sparse+https://yourkellnrhostname/api/v1/crates/"
              credential-provider = ["cargo:token"]
              token = "yourauthtoken"
            </CodeBlock>

            <SubHeader id="per-proj-config">Per Project Configuration</SubHeader>
          <TextBlock>
            It is possible to configure Kellnr as an additional registry per Rust project. The advantage of
            this method is that the configuration can be checked into git besides the code. If the code is
            checked-out, the registry is already configured and ready to use.<br />
            <br />
            You can add a config file in your current Rust project folder at the root under .cargo or in any
            sub-project.<br />
            <br />

            <ul>
              <li><i>/.cargo/config</i></li>
              <li><i>/projects/.cargo/config</i></li>
              <li><i>/projects/proj1/.cargo/config</i></li>
              <li><i>/projects/proj1/subproj/.cargo/config</i></li>
            </ul>

            Cargo will use the configured registry for the corresponding project.<br />
            <br />
            The config file is the same format at described in the Global Configuration above.
          </TextBlock>

          <SubHeader id="pull-publish-to-kellnr">Pull & Publish to Kellnr</SubHeader>
          <TextBlock>
            To use Kellnr in a Rust project to pull a crate dependency or publish one, you need to configure
            your <i>Cargo.toml</i>.
          </TextBlock>
          <CodeBlock lang="toml">
            # Example Cargo.toml which uses a dependency from Kellnr
            # The registry name has to be the one defined in .cargo/config.toml
            [package]
            authors = ["myauthor "]
            edition = "2018"
            name = "my_crate"
            version = "0.1.0"

            [dependencies]
            my_dep = {version = "1.1.0", registry = "kellnr"}
          </CodeBlock>
          <CodeBlock lang="toml">
            # Example Cargo.toml to publish to Kellnr
            # The publish name has to be the one defined in .cargo/config.toml
            [package]
            authors = ["myauthor "]
            edition = "2018"
            name = "my_crate"
            version = "0.1.0"
            publish = ["kellnr"]

            [dependencies]
            # ... Dependencies ...
          </CodeBlock>
          <TextBlock>Instead of adding the <i>publish</i> field in the <i>Cargo.toml</i> the registry to
            publish to can be set dynamically on cargo <i>publish</i>.
          </TextBlock>
          <CodeBlock lang="bash">
            # Publish to Kellnr by setting the registry to use dynamically
            # The registry name has to be the one defined in .cargo/config.toml
            cargo publish --registry kellnr
          </CodeBlock>

          <SubHeader id="cratesio-proxy-cache">Crates.io Proxy Cache</SubHeader>
          <TextBlock>
            If the <a href="https://crates.io/">crates.io</a> proxy cache mode is enabled (see
            <router-link to="#cratesio-proxy">Crates.io Proxy Cache
            </router-link>), cargo can be configured to use Kellnr
            instead of <a href="https://crates.io/">crates.io</a> as the source for all crates. The official
            cargo documentation for source replacements can be found here: <a
              href="https://doc.rust-lang.org/stable/cargo/reference/source-replacement.html">Source
              Replacement in Cargo</a>. All configuration of the proxy takes place in the same <i>.cargo/config</i>
            file as described above.
          </TextBlock>

          <SubHeader id="pull-specific-crates">Pull only specific Crates from Kellnr Proxy</SubHeader>
          <TextBlock>
            If you want to pull only specific crates from the Kellnr proxy, you can do that by specifying
            the Kellnr crates.io index either per project in the <i>.cargo/config</i> file or globally in
            the <i>~./.cargo/config</i> file.
          </TextBlock>
          <CodeBlock lang="toml">
            # .cargo/config
            # Set the Kellnr crates.io proxy. Important is the path "/cratesio".

            [registries.kellnr-cratesio]
            index = "sparse+https://yourkellnrhostname/api/v1/cratesio/"
          </CodeBlock>
          <TextBlock>
            To pull a crate from the cache, specify Kellnr in the <i>Cargo.toml</i>.
          </TextBlock>
          <CodeBlock lang="toml">
            [package]
            name = "my_crate"
            version = "0.1.0"
            edition = "2021"

            [dependencies]
            # specify the kellnr-cratesio proxy as the source
            git2 = { version ="*", registry = "kellnr-cratesio"}
          </CodeBlock>

          <SubHeader id="replace-cratesio">Replace Crates.io with Kellnr Proxy Cache</SubHeader>
          <TextBlock>
            Instead of specifying for each crate that Kellnr should be used as the source, cargo can replace
            a source with another. To replace crates.io with the Kellnr proxy edit the <i>.cargo/config</i>
            in your project or home folder.
          </TextBlock>
          <CodeBlock lang="toml">
            # .cargo/config
            [source.crates-io]
            replace-with = "kellnr-cratesio"
            [source.kellnr-cratesio]
            registry = "sparse+https://yourkellnrhostname/api/v1/cratesio/"
          </CodeBlock>
          <TextBlock>
            Now, all crates in the <i>Cargo.toml</i> are pulled from the Kellnr proxy instead from
            crates.io, no need to specify Kellnr as the registry anymore.
          </TextBlock>
          <CodeBlock lang="toml">
            [package]
            name = "my_crate"
            version = "0.1.0"
            edition = "2021"

            [dependencies]
            git2 = "*" # Pulled from Kellnr proxy instead of crates.io
          </CodeBlock>

          <MainHeader id="rustdoc" icon="book-open-variant">Rustdoc</MainHeader>
          <TextBlock>
            With <a href="https://doc.rust-lang.org/rustdoc/index.html">rustdoc</a>, the Rust ecosystem has
            a widely adapted solution to document crates. Kellnr is able to host the corresponding
            documentation for a crate, such that no additional web server is needed. Enable automatic rustdoc generation
            by setting <code>docs.enabled = true</code> in the config file, the environment variable
            <code>KELLNR_DOCS__ENABLED=true</code>, or the CLI flag <code>--docs-enabled</code>.<br />
            <br />
            <b>Attention</b><br />
            As crates on Kellnr can have dependencies to other crates on Kellnr, it is important that Kellnr
            is able to resolve its own host and trust its own certificate. If you use the rustdoc
            auto-generation feature, make sure Kellnr is able to download from itself. If you installed
            Kellnr yourself, install the latest version of Rust, as rustdoc needs to generate the
            documentation.
          </TextBlock>

          <CodeBlock lang="bash">
            # If you need to inject your own ca-certificate to the docker container, it will be
            # automatically picked up by update-ca-certificates if you mount it like this:
            docker run --rm -it \
            ... \
            -v your-ca.crt:/usr/local/share/ca-certificates/user-ca.crt:ro

            # If you need to inject the local registry authentication to the container (auth_required=true):
            docker run --rm -it \
            ... \
            -v your-cargo-config.toml:/root/.cargo/config.toml:ro
          </CodeBlock>

          <CodeBlock lang="toml">
            # which could look like:
            [registries]
            [registries.kellnr]
            index = "sparse+https://yourkellnrhostname/api/v1/crates/"
            credential-provider = ["cargo:token"]
            token = "yourauthtoken"
          </CodeBlock>

          <WarnBlock>
            To build <i>rustdocs</i>, the <i>crate</i> needs to be compiled. While that happens, arbitrary and
            potentially
            malicious code, included in a dependency, can be executed. Make sure you trust the code you build the docs
            for!
          </WarnBlock>

          <SubHeader id="manual-rustdoc">Manual Rustdoc Upload</SubHeader>
          <TextBlock>
            Besides the automatic rustdoc generation, an API exists to upload a pre-generated rustdoc for a
            specific crate version. This is useful if the auto-generation is disabled and custom docs need
            to be uploaded.<br />
            <br />
            The first step is to generate the crate documentation as usual.
          </TextBlock>
          <CodeBlock lang="bash">
            # Generate documentation for your crate
            cargo doc
          </CodeBlock>
          <TextBlock>
            Next, zip and upload the documentation to Kellnr.
          </TextBlock>
          <CodeBlock lang="bash">
            # Package documentation for the upload
            cd ./target
            zip -r doc.zip ./doc
            # Upload documentation to Kellnr --> Replace values in brackets
            curl -H "Authorization: {authorization token}" http://{Kellnr host}/api/v1/docs/{crate name}/{crate version} --upload-file {docs archive}
          </CodeBlock>
          <TextBlock>
            To upload the documentation, Kellnr checks that a crate with a corresponding version exists and
            that the user has the right to upload the documentation. If no crate with the correct version
            exists, the upload will fail. The authorization mechanism for uploading documentation is the
            same like it is used for crates. The user needs an authentication token that is associated with
            an owner of the package or with an admin user to be able to upload the documentation.<br />
            <br />
            If a rustdocs for the corresponding version of a crate are found, Kellnr adds a link to the UI
            for the crate.
          </TextBlock>

          <MainHeader id="backup" icon="backup-restore">Backup</MainHeader>
          <TextBlock>
            Kellnr stores all data in one folder. The data directory can be configured via the config file
            (<code>registry.data_dir</code>), environment variable (<code>KELLNR_REGISTRY__DATA_DIR</code>),
            or CLI argument (<code>-d</code> / <code>--registry-data-dir</code>). To backup Kellnr, simply
            backup the data folder. The data folder contains all data needed to restore Kellnr. It is recommended to
            backup the data folder regularly, as it contains all uploaded crates and the SQLite database. If you use
            PostgreSQL instead, do not forget to backup the database separately.
          </TextBlock>
          </div>
        </div>
      </div>
    </section>
    <!-- Documentation End -->
  </div>
</template>

<style scoped>
/* Simple two-column grid layout */
.doc-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Content column */
.doc-content {
  min-width: 0;
  max-width: 100%;
}

/* Hide TOC on mobile */
@media (max-width: 991px) {
  .doc-layout {
    grid-template-columns: 1fr;
  }

  .toc-sidebar {
    display: none;
  }
}

/* Sticky sidebar */
.toc-sidebar {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.toc-title {
  font-weight: 600;
  color: #2f55d4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #2f55d4;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 0.25rem;
}

.toc-list a {
  color: #495057;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.toc-list a:hover {
  color: #2f55d4;
}

.toc-list ul {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}

.toc-list ul a {
  font-size: 0.85rem;
  color: #6c757d;
}

.toc-list ul a:hover {
  color: #2f55d4;
}

/* Scrollbar styling for TOC */
.toc-sidebar::-webkit-scrollbar {
  width: 4px;
}

.toc-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.toc-sidebar::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 2px;
}

.toc-sidebar::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>
