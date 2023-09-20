<script setup lang="ts">
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
</script>

<template>
    <BlogPostTemplate title="Kellnr goes Open-Source" date="20. September, 2023">
        <TextBlock>
            I’m excited to announce that Kellnr, the crate registry for Rust, is now open source under the MIT license. &#x1f389; &#x1f973;
            <br />
            <br />
            Kellnr is a free and open-source registry for Rust crates. It functions similarly to crates.io, but with the
            added benefit of being able to host it on your own hardware for private crates. You can find more information
            about Kellnr on the official <a href="https://kellnr.io">Kellnr webpage</a>.
            <br />
            <br />
            While Kellnr has always been free to use, it was previously closed source. Over the past three years, I’ve
            dedicated more than 1000 hours of my free time to this project. During this time, Kellnr underwent three
            rewrites of the web UI, changed cloud providers three times, and had most of its code rewritten multiple times
            to incorporate what I’ve learned along the way and reflect changes in the Rust ecosystem. There are still many
            improvements I would like to make and additional features I hope to see in Kellnr in the future.
        </TextBlock>

        <TextBlock>
            <div style="text-align: center;">
                <div class="h1 font-weight-bold text-blue">
                    &lt;'kellnr&gt;
                </div>
                <div class="font-weight-bold" style="color: red; font-size: 3rem;">
                    &#10084;
                </div>
                <div class="h2 font-weight-bold text-blue">
                    Open Source
                </div>
            </div>
        </TextBlock>


        <SubHeader id="features">Features</SubHeader>
        <TextBlock>
            I started Kellnr in 2021 when I switched to Rust full-time because there was no good registry available for
            free. I wanted something that could be started with one command for simple projects but could also scale for
            large deployments. Kellnr grew over that time and now support a multitude of features.
            <br />
            <br />
            Key features of Kellnr include:

            <ul>
                <li> Private hosting of crates on your own hardware
                </li>
                <li> Automatic build and hosting of rustdocs
                </li>
                <li> Crates.io cache
                </li>
                <li> Git index and the new sparse index protocol
                </li>
                <li> Authentication for pull and push of crates
                </li>
                <li> A web UI to search for crates and administer Kellnr itself
                </li>
                <li> Light and dark mode
                </li>
            </ul>
            It supports two database backends:
            <ul>
                <li>
                    Sqlite
                </li>
                <li>
                    PostgreSQL
                </li>
            </ul>
            Kellnr can run on the following architectures:
            <ul>
                <li>
                    Aarch64 (e.g., Raspberry Pi 4 or Apple Silicon)
                </li>
                <li>
                    x86_64 (e.g., Intel or AMD)
                </li>
                <li>
                    arm7 (e.g., older Raspberry Pi or other SOCs)
                </li>
            </ul>
            Kellnr can be deployed using the following methods:
            <ul>
                <li>
                    Bare metal
                </li>
                <li>
                    Docker Image
                </li>
                <li>
                    Helm Chart
                </li>
            </ul>
        </TextBlock>

        <SubHeader id="open-source">Open Source</SubHeader>
        <TextBlock>
            Kellnr is now available under the <a href="https://raw.githubusercontent.com/kellnr/kellnr/main/LICENSE">MIT
                license</a> on <a href="https://github.com/kellnr/kellnr">Github</a>.
            I previously offered commercial support for businesses with a Kellnr Professional license, but with the open
            sourcing of Kellnr, this offer has ended, and there will no longer be a commercial version of Kellnr.
            Nonetheless, if you like Kellnr and want to support its development, you can do so by sponsoring me on <a
                href="https://github.com/sponsors/secana">Github Sponsors</a>, or by contributing to the project.
        </TextBlock>

        <SubHeader id="follow">Follow Kellnr</SubHeader>
        <TextBlock>
            If you want to stay up to date with Kellnr, you can subscribe to the <a href="https://kellnr.io/rss.xml">RSS
                feed</a> of this blog or follow Kellnr on <a href="https://github.com/kellnr/kellnr">Github</a>.
        </TextBlock>
    </BlogPostTemplate>
</template>
