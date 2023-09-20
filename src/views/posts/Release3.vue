<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import ImageBlock from "../../components/elements/ImageBlock.vue";
</script>

<template>
  <BlogPostTemplate title="Kellnr 3.0.0 Release" date="29. May, 2023">
    <SubHeader id="release-3">Kellnr 3.0.0 Release</SubHeader>  
    <TextBlock>
      <span class="text-primary font-weight-bold">Kellnr</span> is a free Rust registry that allows users to host their own crates.
      After four months of work, the latest version of <span class="text-primary font-weight-bold">Kellnr</span> 3.0.0 is released. This post gives an overview of the changes and how to upgrade to the latest version.
    </TextBlock>
    
    <SubHeader id="brand-focus">Focus on the product Kellnr</SubHeader>
    <TextBlock>    With the new release, we redesigned the web page of <span class="text-primary font-weight-bold">Kellnr</span> and moved the domain from <a href="http://www.bitfalter.com">bitfalter.com</a> to <a href="https://kellnr.io">kellnr.io</a>. This gives <span class="text-primary font-weight-bold">Kellnr</span> as a product more focus
      and moves the company behind it into the background. The new website has a more modern appeal and we hope to win more users with it.
      <br/>
      <br/>
      With all the changes, our goal stays the same: Provide a <b>free</b> Rust registry for everyone to host their own crates with a commercial variant to keep the development sustainable.
    </TextBlock>
  
    <SubHeader id="sparse-header">Sparse Index</Subheader>
    <TextBlock>
      A lot of work went into extended support for the <a href="https://rust-lang.github.io/rfcs/2789-sparse-index.html">sparse index</a>. So far, <i>cargo</i> used <i>git</i> to maintain the index of available <i>crates</i>.
      Until now, a registry provided a <i>git</i> repository with a description of all available <i>crates</i> in it. <i>Cargo</i> then cloned the repository to disk and updated it with a <i>git pull</i> to check for new versions. As the index grows overtime, this steps can take multiple minutes,
      which takes a significant portion of the build time in CI/CD pipelines. Besides taking long to clone, the repository takes multiple gigabytes of storage on disk and grows indefinetly. Usually only a very small portion of the <i>crates</i> available in a registry is needed locally to build a project, such that most
      of the index on disk was wasted space.
      <br/>
      <br/>
      To solve the performance and storage issues, the <i>sparse index</i> was introduced in <a href="https://blog.rust-lang.org/2023/03/09/Rust-1.68.0.html">cargo 1.68.0</a>. Instead of using <i>git</i> to maintain the index, a HTTP API is used.
      The advantage of the new API is that only the <i>crate</i> indices of the needed <i>crates</i> are pulled, instead of all availabe indices. This provides a significant performance boost and saves disk space.
      <br/>
      <br/>
      While <span class="text-primary font-weight-bold">Kellnr</span> supported the <i>sparse index</i> from the first draft on, we didn't push for its usage as it wasn't stabilized in <i>cargo</i>. This changes with the latest release of <span class="text-primary font-weight-bold">Kellnr</span>.
      We put a lot of effort into decoupling the old <i>git</i> index from the HTTP API, such that we can remove the support for the <i>git</i> index in the future. We recommend everyone who uses <span class="text-primary font-weight-bold">Kellnr</span> and an up-to-date version of <i>cargo</i> (>= 1.68.0),
      to switch to the <i>sparse index</i>.
      For information on how to switch, see the <RouterLink to="/documentation#sparse-index">documentation</RouterLink>.
      <br/>
      <br/>
      Until further notice, <span class="text-primary font-weight-bold">Kellnr</span> will run both indices types in parallel to support older versions of <i>cargo</i>, but we will add an option to disable the <i>git</i> index in the future, or remove it completely, if there is no demand for it.
    </TextBlock>
    
    <SubHeader id="new-ui">New UI for Kellnr</SubHeader>
    <TextBlock>
      With the 3.0.0 release, we updated the looks of <span class="text-primary font-weight-bold">Kellnr</span> significantly. This is the second overhaul of the UI in the history of <span class="text-primary font-weight-bold">Kellnr</span>. So far, we put most of our effort in the backend to provide the best possible experience for a private registry.
      Unfortunately this meant that the UI was left behind in development effort. With this release, we lay the foundations for a better UI, such that <span class="text-primary font-weight-bold">Kellnr</span> isn't only pleasent to use, but to look at, too. 
      <br/>
      <br/>
      One of the new features in the UI is the possibility to display any <i>Readme.md</i> for a <i>crate</i>, if any is provided. If a <i>Readme.md</i> is inside of the <i>crate</i> project folder, it will be uploaded automatically and shown on the details page of the <i>crate</i> in <span class="text-primary font-weight-bold">Kellnr</span>.
      The image below shows an example of a <i>Readme.md</i> with some code blocks inside.
    </TextBlock>
    <ImageBlock src="/images/kellnr/blog/release3/overview-light.png" alt="kellnr ui with readme"></ImageBlock>
    
    <SubHeader id="upgrade">Upgrade to 3.0.0</SubHeader>
    <TextBlock>
      Before upgrading to <span class="text-primary font-weight-bold">Kellnr</span> 3.0.0, we recommend a backup of the data. See the <RouterLink to="/documentation#backup">backup documentation</RouterLink> for more information. The upgrade itself works as any upgrade before. 
      Just install the newest version over the current one. Check the <RouterLink to="/documentation#installation">installation documentation</RouterLink> for the different installation methods.
      <br/>
      <br/>
      If you use the <a href="https://github.com/Bitfalter/helm">Helm Chart</a> to run <span class="text-primary font-weight-bold">Kellnr</span>, backup your storage claims and update to the chart version 1.0.0.
      <br/>
      <br/>
      If you run into any trouble, <RouterLink to="/contact">contact us</RouterLink>. It doesn't matter if you use the free Community edition or the commercial Professional, we want <span class="text-primary font-weight-bold">Kellnr</span> to work for everyone.
    </TextBlock>
    
    <SubHeader id="thank-you">Thank you!</SubHeader>
    <TextBlock>
    We want to close this post with a <b>thank you</b> for supporting us in the last two years. Without your feedback, <span class="text-primary font-weight-bold">Kellnr</span> wouldn't be the product it is today. Please let us know, if you find any bugs or miss any features, such that we 
    can improve <span class="text-primary font-weight-bold">Kellnr</span> even further.
    <br/>
    <br/>
    <b>Thank you</b> for helping us build the best free private registry for Rust!
    </TextBlock>
  </BlogPostTemplate>
</template>
