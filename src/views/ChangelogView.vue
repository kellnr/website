<script setup lang="ts">
import ChangeLogListItem from "../components/changelog/ChangeLogListItem.vue";
import ChangeLogItem from "../components/changelog/ChangeLogItem.vue";
</script>

<template>
    <div>
        <!-- Hero Start -->
        <section class="bg-half bg-light d-table w-100">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="page-next-level">
                            <h4 class="title"> Changelog </h4>
                            <div class="page-next">
                                <nav aria-label="breadcrumb" class="d-inline-block">
                                    <ul class="breadcrumb bg-white rounded shadow mb-0">
                                        <li class="breadcrumb-item">
                                            <router-link to="/">Kellnr</router-link>
                                        </li>
                                        <li class="breadcrumb-item"><a href="#">Docs</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Changelog</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div><!--end col-->
                </div><!--end row-->
            </div> <!--end container-->
        </section><!--end section-->
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

        <!-- Changelog Start -->
        <section class="section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <div class="p-4 shadow rounded border">
                            <ChangeLogItem date="02. April 2025" version="5.4.0" is-latest="true">
                                <ChangeLogListItem type="Added">User groups to manage permissions for crates with groups
                                    instead of single users <a href="https://github.com/kellnr/kellnr/pull/649">#649</a>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">S3 support for crate storage additional to the local
                                    storage <a href="https://github.com/kellnr/kellnr/pull/623">#623</a>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Required fields in <i>Cargo.toml</i> to deny crates with
                                    missing information
                                    <a href="https://github.com/kellnr/kellnr/pull/622">#622</a>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Read-only users that allow authenticated download of
                                    crates, but no upload. <a
                                        href="https://github.com/kellnr/kellnr/issues/601">#601</a></ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Wrong alignment of statistics cards on the landing page
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Logout sometimes incomplete <a
                                        href="https://github.com/kellnr/kellnr/issues/602">#602</a></ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Many smaller bugs</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                                <ChangeLogListItem type="Removed">Support for ARM v7 architecture. It conflicts with the
                                    new S3 feature.</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="22. January 2025" version="5.3.1">
                                <ChangeLogListItem type="Fixed">Wrong version shown in web ui <a
                                        href="https://github.com/kellnr/kellnr/issues/583">#583</a>
                                </ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="18. January 2025" version="5.3.0">
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Empty user and password allowed <a
                                        href="https://github.com/kellnr/kellnr/issues/572">#572</a></ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Missing crate description</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Config and static directories are configrable<a
                                        href="https://github.com/kellnr/kellnr/pull/535">#535</a></ChangeLogListItem>
                                <ChangeLogListItem type="Added">Support for download authentication<a
                                        href="https://github.com/kellnr/kellnr/pull/209">#209</a></ChangeLogListItem>
                                <ChangeLogListItem type="Added">API endpoint to list all versions of a crate<a
                                        href="https://github.com/kellnr/kellnr/pull/576">#576</a></ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="09. December 2024" version="5.2.7">
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="18. August 2024" version="5.2.6">
                                <ChangeLogListItem type="Fixed">Cache invalidation if a crate is deleted <a
                                        href="https://github.com/kellnr/kellnr/pull/461">#461</a></ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Return codes for the HTTP API <a
                                        href="https://github.com/kellnr/kellnr/pull/429">#429</a></ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="18. August 2024" version="5.2.5">
                                <ChangeLogListItem type="Added">Option <i>max_db_connections</i> to configure the max.
                                    concurrent database connections.</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Missing <i>pkg-confing</i> and <i>libssl-dev</i> in
                                    Docker image.</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="24. July 2024" version="5.2.4">
                                <ChangeLogListItem type="Added">Static (musl) builds to support more Linux distributions
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Switched from Ubuntu as the builder to Cross-rs
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Switched from Ubuntu as the Docker base image to the
                                    official Rust image</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Permission denied on the docs build webpage
                                </ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="16. May 2024" version="5.2.3">
                                <ChangeLogListItem type="Fixed">Wrong computation of SHA256 for uploaded crates
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Corrupt layer in Docker image</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Copy button for newly created tokens</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Use Ubuntu 24.04 as base image</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Rust depedencies</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="08. May 2024" version="5.2.2">
                                <ChangeLogListItem type="Fixed">Multiple small bug fixes.</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All crate and npm dependencies</ChangeLogListItem>
                            </ChangeLogItem>
                            <ChangeLogItem date="14. March 2024" version="5.2.1">
                                <ChangeLogListItem type="Added">Option to mount certificates into the Docker <a
                                        href="https://github.com/kellnr/kellnr/pull/260">#260</a></ChangeLogListItem>
                                <ChangeLogListItem type="Added">Responsive UI for mobile devices <a
                                        href="https://github.com/kellnr/kellnr/pull/238">#238</a></ChangeLogListItem>
                                <ChangeLogListItem type="Added">Build docs with all features enabled <a
                                        href="https://github.com/kellnr/kellnr/pull/257">#257</a></ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Crates from crates.io are missing the version and
                                    documetation link in the UI after a search query <a
                                        href="https://github.com/kellnr/kellnr/issues/253">#253</a></ChangeLogListItem>
                                <ChangeLogListItem type="Updated">static.crates.io used for faster downloads instead of
                                    crates.io <a href="https://github.com/kellnr/kellnr/issues/230">#230</a>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All crate and npm dependencies</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="14. March 2024" version="5.2.0">
                                <ChangeLogListItem type="Added">Switch to display and search cached crates in the UI
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Delete button for all versions of a crate in the UI
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All crate and npm dependencies</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="14. February 2024" version="5.1.3">
                                <ChangeLogListItem type="Fixed">Docs and doc queue available in UI, even when auth is
                                    required</ChangeLogListItem>
                                <ChangeLogListItem type="Added">New status code 4xx and 5xx used by crates.io: <a
                                        href="https://blog.rust-lang.org/2024/02/06/crates-io-status-codes.html">crates.io
                                        status codes</a></ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="05. February 2024" version="5.1.2">
                                <ChangeLogListItem type="Fixed">Upload size for crates in settings not respected
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Same folder for crates from Kellnr and crates.io
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Route for latest docs</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="04. January 2024" version="5.1.1">
                                <ChangeLogListItem type="Fixed">Manual upload of rustdocs broken due to miscalculated
                                    upload size</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="01. January 2024" version="5.1.0">
                                <ChangeLogListItem type="Added">New landing page with statistics</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">All dependencies</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Username or password mismatch displayed as <i>Internal
                                        Server Error</i></ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="28. November 2023" version="5.0.0">
                                <ChangeLogListItem type="Updated">Switch from rocket.rs to axum</ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Refactored settings</ChangeLogListItem>
                                <ChangeLogListItem type="Removed">Git index support</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="07. October 2023" version="4.0.3">
                                <ChangeLogListItem type="Fixed"><i>api_port_proxy</i> not respected in
                                    <i>config.json</i>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Updated dependencies</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="24. September 2023" version="4.0.2">
                                <ChangeLogListItem type="Fixed">Broken link to crates.io from dependencies
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">From <i>vue-cli</i> to <i>vite</i> for the UI
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Updated">Updated dependencies</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="19. September 2023" version="4.0.1">
                                <ChangeLogListItem type="Fixed">Delete button in UI not working</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="17. September 2023" version="4.0.0">
                                <ChangeLogListItem type="Attention">Kellnr is now available as open-source under the MIT
                                    license</ChangeLogListItem>
                                <ChangeLogListItem type="Update">Moved Kellnr repository to <a
                                        href="https://github.com/kellnr/kellnr">Github - Kellnr</a></ChangeLogListItem>
                                <ChangeLogListItem type="Update">Moved Kellnr installer repository to <a
                                        href="https://github.com/kellnr/installer">Github - Kellnr Installer</a>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Update">Moved Kellnr helm repository to <a
                                        href="https://github.com/kellnr/helm">Github - Kellnr helm</a>
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="02. September 2023" version="3.2.0">
                                <ChangeLogListItem type="Added">Removed license checks, Kellnr is fully free for
                                    commercial
                                    usage from now on</ChangeLogListItem>
                                <ChangeLogListItem type="Added"><i>Postgresql</i> now available as backend database,
                                    additional to <i>sqlite</i></ChangeLogListItem>
                                <ChangeLogListItem type="Added">Authentication on pull now available in all Kellnr
                                    variants
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="30. July 2023" version="3.1.0">
                                <ChangeLogListItem type="Added">Initial support for authentication on pull <a
                                        href="https://doc.rust-lang.org/nightly/cargo/reference/unstable.html#registry-auth">RFC
                                        #3139</a>. Enterprise only a.t.m.</ChangeLogListItem>
                                <ChangeLogListItem type="Added"><i>crates_io_num_threads</i> allows to set the number of
                                    threads used to keep the crates.io index up-to-date</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Flag <i>git_index</i> to disable the git index and only
                                    use
                                    the new sparse index</ChangeLogListItem>
                                <ChangeLogListItem type="Attention">The git index is disabled for new installations of
                                    <i>kellnr</i> per default
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Missing (un)yank in database index</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="30. June 2023" version="3.0.1">
                                <ChangeLogListItem type="Update">Update all dependencies</ChangeLogListItem>
                                <ChangeLogListItem type="Update">Switch to new license validation backend
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Bug where the download number for uncommon crate names
                                    is
                                    counted incorrectly</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="29. May 2023" version="3.0.0">
                                <ChangeLogListItem type="Update">New user interface with light and dark theme
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Display readme of crate in the UI, if available
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Stabilized HTTP (sparse) registry API. See <RouterLink
                                        to="documentation#sparse-index">Sparse Index Protocol</RouterLink>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Attention">Before upgrading, backup the current version of
                                    <i>kellnr</i>.
                                    For more information see: <RouterLink to="documentation#backup">Backup</RouterLink>
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="03. January 2023" version="2.3.4">
                                <ChangeLogListItem type="Fixed">Error on publish where the config file cannot be found,
                                    if it is in an unexpected location is fixed
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="20. December 2022" version="2.3.3">
                                <ChangeLogListItem type="Added">Add <i>max_crates_size</i> and <i>max_docs_size
                                        config</i> values to allow bigger uploads
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="17. December 2022" version="2.3.2">
                                <ChangeLogListItem type="Added">Cache in UI for faster load times</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Docker tags now released as <i>Major</i>,
                                    <i>Major.Minor</i> and <i>Major.Minor.Patch</i>
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Crates were not ordered alphabetically in the UI
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Crates not sorted by biggest version but last updated
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="07. December 2022" version="2.3.1">
                                <ChangeLogListItem type="Fixed">Crates published to Kellnr are listed in the UI but are
                                    not available in the index pulled by Cargo
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="04. December 2022" version="2.3.0">
                                <ChangeLogListItem type="Added">Adds license information in the admin settings view
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="27. November 2022" version="2.2.1">
                                <ChangeLogListItem type="Added">Better logging (more levels, different formats)
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Attention">The log levels changed. If you run into an error on
                                    startup, check the log levels in the documentation
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">High resource usage (CPU & RAM)</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Stability issues with the crates.io index mirror
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="11. November 2022" version="2.2.0">
                                <ChangeLogListItem type="Added">"Delete" button to remove crates from the index
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="31. October 2022" version="2.1.2">
                                <ChangeLogListItem type="Fixed">Fixes a bug where transitive dependencies are broken
                                    when crates are renamed
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="02. October 2022" version="2.1.1">
                                <ChangeLogListItem type="Fixed">Fixes a bug where the same crate is shown multiple times
                                    in the UI
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="27. September 2022" version="2.1.0">
                                <ChangeLogListItem type="Added">Add an in-memory cache for crate downloads. This takes
                                    load from the disk and reduces I/O
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="19. September 2022" version="2.0.0">
                                <ChangeLogListItem type="Added">Automatic rustdoc creation for uploaded crates. Flag
                                    "rustdoc_auto_gen" has to be set to <i>true</i></ChangeLogListItem>
                                <ChangeLogListItem type="Added">Add function to trigger build of rustdocs from the UI
                                    for the owner of a crate
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Add function to trigger a rebuild of the crates.io index
                                    from the UI if it got out-of-sync
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">The Docker version of Kellnr import TLS certificates on
                                    startup, if placed in a special folder. This allows Kellnr to trust its own
                                    certificate or another proxy
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Helm chart added support for additional DNS servers to
                                    use, such that Kellnr is able to download from itself
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Update">Kellnr is now compiled for Ubuntu 22.04 LTS instead of
                                    20.04 LTS
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Page reload for the first added user fixed
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="28. May 2022" version="1.6.0">
                                <ChangeLogListItem type="Added">HTTP API support to pull crates (currently in
                                    cargo-nightly)
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Update">New UI styling</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Stability issues</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="06. April 2022" version="1.5.2">
                                <ChangeLogListItem type="Added">New config flag <i>api_port_proxy</i>. Allows Kellnr to
                                    be run with a proxy that has a different port than Kellnr itself
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="03. March 2022" version="1.5.1">
                                <ChangeLogListItem type="Update">UI components</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Stability issues</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="08. December 2021" version="1.4.2">
                                <ChangeLogListItem type="Added">Overview UI for crates</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Parsing of features on crate publish</ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Allow arbitrary badges</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="11.November 2021" version="1.4.1">
                                <ChangeLogListItem type="Fixed">Broken docs link when a crate has a hyphen in the name
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="09. November 2021" version="1.4.0">
                                <ChangeLogListItem type="Added">Kellnr can now proxy and cache crates.io
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Fully async IO API for better performance
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Settings can only be changed in the config file or per
                                    environment variable
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Settings shows current startup config
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Support <i>https</i> as the protocol if a reverse-proxy
                                    provides TLS
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Helm Chart added support for TLS certificates
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Removed">Changing the setting with the UI was removed
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="10. September 2021" version="1.3.0">
                                <ChangeLogListItem type="Added">Less strict license checks</ChangeLogListItem>
                                <ChangeLogListItem type="Added">New license backend</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="13. July 2021" version="1.2.1">
                                <ChangeLogListItem type="Fixed">Version not correctly shown in UI fixed
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="04. July 2021" version="1.2.0">
                                <ChangeLogListItem type="Added">Multiarch Docker image</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Added support for ARMv7 additional to AARCH64 and
                                    AMD64
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Performance improvements through fully async API
                                </ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="13. May 2021" version="1.1.1">
                                <ChangeLogListItem type="Added">Improved UI for low resolution displays
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Fixed">Bug in statistics web interface</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="05. May 2021" version="1.1.0">
                                <ChangeLogListItem type="Added">Statistics panel on web interface</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Number of unique crates</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Number of unique versions</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Number of total crate downloads</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Top three downloaded crates</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Dark mode for the web interface</ChangeLogListItem>
                            </ChangeLogItem>

                            <ChangeLogItem date="07. April 2021" version="1.0.0">
                                <ChangeLogListItem type="Added">Full implementation of the private registry API for
                                    Cargo (push & pull crates)
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">Authentication and authorization</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Search & filter for crates</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Show information about a crate</ChangeLogListItem>
                                <ChangeLogListItem type="Added">Host rustdocs directly besides the crate
                                </ChangeLogListItem>
                                <ChangeLogListItem type="Added">ARM aarch64 and Intel x64 support</ChangeLogListItem>
                            </ChangeLogItem>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Changelog End -->
        <!--end section-->
    </div>
</template>
