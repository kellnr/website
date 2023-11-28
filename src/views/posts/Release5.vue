<script setup lang="ts">
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
import CodeBlock from "../../components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="Kellnr Version 5.0.0" date="28. November, 2023">
        <TextBlock>
            I am happy to announce the first release of Kellnr 5.0.0. This is a major release that brings no new features as
            you might expect, but reduces technical debt that accumulated over the last three years. As this release
            introduces breaking changes, it is a major version bump.
        </TextBlock>

        <SubHeader id="axum">Switch to Axum</SubHeader>
        <TextBlock>
            I started to work on Kellnr in 2020, <a href="https://rocket.rs/">Rocket</a> was the most promising web
            framework for Rust. It was well documented and had everything I needed. I could start right away with
            implementing Kellnr. Unfortunately, the maintenance of Rocket stopped shortly after I released Kellnr. The
            0.5.0 version was in an RC state for over a year and the development seemed to have stalled. While Rocket seems
            to have gained some traction in the last few weeks, I decided to switch to <a
                href="https://docs.rs/axum/latest/axum/">Axum</a>, which is one of the most
            popular frameworks now. As Axum is part of the Tokio ecosystem, it has a lot of supporters and is under
            constant development. So I hope that this was the first and last switch of the web framework for Kellnr
        </TextBlock>

        <SubHeader id="shoutout">Shoutout - A big Thank You!</SubHeader>
        <TextBlock>
            I had never worked with Axum before and porting thousands of lines of code with corresponding tests from one framework to another was a huge challenge. Luckily, a few brave rustaceans stepped up, after I asked for help on 
            <a
                href="https://www.reddit.com/r/rust/comments/16xzn6i/help_required_port_kellnr_from_rocketrs_to_axum/">/r/rust</a>.
            <br />
            <br />
            I want to thank <a href="https://github.com/ItsEthra">ItsEthra</a>, who ported the first code to Axum, including authentication and custom request and response types. This helped me a lot to get started with the port. <a href="https://github.com/sinyo-matu">sinyo-matu</a> fixed bugs and added middleware for authentication. <a href="https://github.com/waywardmonkeys">waywardmonkeys</a> fixed many issues in the build pipeline and some code smells. A big thank you to all of you! 
            <br />
            <br />
            Amidst all the drama that goes on in the Rust community from time to time, let us not forget that there are many great people out there, who are willing to help. I am very grateful for that and the Rust community should focus on positive examples like this a bit more.
        </TextBlock>

        <SubHeader id="git-index">Gix Index Removed</SubHeader>
        <TextBlock>
            The 5.0.0 version removes the git index completely. With the introduction of the sparse API, based on HTTP, I
            deprecated the git index with Kellnr 3.1.0. While older cargo versions don't support the new API, everyone on a
            recent cargo version uses the new sparse API already per default.

            The 5.0.0 version removes the git index completely. With the introduction of the sparse API, based on HTTP, I deprecated the git index with Kellnr 3.1.0. While older cargo versions don’t support the new API, everyone on a recent cargo version uses the new sparse API by default.
            <br />
            <br />
            The git index was a pain to maintain and not well suited for private registries like Kellnr. The new sparse API solves these issues and is the right way forward for Rust. As Kellnr is a one-man-show, I like to keep the code as small as possible to make it maintainable.
        </TextBlock>

        <SubHeader id="settings">Refactored Settings</SubHeader>
        <TextBlock>
            The settings grew over time and became a bit messy. I refactored the settings and split them into different
            parts. If you want to upgrade from an older Kellnr version to 5.0.0, you need to adjust your settings first!
        </TextBlock>

        <TextBlock>
            You find the new default settings below. For more information on the settings, see the <router-link
                to="/documentation">documentation</router-link>. If you use the <a
                href="https://github.com/kellnr/installer">installer script</a> don't forget to use the new settings as
            well. The <a href="https://github.com/kellnr/helm">Helm chart</a> was refactored as well, so have a look at the
            new <a href="https://github.com/kellnr/helm/blob/main/charts/kellnr/values.yaml">values.yaml</a>.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="toml">
####################################################################################
#                                                                                  #
# Values used only on the first startup. Can be changed using the UI on runtime.   #
#                                                                                  #
####################################################################################
[setup]
admin_pwd = "admin"
admin_token = "Zy9HhJ02RJmg0GCrgLfaCVfU6IwDfhXD"

####################################################################################
#                                                                                  #
# Values used on each start of Kellnr. Overwrite and restart Kellnr to change.     #
#                                                                                  #
####################################################################################

[registry]
# Directory where Kellnr stores all its data, e.g. crates, incides etc.
data_dir = "/opt/kdata"
# Seconds until a user is logged out automatically after inactivity in the UI
session_age_seconds = 28800
# Enable or disable automatic rustdoc generation for uploaded crates
cache_size = 1000
# Max size of a crate that can be uploaded to Kellnr in MB
max_crate_size = 10
# Enable required authentication for crate pulls.
# If set to "false", anyone can download crates from Kellnr. Upload always requires authentication.
# This feature is currently a nightly only feature in cargo and might break in the future,
# as the RFC is not fully done yet.
auth_required = false

[docs]
# Enable or disable automatic rustdoc generation for uploaded crates
enabled = false
# Max size of a crate docs that can be uploaded to Kellnr in MB
max_size = 100

[proxy]
# Set to "true" to enable the crates.io proxy. The the official Kellnr documentation
# for more information.
enabled = false
# Number of threads used to keep the crates.io proxy up to date.
# A too high number can lead to exhausting the available database connection.
num_threads = 20

[log]
# Set the log level to "trace", "debug", "info", "warn", or "error".
level = "info"
# Set the log format to "compact", "pretty" or "json".
format = "compact"
# Set the log level for the underlaying web framework to "trace", "debug", "info", "warn", or "error".
level_web_server = "warn"

[local]
# Address where the API and web server is started. Usually no change is needed.
ip = "0.0.0.0"
# The port where Kellnr starts listening for incoming connections
port = 8000

# Address where Kellnr will be reachable
# E.g. https://kellnr.example.com:443
# This setting is important as the cargo protocol needs Kellnr
# to know, where it is reachable from the outside, e.g. behind a reverse proxy.
[origin]
# The hostname where Kellnr is reachable from the outside
hostname = "127.0.0.1"
# If a proxy is used in front of Kellnr, the port of the proxy can be specified here
# If no proxy is used, it is the same as the "api_port"
port = 8000
# Either "https" or "http". Use in combination with a reverse proxy that provides HTTPS.
protocol = "http"

# Configure Postgresql as the database backend instead of Sqlite
[postgresql]
enabled = false
address = "localhost"
port = 5432
db = "kellnr"
user = ""
pwd = ""
</code></pre>
        </CodeBlock>

        <SubHeader id="outlook">Your Help Is Required</SubHeader>
        <TextBlock>As usual with big releases, there will be bugs. If you find any, either in Kellnr itself, the
            documentation, installer or Helm chart, please report them on the correspondig Github page. Extra points for a
            pull requests that fixes them!</TextBlock>

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
