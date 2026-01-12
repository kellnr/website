<script setup lang="ts">
import CodeBlock from "../components/elements/CodeBlock.vue";
import TextBlock from "../components/elements/TextBlock.vue";
import WarnBlock from "../components/elements/WarnBlock.vue";
import TableBlock from "../components/elements/TableBlock.vue";
import SubHeader from "../components/elements/SubHeader.vue";
import MainHeader from "../components/elements/MainHeader.vue";
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
        <div class="row">
          <div class="col-12">
            <ul class="list-group">
              <li class="list-group-item">
                <router-link to="#installation">Installation</router-link>
              </li>
              <li class="list-group-item">
                <ul>
                  <li>
                    <router-link to="#docker-container">Docker Container</router-link>
                  </li>
                  <li>
                    <router-link to="#package-managers">Package Managers</router-link>
                  </li>
                  <li>
                    <router-link to="#script">Script</router-link>
                  </li>
                  <li>
                    <router-link to="#cargo-install">Cargo Install</router-link>
                  </li>
                  <li>
                    <router-link to="#manual-installation">Manual Installation</router-link>
                  </li>
                  <li>
                    <router-link to="#helm-chart">Helm Chart</router-link>
                  </li>
                </ul>
              </li>
              <li class="list-group-item">
                <router-link to="#uninstall">Uninstall</router-link>
              </li>
              <li class="list-group-item">
                <router-link to="#configuration">Configuration</router-link>
              </li>
              <li class="list-group-item">
                <ul>
                  <li>
                    <router-link to="#config-file">Config File</router-link>
                  </li>
                  <li>
                    <router-link to="#env-variables">Environment Variables</router-link>
                  </li>
                  <li>
                    <router-link to="#config-values">Config Values</router-link>
                  </li>
                  <li>
                    <router-link to="#authentication">Authentication</router-link>
                  </li>
                  <li>
                    <router-link to="#cratesio-proxy">Crates.io Proxy Cache</router-link>
                  </li>
                  <li>
                    <router-link to="#database">Database Backend</router-link>
                  </li>
                  <li>
                    <router-link to="#webhooks">Webhooks</router-link>
                  </li>
                </ul>
              </li>
              <li class="list-group-item">
                <router-link to="#configure-cargo">Configure Cargo</router-link>
              </li>
              <li class="list-group-item">
                <ul>
                  <li>
                    <router-link to="#global-config">Global Configuration</router-link>
                  </li>
                  <li>
                    <router-link to="#per-proj-config">Per Project Configuration</router-link>
                  </li>
                  <li>
                    <router-link to="#pull-publish-to-kellnr">Pull & Push to Kellnr</router-link>
                  </li>
                  <li>
                    <router-link to="#cratesio-proxy-cache">Crates.io Proxy Cache</router-link>
                  </li>
                  <li>
                    <router-link to="#pull-specific-crates">Pull only specific Crates from Kellnr Proxy</router-link>
                  </li>
                  <li>
                    <router-link to="#replace-cratesio">Replace Crates.io with kellnr Proxy Cache</router-link>
                  </li>
                </ul>
              </li>
              <li class="list-group-item">
                <router-link to="#rustdoc">Rustdoc</router-link>
              </li>
              <li class="list-group-item">
                <ul>
                  <li>
                    <router-link to="#manual-rustdoc">Rustdoc Manual Upload</router-link>
                  </li>
                </ul>
              </li>
              <li class="list-group-item">
                <router-link to="#backup">Backup</router-link>
              </li>

            </ul>

            <MainHeader id="installation">Installation</MainHeader>
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

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Run Kellnr non-persistent for testing.
# All data (crates, users) will be deleted with the container when the container terminates
docker run --rm -it \
-p 8000:8000 \
-e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" ghcr.io/kellnr/kellnr:5

# To run the container with persistence for all data (crates, users) mount a volume into the container
docker run --rm -it \
-p 8000:8000 \
-e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" \
-v $(pwd):/opt/kdata ghcr.io/kellnr/kellnr:5</code></pre>
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
            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Install Kellnr with yay
yay -S kellnr</code></pre>
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

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Go to the directory where Kellnr should be installed. For example:
cd ~

# Example: Download and install Kellnr as a systemd service with custom admin password for Kellnr
curl -s https://raw.githubusercontent.com/kellnr/installer/main/install.sh | sudo bash -s -- -s -p
myadminpwd
# Alternatively, you can use the following command if you installed cargo using rustup:
curl -s https://raw.githubusercontent.com/kellnr/installer/main/install.sh | sudo
PATH="$HOME/.cargo/bin:$PATH" bash -s -- -s -p myadminpwd

# Start the service (if installed with -s flag)
sudo systemctl enable kellnr
sudo systemctl start kellnr

# Check if the service runs
sudo systemctl status kellnr

# Open the ports defined in the default.toml (default 8000)
</code></pre>
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
            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Install Kellnr with Cargo
cargo install kellnr
# If you run into issues with OpenSSL, try the following command:
cargo install kellnr --features vendored-openssl
# Set the data diretory where kellnr stores its data
export KELLNR_REGISTRY__DATA_DIR="/path/to/data/dir"
# Run kellnr (if not in PATH, the binary is located in $HOME/.cargo/bin/)
kellnr</code></pre>
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
            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Download latest Kellnr version
# $ARCH can be:
# - x86_64-unknown-linux-gnu
# - aarch64-unknown-linux-gnu
# - x86_64-unknown-linux-musl
# - aarch64-unknown-linux-musl
curl --output kellnr-latest.zip
"https://github.com/kellnr/kellnr/releases/latest/download/kellnr-$ARCH.zip"

# Unzip
unzip -o kellnr-latest.zip -d ./kellnr

# Check the configuration file and edit if needed
# You may want to change the
# - admin_pwd
# - data_dir (Path where Kellnr stores its data. Different from installation directory. Must exists on
disk)

# Open the ports defined in the default.toml (default 8000)

# Start Kellnr
cd ./kellnr && ./kellnr</code></pre>
            </CodeBlock>

            <SubHeader id="helm-chart">Helm Chart</SubHeader>
            <TextBlock>
              The recommended way to install Kellnr on Kubernetes is with a Helm Chart. You can find the
              documentation for installing Kellnr with a Helm Chart here: <a
                href="https://github.com/kellnr/helm">Kellnr
                Helm Chart</a>
            </TextBlock>

            <MainHeader id="uninstall">Uninstall</MainHeader>
            <TextBlock>
              To uninstall Kellnr and delete all data (crates, users, ...), if you installed it manully,
              execute the uninstall script besides the Kellnr installation directory.
            </TextBlock>

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Change to the directory containing the Kellnr installation
cd ~
# Run the uninstaller
curl -s https://raw.githubusercontent.com/kellnr/installer/main/uninstall.sh | sudo bash</code></pre>
            </CodeBlock>

            <TextBlock>
              If you installed Kellnr with the Helm Chart run the command below. Beware that all data
              (crates, users, ...) will be deleted if you created the <i>PersistentVolume</i> with the
              Helm chart.
            </TextBlock>

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Uninstall Kellnr Helm Chart
helm uninstall kellnr</code></pre>
            </CodeBlock>

            <MainHeader id="configuration">Configuration</MainHeader>
            <TextBlock>
              Kellnr expects all configuration settings to be set on application startup. If you need to
              change the configuration, change the values in the config file or set the corresponding
              environment variables and restart Kellnr. Environment variables take precedence over values
              from the config file.
            </TextBlock>

            <SubHeader id="config-file">Config File</SubHeader>
            <TextBlock>
              Kellnr has a config file called default.toml in the ./config directory in the installation
              directory. The default installation directory is <i>/opt/kellnr</i>. Values from the
              default.toml can be overwritten by environment variables. See below for possible values.
            </TextBlock>

            <SubHeader id="env-variables">Environment Variables</SubHeader>
            <TextBlock>
              All values from the config file can be overwritten by environment variables. This is the
              recommended way for Kubernetes and Docker installations. See below for possible values.
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

            <TableBlock>
              <thead>
                <tr>
                  <th scope="col">default.toml</th>
                  <th scope="col">environment variable</th>
                  <th scope="col">default value</th>
                  <th scope="col">description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>[setup]<br />admin_pwd</td>
                  <td>KELLNR_SETUP__ADMIN_PWD</td>
                  <td>admin</td>
                  <td>Password for the admin user. Used on first start only.</td>
                </tr>
                <tr>
                  <td>[setup]<br />admin_token</td>
                  <td>KELLNR_SETUP__ADMIN_TOKEN</td>
                  <td>Zy9HhJ02RJmg0GCrgLfaCVfU6IwDfhXD</td>
                  <td>Authentication token for the admin user. Used on first start only.</td>
                </tr>
                <tr>
                  <td>[registry]<br />data_dir</td>
                  <td>KELLNR_REGISTRY__DATA_DIR</td>
                  <td>/opt/kdata</td>
                  <td>Directory where Kellnr stores all its data.</td>
                </tr>
                <tr>
                  <td>[registry]<br />session_age_seconds</td>
                  <td>KELLNR_REGISTRY__SESSION_AGE_SECONDS</td>
                  <td>28800</td>
                  <td>Seconds until a user is logged out of his browser session.</td>
                </tr>
                <tr>
                  <td>[registry]<br />cache_size</td>
                  <td>KELLNR_REGISTRY_CACHE_SIZE</td>
                  <td>1000</td>
                  <td>Number of crates cached in-memory to decrease disk I/O. If set to "0" the
                    cache is disabled.
                  </td>
                </tr>
                <tr>
                  <td>[registry]<br />max_crate_size</td>
                  <td>KELLNR_REGISTRY__MAX_CRATE_SIZE</td>
                  <td>10</td>
                  <td>Max size of crates allowed to be uploaded in MB.</td>
                </tr>
                <tr>
                  <td>[registry]<br />max_db_connections</td>
                  <td>KELLNR_REGISTRY__MAX_DB_CONNECTIONS</td>
                  <td>0</td>
                  <td>Max number of internal database connections. "0" disables the limit.</td>
                </tr>
                <tr>
                  <td>[registry]<br />auth_required</td>
                  <td>KELLNR_REGISTRY__AUTH_REQUIRED</td>
                  <td>false</td>
                  <td>Enable/Disable authentication for crates pulls and disable anonymous users for the web UI.</td>
                </tr>
                <tr>
                  <td>[registry]<br />required_crate_fields </td>
                  <td>KELLNR_REGISTRY__REQUIRED_CRATE_FIELDS</td>
                  <td>[]</td>
                  <td>Requires fields to be defined on upload crates. Leave empty to not add restrictions. If set to
                    e.g. ["authors", "repository"], all uploaded crates have to have the authors and repository defined
                    in their Cargo.toml's.
                    If used from an environment variable, the value has to be a comma separated list without spaces, e.g.
                    "authors,repository"
                  </td>
                </tr>
                <tr>
                  <td>[registry]<br />new_crates_restricted</td>
                  <td>KELLNR_REGISTRY__NEW_CRATES_RESTRICTED</td>
                  <td>false</td>
                  <td>If set to <i>true</i>, new crates can only be created by "crate users". This means an admin user
                    has to push the first version of a crate
                    and add crate users to the crate, before other users can push new versions of the crate. This
                    restricts which user can push to which crate.
                  </td>
                </tr>
                <tr>
                  <td>[local]<br />ip</td>
                  <td>KELLNR_LOCAL__IP</td>
                  <td>0.0.0.0</td>
                  <td>IP address where Kellnr listens. Usually this does not need to be changed.</td>
                </tr>
                <tr>
                  <td>[local]<br />port</td>
                  <td>KELLNR_LOCAL__PORT</td>
                  <td>8000</td>
                  <td>Port where Kellnr listens.</td>
                </tr>
                <tr>
                  <td>[origin]<br />hostname</td>
                  <td>KELLNR_ORIGIN__HOSTNAME</td>
                  <td>127.0.0.1</td>
                  <td>Hostname where Kellnr is reachable from, e.g. DNS name behind a reverse proxy.</td>
                </tr>
                <tr>
                  <td>[origin]<br />port</td>
                  <td>KELLNR_ORIGIN__PORT</td>
                  <td>8000</td>
                  <td>If a proxy is in front of Kellnr with a different port as Kellnr itself,
                    the port from the proxy has to be set here. Else set to to the same value as
                    "local.port".
                  </td>
                </tr>
                <tr>
                  <td>[origin]<br />protocol</td>
                  <td>KELLNR_ORIGIN__PROTOCOL</td>
                  <td>http</td>
                  <td>Either "http" or "https". This does not enable TLS on Kellnr, but needs to be set if
                    a TLS proxy is used in front of Kellnr.
                  </td>
                </tr>
                <tr>
                  <td>[origin]<br />path</td>
                  <td>KELLNR_ORIGIN__PATH</td>
                  <td></td>
                  <td>Run Kellnr on a sub path of a URL, e.g. "/kellnring/" for https://www.example.com/kellnring/</td>
                </tr>
                <tr>
                  <td>[log]<br />level</td>
                  <td>KELLNR_LOG__LEVEL</td>
                  <td>info</td>
                  <td>Log level for debugging. Either "trace", "debug", "info", "warn" or "error".</td>
                </tr>
                <tr>
                  <td>[log]<br />level_web_server</td>
                  <td>KELLNR_LOG__LEVEL_WEB_SERVER</td>
                  <td>warn</td>
                  <td>Log level for debugging. Either "trace", "debug", "info", "warn" or "error".</td>
                </tr>
                <tr>
                  <td>[log]<br />format</td>
                  <td>KELLNR_LOG__FORMAT</td>
                  <td>compact</td>
                  <td>Format of the log output. Either "compact", "pretty" or "json".</td>
                </tr>
                <tr>
                  <td>[proxy]<br />enabled</td>
                  <td>KELLNR_PROXY__ENABLED</td>
                  <td>false</td>
                  <td>Enable crates.io proxy to use Kellnr as a proxy-cache for crates.io.</td>
                </tr>
                <tr>
                  <td>[proxy]<br />num_threads</td>
                  <td>KELLNR_PROXY__NUM_THREADS</td>
                  <td>10</td>
                  <td>Number of threads used to keep crates.io cache up-to-date.</td>
                </tr>
                <tr>
                  <td>[proxy]<br />download_on_update</td>
                  <td>KELLNR_PROXY__DOWNLOAD_ON_UPDATE</td>
                  <td>false</td>
                  <td>Periodically pre-fetch crates from crates.io that had an update.</td>
                </tr>
                <tr>
                  <td>[docs]<br />enabled</td>
                  <td>KELLNR_DOCS__ENABLED</td>
                  <td>false</td>
                  <td>If "true", rustdocs are generated for each uploaded crate automatically.</td>
                </tr>
                <tr>
                  <td>[docs]<br />max_size</td>
                  <td>KELLNR_DOCS__MAX_SIZE</td>
                  <td>100</td>
                  <td>Max size of crate docs allowed to be uploaded in MB.</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />enabled</td>
                  <td>KELLNR_POSTGRESQL__ENABLED</td>
                  <td>false</td>
                  <td>Enable PostgreSQL instead of Sqlite</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />address</td>
                  <td>KELLNR_POSTGRESQL__ADDRESS</td>
                  <td>localhost</td>
                  <td>Address of the PostgreSQL server</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />port</td>
                  <td>KELLNR_POSTGRESQL__PORT</td>
                  <td>5432</td>
                  <td>Port of the PostgreSQL server</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />db</td>
                  <td>KELLNR_POSTGRESQL__DB</td>
                  <td>kellnr</td>
                  <td>Database name of the PostgreSQL server</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />.user</td>
                  <td>KELLNR_POSTGRESQL__USER</td>
                  <td></td>
                  <td>User name of the PostgreSQL database</td>
                </tr>
                <tr>
                  <td>[postgresql]<br />pwd</td>
                  <td>KELLNR_POSTGRESQL__PWD</td>
                  <td></td>
                  <td>Password of the PostgreSQL database</td>
                </tr>
                <tr>
                  <td>[s3]<br />enabled</td>
                  <td>KELLNR_S3__ENABLED</td>
                  <td>false</td>
                  <td>Enable S3 storage instead of local file system</td>
                </tr>
                <tr>
                  <td>[s3]<br />access_key</td>
                  <td>KELLNR_S3__ACCESS_KEY</td>
                  <td>minioadmin</td>
                  <td>Access key for the S3 storage</td>
                </tr>
                <tr>
                  <td>[s3]<br />secret_key</td>
                  <td>KELLNR_S3__SECRET_KEY</td>
                  <td>minioadmin</td>
                  <td>Secret key for the S3 storage</td>
                </tr>
                <tr>
                  <td>[s3]<br />region</td>
                  <td>KELLNR_S3__REGION</td>
                  <td>us-east-1</td>
                  <td>Region of the S3 storage</td>
                </tr>
                <tr>
                  <td>[s3]<br />endpoint</td>
                  <td>KELLNR_S3__ENDPOINT</td>
                  <td>http://localhost:9000</td>
                  <td>Endpoint of the S3 storage</td>
                </tr>
                <tr>
                  <td>[s3]<br />allow_http</td>
                  <td>KELLNR_S3__ALLOW_HTTP</td>
                  <td>true</td>
                  <td>Allow unsecure S3 connection with HTTP</td>
                </tr>
                <tr>
                  <td>[s3]<br />crates_bucket</td>
                  <td>KELLNR_S3__CRATES_BUCKET</td>
                  <td>kellnr-crates</td>
                  <td>Bucket where Kellnr stores uploaded crates</td>
                </tr>
                <tr>
                  <td>[s3]<br />cratesio_bucket</td>
                  <td>KELLNR_S3__CRATESIO_BUCKET</td>
                  <td>kellnr-cratesio</td>
                  <td>Bucket for crates.io crates if the proxy is enabled</td>
                </tr>
              </tbody>
            </TableBlock>

            <SubHeader id="authentication">Authentication</SubHeader>
            <TextBlock>
              Authentication is required by cargo and Kellnr to push crates. See
              <router-link to="#configure-cargo">Configure Cargo
              </router-link>
              for more information. Authentication on
              pull can be enabled by setting the flag <i>auth_required</i> to <i>true</i> in the config. This will force
              cargo to authenticte on pull as well and the flag forces users of the web UI to log in, to see any details
              of crates.
              <br />
              <br />
              If the <i>auth_required</i> flag is set to <i>true</i>, Kellnr needs to be able to authenticate against
              itself. If the doc generation is enabled, the docs can only be build sucessfully, if Kellnr can pull the
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


            <SubHeader id="cratesio-proxy">Crates.io Proxy Cache</SubHeader>
            <TextBlock>
              Kellnr can be used as a proxy cache for <a href="https://crates.io/">crates.io</a>. If the
              proxy is enabled, Kellnr caches all crates requested from <a href="https://crates.io/">crates.io</a>
              after their first download. All subsequent request for that crate are then served by Kellnr
              instead of <a href="https://crates.io/">crates.io</a>. To enable the proxy, set the <i>proxy.enabled</i>
              value in the <i>default.toml</i>, or the environment variable <i>KELLNR_PROXY__ENABLED</i>
              to <i>true</i>.<br />
              <br />
              <b>Attention</b><br />
              If you enable the proxy, Kellnr caches every crate from crates.io that is requested through Kellnr. This
              means that the first download of a crate is a bit slower, as it is first downloaded from crates.io and
              than cached by Kellnr. All subsequent request are faster, as Kellnr now responses from the cache and
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
              you can enable it by setting the <i>postgresql.enabled</i> value in the <i>default.toml</i>,
              or the environment variable <i>KELLNR_POSTGRESQL__ENABLED</i> to <i>true</i>.<br />
              <br />
              If you enable PostgreSQL, you need to set the following values in the <i>default.toml</i>,
              or the corresponding environment variables:
              <ul>
                <li><i>postgresql.address</i> or <i>KELLNR_POSTGRESQL__ADDRESS</i></li>
                <li><i>postgresql.port</i> or <i>KELLNR_POSTGRESQL__PORT</i></li>
                <li><i>postgresql.db</i> or <i>KELLNR_POSTGRESQL__DB</i></li>
                <li><i>postgresql.user</i> or <i>KELLNR_POSTGRESQL__USER</i></li>
                <li><i>postgresql.pwd</i> or <i>KELLNR_POSTGRESQL__PWD</i></li>
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

            <CodeBlock>
              <pre v-highlightjs><code class="bash">curl kellnr_url/api/v1/webhook -X POST \
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
}</code></pre>
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

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># View specific webhook
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
</code></pre>
            </CodeBlock>

            <MainHeader id="configure-cargo">Configure Cargo</MainHeader>
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
            <CodeBlock>
              <pre v-highlightjs><code class="toml"># Example .cargo/config.toml
# The index needs to point to the host where your Kellnr instance runs
# The token is the authentication token for the user configured in Kellnr
[registries.kellnr]
index = "sparse+https://yourkellnrhostname/api/v1/crates/"
credential-provider = ["cargo:token"]
token = "yourauthtoken"
                </code></pre>
            </CodeBlock>
          </div>

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
          <CodeBlock>
            <pre v-highlightjs><code class="toml"># Example Cargo.toml which uses a dependency from Kellnr
# The registry name has to be the one defined in .cargo/config.toml
[package]
authors = ["myauthor "]
edition = "2018"
name = "my_crate"
version = "0.1.0"

[dependencies]
my_dep = {version = "1.1.0", registry = "kellnr"}</code></pre>
          </CodeBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="toml"># Example Cargo.toml to publish to Kellnr
# The publish name has to be the one defined in .cargo/config.toml
[package]
authors = ["myauthor "]
edition = "2018"
name = "my_crate"
version = "0.1.0"
publish = ["kellnr"]

[dependencies]
# ... Dependencies ... </code></pre>
          </CodeBlock>
          <TextBlock>Instead of adding the <i>publish</i> field in the <i>Cargo.toml</i> the registry to
            publish to can be set dynamically on cargo <i>publish</i>.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="bash"># Publish to Kellnr by setting the registry to use dynamically
# The registry name has to be the one defined in .cargo/config.toml
cargo publish --registry kellnr</code></pre>
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
          <CodeBlock>
            <pre v-highlightjs><code class="toml"># .cargo/config
# Set the Kellnr crates.io proxy. Important is the path "/cratesio".

[registries.kellnr-cratesio]
index = "sparse+https://yourkellnrhostname/api/v1/cratesio/"</code></pre>
          </CodeBlock>
          <TextBlock>
            To pull a crate from the cache, specify Kellnr in the <i>Cargo.toml</i>.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="toml">[package]
name = "my_crate"
version = "0.1.0"
edition = "2021"

[dependencies]
# specify the kellnr-cratesio proxy as the source
git2 = { version ="*", registry = "kellnr-cratesio"}
</code></pre>
          </CodeBlock>

          <SubHeader id="replace-cratesio">Replace Crates.io with Kellnr Proxy Cache</SubHeader>
          <TextBlock>
            Instead of specifying for each crate that Kellnr should be used as the source, cargo can replace
            a source with another. To replace crates.io with the Kellnr proxy edit the <i>.cargo/config</i>
            in your project or home folder.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="toml"># .cargo/config
[source.crates-io]
replace-with = "kellnr-cratesio"
[source.kellnr-cratesio]
registry = "sparse+https://yourkellnrhostname/api/v1/cratesio/"</code></pre>
          </CodeBlock>
          <TextBlock>
            Now, all crates in the <i>Cargo.toml</i> are pulled from the Kellnr proxy instead from
            crates.io, no need to specify Kellnr as the registry anymore.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="toml">[package]
name = "my_crate"
version = "0.1.0"
edition = "2021"

[dependencies]
git2 = "*" # Pulled from Kellnr proxy instead of crates.io</code></pre>
          </CodeBlock>

          <MainHeader id="rustdoc">
            Rustdoc
          </MainHeader>
          <TextBlock>
            With <a href="https://doc.rust-lang.org/rustdoc/index.html">rustdoc</a>, the Rust ecosystem has
            a widely adapted solution to document crates. Kellnr is able to host the corresponding
            documentation for a crate, such that no additional web server is needed. Enable automatic rustdoc generation
            by setting the <i>docs.enabled</i> flag to <i>true</i>.<br />
            <br />
            <b>Attention</b><br />
            As crates on Kellnr can have dependencies to other crates on Kellnr, it is important that Kellnr
            is able to resolve its own host and trust its own certificate. If you use the rustdoc
            auto-generation feature, make sure Kellnr is able to download from itself. If you installed
            Kellnr yourself, install the latest version of Rust, as rustdoc needs to generate the
            documentation.
          </TextBlock>

          <CodeBlock>
            <pre v-highlightjs><code class="bash"># If you need to inject your own ca-certificate to the docker
container, it will be
# automatically picked up by update-ca-certificates if you mount it like this:
docker run --rm -it \
... \
-v your-ca.crt:/usr/local/share/ca-certificates/user-ca.crt:ro

# If you need to inject the local registry authentication to the container (auth_required=true):
docker run --rm -it \
... \
-v your-cargo-config.toml:/root/.cargo/config.toml:ro</code></pre>
          </CodeBlock>

          <CodeBlock>
            <pre v-highlightjs><code class="toml"># which could look like:
[registries]
[registries.kellnr]
index = "sparse+https://yourkellnrhostname/api/v1/crates/"
credential-provider = ["cargo:token"]
token = "yourauthtoken"</code></pre>
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
          <CodeBlock>
            <pre v-highlightjs><code class="bash"># Generate documentation for your crate
cargo doc</code></pre>
          </CodeBlock>
          <TextBlock>
            Next, zip and upload the documentation to Kellnr.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="bash"># Package documentation for the upload
cd ./target
zip -r doc.zip ./doc
# Upload documentation to Kellnr --> Replace values in brackets
curl -H "Authorization: {authorization token}" http://{Kellnr host}/api/v1/docs/{crate name}/{crate
version} --upload-file {docs archive}# Package documentation for the upload
cd ./target
zip -r doc.zip ./doc
# Upload documentation to Kellnr --> Replace values in brackets
curl -H "Authorization: {authorization token}" http://{Kellnr host}/api/v1/docs/{crate name}/{crate
version} --upload-file {docs archive}</code></pre>
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

          <MainHeader id="backup">Backup</MainHeader>
          <TextBlock>
            Kellnr stores all data in one folder. The default folder is <i>/opt/kdata</i> if not changed by the
            <i>registry.data_dir</i>
            variable in the <i>default.toml</i> or the <i>KELLNR_REGISTRY__DATA_DIR</i> environment variable. To backup
            Kellnr,
            simply
            backup the data folder. The data folder contains all data needed to restore Kellnr. It is recommended to
            backup
            the data folder regularly, as it contains all uploaded crates and the Sqlite database. If you use PostgreSql
            instead, do not forget to backed the database separately.
          </TextBlock>
        </div>
      </div>
    </section>
    <!-- Documentation End -->
  </div>
</template>
