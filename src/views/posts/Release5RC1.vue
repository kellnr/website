<script setup lang="ts">
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
</script>

<template>
    <BlogPostTemplate title="Kellnr Version 5.0.0-rc1" date="22. November, 2023">
        <TextBlock>
            I am happy to announce the first release candidate of Kellnr 5.0.0. This is a major release that brings no new feature as you might expect, but reduces technical dept that stacked up over the last three years. As this release introduces breaking changes, it is a major version bump.
        </TextBlock>

        <SubHeader id="axum">Switch to Axum</SubHeader>
        <TextBlock>
            When I started to work on Kellnr in 2020, <a href="https://rocket.rs/">Rocket</a> was the most promising web framework for Rust. It was well documented and batteries were included. I could start right away with implementing Kellnr. Unfortunatly the maintenance of Rocket stopped shortly after I released Kellnr. The 0.5.0 version was in an RC state over a year and seemingly, the development had stopped. While Rocket seems to gain some traction in the last weeks, I made the decision to switch to <a href="https://docs.rs/axum/latest/axum/">Axum</a>, which is one of the most popular frameworks now. As Axum is part of the Tokio ecosystem, it has a lot of supporters and is under constant development. So my hope are that this was the first and last switch of the web framework for Kellnr.
        </TextBlock>

        <SubHeader id="shoutout">Shoutout - A big Thank You!</SubHeader>
        <TextBlock>

        </TextBlock>

    </BlogPostTemplate>
</template>
