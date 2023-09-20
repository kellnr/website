<script setup lang="ts">
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
</script>

<template>
    <BlogPostTemplate title="Rust Supply Chain Security" date="10. April, 2023">
        <TextBlock>
            Rust is a modern programming language that aims to provide memory safety, concurrency and performance. Rust
            has a rich ecosystem of libraries and tools that help developers build reliable and efficient software.
            However, as with any software development process, there are also risks and challenges associated with the
            supply chain security of Rust projects.
        </TextBlock>

        <TextBlock>
            Supply chain security refers to the protection of software components from malicious or accidental tampering
            during their development, distribution and deployment. A compromised component can introduce
            vulnerabilities, backdoors or malware into the final product, affecting its functionality, quality and
            trustworthiness. Some examples of supply chain attacks are:<br/>
            <br/>
            <ul>
                <li>Dependency confusion: an attacker publishes a malicious package with a name similar or identical to
                    a legitimate one, hoping to trick users into installing it instead of the original one.
                </li>
                <li>Typosquatting: an attacker registers a domain name that is similar to a popular one, but with a typo
                    or a different extension, and hosts a malicious website or package on it.
                </li>
                <li>Code injection: an attacker modifies the source code or binary of a package, either directly or
                    through a compromised repository or server, and inserts malicious code into it.
                </li>
                <li>Credential theft: an attacker steals the credentials of a developer or maintainer of a package, and
                    uses them to publish malicious updates or delete existing versions.
                </li>
            </ul>
        </TextBlock>

        <SubHeader id="mitigations">Mitigations</SubHeader>
        <TextBlock>
            To mitigate these risks and ensure the integrity and authenticity of Rust components, there are several best
            practices and tools that can be adopted by both developers and users. Some of them are:<br/>
            <br/>
            <ul>
                <li>Use secure sources: always download packages from trusted sources, such as <a href="http://crates.io/">crates.io</a>, the official
                    Rust package registry, or verified mirrors. Avoid using unverified third-party repositories or
                    websites that may host malicious or outdated packages.
                </li>
                <li>Audit dependencies: ensure that a package has not been tampered with and that it comes from a
                    legitimate source. Tools such as <a href="https://github.com/crev-dev/cargo-crev">cargo-crev</a> or <a href="https://github.com/RustSec/rustsec/tree/main/cargo-audit">cargo-audit</a> can help with this task.
                </li>
                <li>Keep up-to-date: review the dependencies of your project regularly, and make sure they are
                    up-to-date and secure. Use tools such as <a href="https://embarkstudios.github.io/cargo-deny/">cargo-deny</a> or <a href="https://github.com/kbknapp/cargo-outdated">cargo-outdated</a> to detect outdated, insecure
                    or incompatible dependencies, and <a href="https://doc.rust-lang.org/cargo/commands/cargo-tree.html">cargo-tree</a> or <a href="https://github.com/onur/cargo-license">cargo-license</a> to inspect their licenses and origins.
                </li>
                <li>Isolate environments: use separate environments for development, testing and production, and limit
                    the access and privileges of each one. Use tools such as <a href="https://github.com/insanitybit/cargo-sandbox">cargo-sandbox</a> or <a href="https://github.com/LukeMathWalker/cargo-chef">cargo-chef</a> to create
                    isolated and reproducible environments for your Rust projects.
                </li>
                <li>Educate yourself: stay informed about the latest trends and threats in the Rust ecosystem, and
                    follow the recommendations and guidelines from the Rust community and security experts. Subscribe to
                    newsletters such as <a href="https://this-week-in-rust.org/">This Week in Rust</a> or <a href="https://rustsec.org/">RustSec Advisory Database</a>, and join forums such as <a href="https://www.reddit.com/r/rust">r/rust</a>
                    or <a href="https://users.rust-lang.org/">users.rust-lang.org</a>.
                </li>
            </ul>
        </TextBlock>
    </BlogPostTemplate>
</template>
