<script setup lang="ts">
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
</script>

<template>
    <BlogPostTemplate title="Kellnr 2025 - A Year in Review" date="20. January, 2026">
        <TextBlock>
            2025 was an incredible year for Kellnr. With 484 commits, 9 releases (from v5.3.0 to v5.9.1), and contributions
            from 16 community members, the project saw significant growth in both features and adoption. In this post, I want
            to highlight the major developments and thank everyone who contributed to making Kellnr better.
        </TextBlock>

        <SubHeader id="statistics">Project Statistics</SubHeader>

        <TextBlock>
            Here's a look at Kellnr's growth on GitHub in 2025:
            <ul>
                <li><strong>Stars:</strong> +414 (from ~476 to 890) - nearly doubled!</li>
                <li><strong>Forks:</strong> +30 new forks (71 total)</li>
                <li><strong>Pull Requests:</strong> 297 PRs created</li>
                <li><strong>Issues:</strong> 51 issues opened</li>
                <li><strong>CI Runs:</strong> 602 workflow runs (79% success rate)</li>
                <li><strong>Releases:</strong> 18 releases (including pre-releases)</li>
                <li><strong>Downloads:</strong> 770+ release asset downloads</li>
                <li><strong>Docker Pulls:</strong> 358K+ (kellnr) + 277 (kellnr-minimal)</li>
                <li><strong>Contributors:</strong> 30 total (16 active in 2025)</li>
            </ul>
        </TextBlock>

        <SubHeader id="features">New Features and Improvements</SubHeader>

        <TextBlock>
            <div class="feature-card">
                <h4>S3 Storage Support <span class="version">v5.4.0</span></h4>
                <p>One of the most requested features finally landed in March. Kellnr now supports S3 and S3-compatible
                    storage backends like MinIO. This allows organizations to store their crates in scalable cloud
                    storage instead of local filesystems. Later in the year, we added environment variable configuration
                    for S3 and IAM role/service account authentication, making it even easier to integrate with
                    cloud-native deployments.</p>
            </div>

            <div class="feature-card">
                <h4>New Web Interface <span class="version">v5.5.0</span></h4>
                <p>In April, Kellnr received a complete redesign of its web interface using Vue 3 and Vuetify 3. The new
                    UI is modern, responsive, and provides a much better user experience for managing your private crate
                    registry.</p>
            </div>

            <div class="feature-card">
                <h4>Webhook API <span class="version">v5.9.0</span></h4>
                <p>December brought one of the most exciting features: webhooks. You can now receive notifications when
                    crates are added, updated, yanked, or unyanked. This enables powerful automation workflows like
                    triggering CI/CD pipelines, sending notifications, or updating documentation. The webhook system
                    includes a retry mechanism for reliability.</p>
            </div>

            <div class="feature-card">
                <h4>Single File Binary <span class="version">v5.9.0</span></h4>
                <p>Deployment got significantly simpler in December. Kellnr now ships as a completely self-contained
                    binary with the web UI and default configuration embedded. No more managing separate static files or
                    config directories - just download and run.</p>
            </div>

            <div class="feature-card">
                <h4>Access Control Improvements</h4>
                <ul>
                    <li><strong>Read-Only Users</strong> (<span class="version">v5.4.0</span>): A new permission level
                        for users who should only view and download crates but not publish, yank, or modify them.
                        Perfect for CI/CD systems or consumers.</li>
                    <li><strong>Required Cargo.toml Fields</strong> (<span class="version">v5.4.0</span>):
                        Administrators can now enforce metadata standards by requiring specific fields in Cargo.toml for
                        all published crates.</li>
                    <li><strong>Restrict New Crate Publishing</strong> (<span class="version">v5.6.0</span>): Admins can
                        require pre-approval for new crates by creating placeholder crates and assigning owners.</li>
                </ul>
            </div>

            <div class="feature-card">
                <h4>Deployment Flexibility</h4>
                <ul>
                    <li><strong>URL Subpath Support</strong> (<span class="version">v5.8.0</span>): Kellnr can now run
                        on a URL subpath like <code>example.com/kellnr/</code>, essential for reverse proxy
                        deployments.</li>
                    <li><strong>Bearer Token and Basic Authentication</strong> (<span class="version">v5.7.0</span>):
                        Improved compatibility with proxies like Sonatype Nexus and other enterprise infrastructure.
                    </li>
                </ul>
            </div>

            <div class="feature-card">
                <h4>Performance and Reliability</h4>
                <ul>
                    <li>Database transactions for complex operations ensure data consistency</li>
                    <li>SQLite concurrency improvements for better crates.io proxy performance</li>
                    <li>New database indices for faster crates.io proxy queries</li>
                    <li>Single database connection pool optimization</li>
                    <li>Migration to Rust Edition 2024</li>
                </ul>
            </div>

            <div class="feature-card">
                <h4>API and DevOps</h4>
                <p>A new API endpoint <code>/api/v1/crates/:crate_name/crate_versions</code> was added to retrieve all
                    versions of a crate - particularly useful in CI/CD pipelines.</p>
                <p>Other improvements include Playwright end-to-end tests replacing Lua smoke tests, automated Helm
                    chart and website updates on release, auto-merge for Dependabot PRs, improved Nix flake for
                    cross-compilation, and workspace-based linting with pedantic clippy.</p>
            </div>
        </TextBlock>

        <SubHeader id="contributors">Community Contributors</SubHeader>

        <TextBlock>
            A huge thank you to everyone who contributed to Kellnr in 2025! Open source projects thrive because of their
            communities, and I'm grateful for every contribution, whether it's code, bug reports, or feature requests.
            <br /><br />
            <strong>Major contributors:</strong>
            <ul>
                <li><a href="https://github.com/nyurik">@nyurik</a> - S3 environment configuration,
                    extensive code quality improvements and linting</li>
                <li><a href="https://github.com/hw0lff">@hw0lff</a> - URL subpath support, database query
                    fixes</li>
                <li><a href="https://github.com/sfb103">@sfb103</a> - S3 service account/IAM authentication
                </li>
                <li><a href="https://github.com/maciekglowka">@maciekglowka</a> - Webhook API, restricted
                    publishing, database transactions</li>
                <li><a href="https://github.com/5Dev24">@5Dev24</a> - Read-only users, required Cargo.toml
                    fields</li>
                <li><a href="https://github.com/giacomocariello">@giacomocariello</a> - Nix/x86_64
                    platform support</li>
                <li><a href="https://github.com/FlorentinDUBOIS">@FlorentinDUBOIS</a> - Bearer/basic
                    authentication</li>
                <li><a href="https://github.com/fellhorn">@fellhorn</a> - Crates.io database indices</li>
                <li><a href="https://github.com/CarlSchererKenbun">@CarlSchererKenbun</a> - Crate versions
                    API endpoint</li>
            </ul>
            <strong>Additional contributions:</strong>
            <a href="https://github.com/badsmoke">@badsmoke</a>,
            <a href="https://github.com/kisom">@kisom</a>,
            <a href="https://github.com/s-w2v3">@s-w2v3</a>,
            @ssash
        </TextBlock>

        <SubHeader id="releases">Release Timeline</SubHeader>

        <TextBlock>
            <table>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Date</th>
                        <th>Highlights</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>v5.3.0</td>
                        <td>January 18</td>
                        <td>Crate versions API endpoint</td>
                    </tr>
                    <tr>
                        <td>v5.4.0</td>
                        <td>April 2</td>
                        <td>S3 storage, read-only users, required fields</td>
                    </tr>
                    <tr>
                        <td>v5.5.0</td>
                        <td>April 17</td>
                        <td>New Vuetify web interface</td>
                    </tr>
                    <tr>
                        <td>v5.6.0</td>
                        <td>May 30</td>
                        <td>Restrict new crate publishing</td>
                    </tr>
                    <tr>
                        <td>v5.7.0</td>
                        <td>August 31</td>
                        <td>Bearer/basic authentication</td>
                    </tr>
                    <tr>
                        <td>v5.8.0</td>
                        <td>November 3</td>
                        <td>URL subpath support, S3 env config</td>
                    </tr>
                    <tr>
                        <td>v5.9.0</td>
                        <td>December 28</td>
                        <td>Webhook API, single file binary</td>
                    </tr>
                </tbody>
            </table>
        </TextBlock>

        <SubHeader id="looking-ahead">Looking Ahead</SubHeader>

        <TextBlock>
            2025 was a transformative year for Kellnr. The addition of S3 storage, webhooks, and improved deployment
            options have made Kellnr more enterprise-ready than ever. The growing community contributions show that
            Kellnr is becoming an important part of the Rust ecosystem for organizations that need private crate hosting.
            <br /><br />
            Thank you to everyone who uses Kellnr, reports bugs, suggests features, or contributes code. Your support makes
            this project possible. If you'd like to support Kellnr's development, consider
            <a href="https://github.com/sponsors/secana">sponsoring on GitHub</a> or contributing to the
            <a href="https://github.com/kellnr/kellnr">project</a>.
            <br /><br />
            Here's to an even better 2026!
        </TextBlock>
    </BlogPostTemplate>
</template>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

th,
td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
}

th {
    background-color: #f5f5f5;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #fafafa;
}

code {
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
}

.version {
    display: inline-block;
    background-color: #e8f5e9;
    color: #2e7d32;
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    font-weight: 500;
}

.feature-card {
    background-color: #fafafa;
    border-left: 4px solid #2e7d32;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
    border-radius: 0 4px 4px 0;
}

.feature-card:last-child {
    margin-bottom: 0;
}

.feature-card h4 {
    margin: 0 0 0.75rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.feature-card p {
    margin: 0 0 0.5rem 0;
}

.feature-card p:last-child {
    margin-bottom: 0;
}

.feature-card ul {
    margin: 0;
    padding-left: 1.25rem;
}

.feature-card ul li {
    margin-bottom: 0.5rem;
}

.feature-card ul li:last-child {
    margin-bottom: 0;
}
</style>
