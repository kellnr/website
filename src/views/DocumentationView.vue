<script setup lang="ts">
import CodeBlock from "@/components/elements/CodeBlock.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import TableBlock from "@/components/elements/TableBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import MainHeader from "@/components/elements/MainHeader.vue";
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
                    <router-link to="#script">Script</router-link>
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
              You can find the latest version tag on the <a href="https://github.com/kellnr/kellnr/releases">Kellnr
                releases</a> page.
            </TextBlock>

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Run Kellnr non-persistent for testing.
# All data (crates, users) will be deleted with the container when the container terminates
docker run --rm -it \
    -p 8000:8000 \
    -p 9418:9418 \
    -e "KELLNR_API_ADDRESS=kellnr.example.com" ghcr.io/kellnr/kellnr:4.0.0

# To run the container with persistence for all data (crates, users) mount a volume into the container
docker run --rm -it \
    -p 8000:8000 \
    -p 9418:9418 \
    -e "KELLNR_API_ADDRESS=kellnr.example.com" \
    -v $(pwd):/opt/kdata ghcr.io/kellnr/kellnr:4.0.0</code></pre>
            </CodeBlock>

            <TextBlock>
              You may want to change the admin password used to log into
              the web-ui and the admin token, used by Cargo to authenticate to Kellnr. The <b>API
                address</b> is the <b>hostname</b>, where Kellnr is reachable. If not set correctly, Cargo
              will not be able to publish crates to Kellnr.
              The values can be set with environment variables on the first start of Kellnr. If you ran
              the container with a mounted volume for persistence, all variables are ignored.
            </TextBlock>

            <SubHeader id="script">Script</SubHeader>
            <TextBlock>
              The installation script is tested on current Ubuntu Server versions. Any other modern Linux
              distribution may work, but we cannot guarantee that. If the script does not work for you,
              please contact us and we try to find a solution. Have a look at "Manual Installation" which
              works independent from your distribution. The script will automatically install the right
              version for your architecture. Currently supported are x64 and aarch64 (arm64). <br />
              <br />
              Before starting the installation process, make sure you have the needed rights (sudo) and
              checked the list with possible options below.
            </TextBlock>

            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Go to the directory where Kellnr should be installed. For example:
cd ~

# Example: Download and install Kellnr as a systemd service with custom admin password for Kellnr
# Required: "-a" Add the address (hostname or IP) where Kellnr will be reachable
curl -s https://raw.githubusercontent.com/kellnr/installer/main/install.sh | sudo bash -s -- -a kellnr.example.com -s -p myadminpwd

# Start the service (if installed with -s flag)
sudo systemctl enable kellnr
sudo systemctl start kellnr

# Check if the service runs
sudo systemctl status kellnr

# Open the ports defined in the default.toml
# Example for Ubuntu:
sudo ufw allow 8000
sudo ufw allow 9418</code></pre>
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
                  <td>-a API address</td>
                  <td>Address where Kellnr is reachable</td>
                  <td>Hostname or IP where Kellnr is reachable</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>-d /data/dir</td>
                  <td>Directory where Kellnr saves all data, e.g. uploaded crates</td>
                  <td>Must be different to the installation directory</td>
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
              </tbody>
            </TableBlock>

            <SubHeader id="manual-installation">Manual Installation</SubHeader>
            <TextBlock>
              Manually installing Kellnr is possible as well. If the Docker or script approach does not
              work for you, this is the best alternative.<br />
              <br />
              Required dependencies:
              <ul>
                <li>git</li>
                <li>zip (unzip)</li>
                <li>curl</li>
              </ul>
            </TextBlock>
            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Download latest Kellnr version
# $ARCH can be:
# - x86_64-unknown-linux-gnu
# - aarch64-unknown-linux-gnu
# - armv7-unknown-linux-gnueabihf
curl --output kellnr-latest.zip "https://github.com/kellnr/kellnr/releases/latest/download/kellnr-$ARCH.zip"

# Unzip
unzip -o kellnr-latest.zip -d ./kellnr

# Check the configuration file and edit if needed
# You may want to change the
#   - admin_pwd
#   - data_dir (Path where Kellnr stores its data. Different from installation directory. Must exists on disk)
# You must set the api_address to the address (hostname or IP) where Kellnr will be reachable
vim ./kellnr/config/default.toml

# Open the ports defined in the default.toml
# Example for Ubuntu
sudo ufw allow 8000
sudo ufw allow 9418

# Start Kellnr
cd ./kellnr && ./kellnr</code></pre>
            </CodeBlock>

            <SubHeader id="helm-chart">Helm Chart</SubHeader>
            <TextBlock>
              The recommended way to install Kellnr on Kubernetes is with a Helm Chart. You can find the
              documentation for installing Kellnr with a Helm Chart here: <a href="https://github.com/kellnr/helm">Kellnr
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
                  <th scope="col">Default</th>
                  <th scope="col">Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>admin_pwd</td>
                  <td>KELLNR_ADMIN_PWD</td>
                  <td>kellnr</td>
                  <td>Password for the admin user. Used on first start only.</td>
                </tr>
                <tr>
                  <td>admin_token</td>
                  <td>KELLNR_ADMIN_TOKEN</td>
                  <td>Zy9HhJ02RJmg0GCrgLfaCVfU6IwDfhXD</td>
                  <td>Authentication token for the admin user. Used on first start only.</td>
                </tr>
                <tr>
                  <td>api_port</td>
                  <td>KELLNR_API_PORT</td>
                  <td>8000</td>
                  <td>Port on which Kellnr is reachable.</td>
                </tr>
                <tr>
                  <td>api_protocol</td>
                  <td>KELLNR_API_PROTOCOL</td>
                  <td>http</td>
                  <td>Either "http" or "https". This does not enable TLS on Kellnr, but needs to be set if
                    a TLS proxy is used in front of Kellnr.
                  </td>
                </tr>
                <tr>
                  <td>index_address</td>
                  <td>KELLNR_INDEX_ADDRESS</td>
                  <td>0.0.0.0</td>
                  <td>Address/domain of the git index of Kellnr. Usually this does not need to be
                    changed.
                  </td>
                </tr>
                <tr>
                  <td>index_port</td>
                  <td>KELLNR_INDEX_PORT</td>
                  <td>9418</td>
                  <td>Port of the git index of Kellnr.</td>
                </tr>
                <tr>
                  <td>session_age_seconds</td>
                  <td>KELLNR_SESSION_AGE_SECONDS</td>
                  <td>28800</td>
                  <td>Seconds until a user is logged out of his browser session.</td>
                </tr>
                <tr>
                  <td>web_address</td>
                  <td>KELLNR_WEB_ADDRESS</td>
                  <td>0.0.0.0</td>
                  <td>IP address of the web interface. Usually this does not need to be changed.</td>
                </tr>
                <tr>
                  <td>crates_io_proxy</td>
                  <td>KELLNR_CRATES_IO_PROXY</td>
                  <td>false</td>
                  <td>Enable/Disable crates.io proxy cache.</td>
                </tr>
                <tr>
                  <td>crates_io_num_threads</td>
                  <td>KELLNR_CRATES_IO_NUM_THREADS</td>
                  <td>10</td>
                  <td>(>=3.1.0) Number of threads used to keep crates.io cache up-to-date.</td>
                </tr>
                <tr>
                  <td>data_dir</td>
                  <td>KELLNR_DATA_DIR</td>
                  <td>/opt/kdata</td>
                  <td>Directory where Kellnr stores all its data.</td>
                </tr>
                <tr>
                  <td>log_level</td>
                  <td>KELLNR_LOG_LEVEL</td>
                  <td>info</td>
                  <td>Log level for debugging. Either "trace", "debug", "info", "warn" or "error".</td>
                </tr>
                <tr>
                  <td>api_port_proxy</td>
                  <td>KELLNR_API_PORT_PROXY</td>
                  <td>8000</td>
                  <td>(>= 1.5.2) If a proxy is in front of Kellnr with a different port as Kellnr itself,
                    the port from the proxy has to be set here. Else set to to the same value as
                    "api_port".
                  </td>
                </tr>
                <tr>
                  <td>rustdoc_auto_gen</td>
                  <td>KELLNR_RUSTDOC_AUTO_GEN</td>
                  <td>true</td>
                  <td>(>= 2.0.0) If "true", rustdocs are generated for each uploaded crate
                    automatically.
                  </td>
                </tr>
                <tr>
                  <td>cache_size</td>
                  <td>KELLNR_CACHE_SIZE</td>
                  <td>1000</td>
                  <td>(>=2.1.0) Number of crates cached in-memory to decrease disk I/O. If set to "0" the
                    cache is disabled.
                  </td>
                </tr>
                <tr>
                  <td>log_level_rocket</td>
                  <td>KELLNR_LOG_LEVEL_ROCKET</td>
                  <td>warn</td>
                  <td>Log level for debugging. Either "trace", "debug", "info", "warn" or "error".</td>
                </tr>
                <tr>
                  <td>log_format</td>
                  <td>KELLNR_LOG_FORMAT</td>
                  <td>compact</td>
                  <td>Format of the log output. Either "compact", "pretty" or "json".</td>
                </tr>
                <tr>
                  <td>max_crate_size</td>
                  <td>KELLNR_MAX_CRATE_SIZE</td>
                  <td>100</td>
                  <td>Max. size of crates allowed to be uploaded in MB.</td>
                </tr>
                <tr>
                  <td>max_dosc_size</td>
                  <td>KELLNR_MAX_DOCS_SIZE</td>
                  <td>100 MB</td>
                  <td>Max. size of crate docs allowed to be uploaded in MB.</td>
                </tr>
                <tr>
                  <td>git_index</td>
                  <td>KELLNR_GIT_INDEX</td>
                  <td>false</td>
                  <td>Enable/Disable the git index of Kellnr for cargo &lt; 1.7.0</td>
                </tr>
                <tr>
                  <td>auth_required</td>
                  <td>KELLNR_AUTH_REQUIRED</td>
                  <td>false</td>
                  <td>(>=3.1.0) Enable/Disable authentication for crates pulls.</td>
                </tr>
              </tbody>
            </TableBlock>

            <SubHeader id="authentication">Authentication</SubHeader>
            <TextBlock>
              Authentication is required by cargo and Kellnr to push crates. See
              <router-link to="#configure-cargo">Configure Cargo
              </router-link>
              for more information. Authentication on
              pull is currently an <a
                href="https://doc.rust-lang.org/nightly/cargo/reference/unstable.html#registry-auth">RFC</a> and only
              supported in cargo nightly. You
              can enable it by setting the flag <i>auth_required</i> to <i>true</i> in the config.
            </TextBlock>


            <SubHeader id="cratesio-proxy">Crates.io Proxy Cache</SubHeader>
            <TextBlock>
              Kellnr can be used as a proxy cache for <a href="https://crates.io/">crates.io</a>. If the
              proxy is enabled, Kellnr caches all crates requested from <a href="https://crates.io/">crates.io</a>
              after their first download. All subsequent request for that crate are then served by Kellnr
              instead of <a href="https://crates.io/">crates.io</a>. To enable the proxy, set the <i>crates_io_proxy</i>
              value in the <i>default.toml</i>, or the environment variable <i>KELLNR_CRATES_IO_PROXY</i>
              to <i>true</i>.<br />
              <br />
              <b>Attention</b><br />
              If you enable the proxy, Kellnr clones the full index from crates.io (not all crates), which
              is several GB in size and needs to be unpacked, which takes several minutes. This has only
              to be done on the first start, but Kellnr clones the index first and than starts up
              completely. So please be patient, if you enabled the proxy for the first time and Kellnr
              starts.<br />
              <br />
              We strongly recommend to run Kellnr on fast SSD storage if you enable the crates.io proxy.
              The index is very IO heavy and the speed of the disk determines how fast cargo is able to
              resolve and update the index if you create a new Rust project.<br />
              <br />
              As the proxy caches all crates that are requested, it can grow significantly in size. The
              index alone takes several GB. We recommend 50GB-100GB for the cached crates and the
              index.<br />
              <br />
              For information on how to configure cargo to Kellnr instead of crates.io, see
              <router-link to="#configure-cargo">Configure Cargo
              </router-link>.
            </TextBlock>

            <MainHeader id="configure-cargo">Configure Cargo</MainHeader>
            <TextBlock>
              Cargo needs to know about your Kellnr instance to be able to pull and publish crates from
              it.
            </TextBlock>

            <SubHeader id="global-config">Global Configuration</SubHeader>
            <TextBlock>
              To allow all Rust projects on the current system the usage of Kellnr, it needs to be
              registered in your .cargo/config.toml. The advantage of this method is that Kellnr needs to
              be configures only once and can be used from any Rust project from now on this system.<br />
              <br />
              <ul>
                <li>Windows default location: <i>%USERPROFILE%\.cargo\config.toml</i></li>
                <li>Unix default location: <i>$HOME/.cargo/config.toml</i></li>
              </ul>
            </TextBlock>
            <CodeBlock>
              <pre v-highlightjs><code class="bash"># Example .cargo/config.toml
# The index needs to point to the host where your Kellnr instance runs
# The token is the authentication token for the user configured in Kellnr
[registries]
kellnr = { index = "sparse+https://yourkellnrhostname/api/v1/crates", token = "yourauthtoken" }

# DEPRECATED use the git index only if you need support for cargo &lt; 1.7.0
kellnr = { index = "git://yourkellnrhostname/index", token = "yourauthtoken" }
# ATTENTION: Per default the port 9418 is assumed. If you used the Helm Chart or other Kubernetes deployment, the port is 30418 and needs to be set.
# E.g.: kellnr = { index = "git://yourkellnrhostname:30418/index", token = "yourauthtoken" }</code></pre>
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
            <pre v-highlightjs><code class="bash"># Example Cargo.toml which uses a dependency from Kellnr
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
            <pre v-highlightjs><code class="bash"># Example Cargo.toml to publish to Kellnr
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
            <pre v-highlightjs><code class="bash"># .cargo/config
# Set the Kellnr crates.io proxy. Important is the path "/cratesio".

[registries.kellnr-cratesio]
index = "sparse+https://yourkellnrhostname/api/v1/cratesio/"

# DEPRECATED use the git index only if you need support for cargo &lt; 1.7.0
# The default port for Helm deployments is 30418
index = "git://yourkellnrhostname:9418/cratesio"</code></pre>
          </CodeBlock>
          <TextBlock>
            To pull a crate from the cache, specify Kellnr in the <i>Cargo.toml</i>.
          </TextBlock>
          <CodeBlock>
            <pre v-highlightjs><code class="bash">[package]
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
            <pre v-highlightjs><code class="bash"># .cargo/config
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
            <pre v-highlightjs><code class="bash">[package]
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
            documentation for a crate, such that no additional web server is needed. Starting with Kellnr
            v2.0.0, rustdocs are autogenerated for each uploaded crate, if the rustdoc_auto_gen flag is set
            to true (default).<br />
            <br />
            <b>Attention</b><br />
            As crates on Kellnr can have dependencies to other crates on Kellnr, it is important that Kellnr
            is able to resolve its own host and trust its own certificate. If you use the rustdoc
            auto-generation feature, make sure Kellnr is able to download from itself. If you installed
            Kellnr yourself, install the latest version of Rust, as rustdoc needs to generate the
            documentation.
          </TextBlock>

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
            <pre
              v-highlightjs><code class="bash"># Package documentation for the upload
cd ./target
zip -r doc.zip ./doc
# Upload documentation to Kellnr --> Replace values in brackets
curl -H "Authorization: {authorzation token}" http://{Kellnr host}/api/v1/docs/{crate name}/{crate version} --upload-file {docs archive}# Package documentation for the upload
cd ./target
zip -r doc.zip ./doc
# Upload documentation to Kellnr --> Replace values in brackets
curl -H "Authorization: {authorzation token}" http://{Kellnr host}/api/v1/docs/{crate name}/{crate version} --upload-file {docs archive}</code></pre>
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
            <i>data_dir</i>
            variable in the <i>default.toml</i> or the <i>KELLNR_DATA_DIR</i> environment variable. To backup Kellnr,
            simply
            backup the data folder. The data folder contains all data needed to restore Kellnr. It is recommended to
            backup
            the data folder regularly, as it contains all uploaded crates and the database.
          </TextBlock>
        </div>
      </div>
    </section>
    <!-- Documentation End -->
  </div>
</template>
