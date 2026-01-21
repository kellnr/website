<script setup lang="ts">
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import CodeBlock from "../../components/elements/CodeBlock.vue";
</script>

<template>
  <BlogPostTemplate title="Wrapping Cross-Platform Native Libraries in Rust" date="14. January, 2024">
    <TextBlock>
      I needed to wrap a native C library for a cross-platform project in Rust. I decided to use the typical pattern of a
      <i>*-sys</i> crate and a crate that wraps the sys-crate in a more Rust-like API. This blog post describes the steps
      I took to wrap the native library in Rust. I decided to write a blog post about it, as all posts I found online where
      incomplete and left out important details.
    </TextBlock>

    <SubHeader id="initial-situation">Initial Situation</SubHeader>
    <TextBlock>
      As the library I needed to wrap is proprietary, I will use a different library as an example. Let's say the library is
      called <i>coolmath</i> and it has some interesting algorithms that we want to use in Rust. We do not have any source
      code for the library. Just a header with the function definitions and the corresponding dynamic (shared) libraries for the
      different operating systems and architecture are provided. No static libraries are provided, so we need to link at
      runtime.
      <br />
      <br />
      We have the following files:

      <ul>
        <li>coolmath.h - The header with the function definitions. It is the same for each platform.</li>
        <li>libcoolmath_linx64.so - Dynamic library for Linux x86_64 (Intel/AMD) CPUs.</li>
        <li>libcoolmath_linarm64.so - Dynamic library for Linux AARCH64 (ARM64) CPUs.</li>
        <li>libcoolmath_macx64.dylib - Dynamic library for macOS x86_64 (Intel/AMD) CPUs.</li>
        <li>libcoolmath_macarm64.dylib - Dynamic library for macOS AARCH64 (ARM64) CPUs.</li>
        <li>coolmath_winx64.dll - Dynamic library for Windows x86_64 (Intel/AMD) CPUs.</li>
        <li>coolmath_winarm64.dll - Dynamic library for Windows AARCH64 (ARM64) CPUs.</li>
      </ul>

      Our cross-platform Rust library wrapper should support Windows, Linux and macOS on x86_64 and AARCH64 CPUs. Other
      systems cannot be supported as the vendor does not provide any libraries for them.
    </TextBlock>

    <SubHeader id="what-we-want">What we want to have</SubHeader>
    <TextBlock>
      A typical pattern in Rust for wrapping native libraries is to have a <i>*-sys</i> crate that contains the bindings
      to the native library and a crate that wraps the sys-crate in a more Rust-like API. We will call the sys-crate
      <i>coolmath-sys</i> and the wrapper crate <i>coolmath</i>. The <i>coolmath-sys</i> crate should be usable as a
      dependency in other crates, but usually the sys-crate is not used directly. The <i>coolmath</i> crate should be
      usable as a dependency in other crates and should depend on the <i>coolmath-sys</i> crate.
    </TextBlock>

    <SubHeader id="create-crate">Creating the coolmath-sys crate</SubHeader>
    <TextBlock>
      We start by creating a new Rust crate with <i>cargo new --lib coolmath-sys</i>. In the newly created directory, we
      create a new directory called <i>vendor</i>. This contains all libraries and headers in sub-folders that we need for
      our crate. The full directory-tree looks like this:
    </TextBlock>
    <CodeBlock lang="bash">
coolmath-sys
├── Cargo.toml
├── src
│   └── lib.rs
└── vendor
    ├── inc
    │   └── coolmath.h
    └── lib
        ├── libcoolmath_linx64.so
        ├── libcoolmath_linarm64.so
        ├── libcoolmath_macx64.dylib
        ├── libcoolmath_macarm64.dylib
        ├── coolmath_winx64.dll
        └── coolmath_winarm64.dll
    </CodeBlock>

    <SubHeader id="build-script">Build Script</SubHeader>
    <TextBlock>
      Next, we need a <i>build.rs</i> file in the root of our crate. This file is used by cargo to build our crate. It runs
      <a href="https://github.com/rust-lang/rust-bindgen">bindgen</a> to automatically generate
      the bindings for our native library. Additionally we need a <i>wrapper.h</i> in the root directory of our crate.
      This header includes all headers from our native library that bindgen needs to generate bindings for. In our case
      its just one, the <i>coolmath.h</i>, but if you need more headers, add them to the <i>wrapper.h</i>.
    </TextBlock>

    <CodeBlock lang="c">// wrapper.h
// Include all headers that bindgen needs to generate bindings for.
#include "vendor/inc/coolmath.h"
    </CodeBlock>

    <TextBlock>
      We need to add <i>bindgen</i> as a dependency to our <i>Cargo.toml</i> file. It has to be a build dependency, as it runs only on build time, to generate the Rust bindings. Add the
      following code to your <i>Cargo.toml</i> file.
    </TextBlock>

    <CodeBlock lang="toml"># ... your Cargo.toml
[build-dependencies]
bindgen = "0.69.1"
    </CodeBlock>

    <TextBlock>
      The <i>build.rs</i> is the most interesting part. All the magic to create a sys-crate happens here. You find the build script for our fictional library below.
    </TextBlock>

    <CodeBlock lang="rust">use std::{env, fs};
use std::path::{PathBuf, Path};

fn main() {
    // Tell cargo to look for shared libraries in the specified directory
    let libdir_path = PathBuf::from("vendor/lib")
        .canonicalize()
        .expect("cannot canonicalize vendor path");
    println!("cargo:rustc-link-search={}", libdir_path.to_str().unwrap());
    println!("cargo:rustc-link-search={}", env::var("OUT_DIR").unwrap());

    // If on Linux or MacOS, tell the linker where the shared libraries are
    // on runtime (i.e. LD_LIBRARY_PATH)
    match target_and_arch() {
        (Target::Linux, _) | (Target::MacOS, _) =&gt; {
            println!("cargo:rustc-link-arg=-Wl,-rpath,{}",
                     env::var("OUT_DIR").unwrap());
        }
        _ =&gt; {}
    }

    // Tell cargo to link against the shared library for the specific platform.
    // IMPORTANT: On macOS and Linux the shared library must be linked without
    // the "lib" prefix and the ".so" suffix. On Windows the ".dll" suffix must
    // be omitted.
    match target_and_arch() {
        (Target::Windows, Arch::X86_64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_winx64");
            copy_dylib_to_target_dir("coolmath_winx64.dll");
        }
        (Target::Windows, Arch::AARCH64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_winarm64");
            copy_dylib_to_target_dir("coolmath_winarm64.dll");
        }
        (Target::Linux, Arch::X86_64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_linx64");
            copy_dylib_to_target_dir("libcoolmath_linx64.so");
        }
        (Target::Linux, Arch::AARCH64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_linarm64");
            copy_dylib_to_target_dir("libcoolmath_linarm64.so");
        }
        (Target::MacOS, Arch::X86_64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_macx64");
            copy_dylib_to_target_dir("libcoolmath_macx64.dylib");
        }
        (Target::MacOS, Arch::AARCH64) =&gt; {
            println!("cargo:rustc-link-lib=coolmath_macarm64");
            copy_dylib_to_target_dir("libcoolmath_macarm64.dylib");
        }
    }

    // Tell cargo to invalidate the built crate whenever the wrapper changes
    println!("cargo:rerun-if-changed=wrapper.h");

    // The bindgen::Builder is the main entry point
    // to bindgen, and lets you build up options for
    // the resulting bindings.
    let bindings = bindgen::Builder::default()
        // The input header we would like to generate
        // bindings for.
        .header("wrapper.h")
        .clang_arg("-v")
        .derive_debug(true)
        .derive_default(true)
        // included header files changed.
        .parse_callbacks(Box::new(bindgen::CargoCallbacks::new()))
        // Finish the builder and generate the bindings.
        .generate()
        // Unwrap the Result and panic on failure.
        .expect("Unable to generate bindings");

    // Write the bindings to the $OUT_DIR/bindings.rs file.
    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}

fn copy_dylib_to_target_dir(dylib: &amp;str) {
    let out_dir = env::var("OUT_DIR").unwrap();
    let src = Path::new("vendor/lib");
    let dst = Path::new(&amp;out_dir);
    let _ = fs::copy(src.join(dylib), dst.join(dylib));
}

enum Target {
    Windows,
    Linux,
    MacOS
}

enum Arch {
    X86_64,
    AARCH64,
}

fn target_and_arch() -&gt; (Target, Arch) {
    let os = env::var("CARGO_CFG_TARGET_OS").unwrap();
    let arch = env::var("CARGO_CFG_TARGET_ARCH").unwrap();
    match (os.as_str(), arch.as_str()) {
        // Windows targets
        ("windows", "x86_64") =&gt; (Target::Windows, Arch::X86_64),
        ("windows", "aarch64") =&gt; (Target::Windows, Arch::AARCH64),
        // Linux targets
        ("linux", "x86_64") =&gt; (Target::Linux, Arch::X86_64),
        ("linux", "aarch64") =&gt; (Target::Linux, Arch::AARCH64),
        // MacOS targets
        ("macos", "x86_64") =&gt; (Target::MacOS, Arch::X86_64),
        ("macos", "aarch64") =&gt; (Target::MacOS, Arch::AARCH64),
        _ =&gt; panic!("Unsupported operating system {} and architecture {}", os, arch),
    }
}
    </CodeBlock>

    <TextBlock>
      There are a few interesting things happening here. First, we tell cargo where to find the shared libraries. Then we
      check which platform we are building for and link against the correct shared library. We also copy the shared
      library to the target directory, so it can be found at runtime. Finally, we tell bindgen to generate the bindings
      for our native library. You may wonder, why environment variable are used to determine the operating system and
      architecture instead of <i>#[cfg(...)]</i> that you may know from other Rust projects. The problem with the
      <i>#[cfg(...)]</i> approach is that it does not work correctly for cross-platform builds. You run into ugly linker
      issues, where the linker tries to link against the wrong platform.
    </TextBlock>

    <CodeBlock lang="rust">// Alternative to environment variables are #[cfg(...)] directives.
// Unfortunately, they do not work correctly for cross-platform builds.
// For example, the following code does not work:
#[cfg(all(target_os = "linux", target_arch = "x86_64"))]
    </CodeBlock>

    <SubHeader id="lib">Include wrapped code in our library</SubHeader>
    <TextBlock>
      Until now, we have not written any Rust code. We only have a <i>build.rs</i> and a <i>wrapper.h</i> file. We want to
      export the wrapped C code in our sys-crate, so it can be used by other crates. We do this by adding the following
      code to our <i>lib.rs</i> file. This includes the generated bindings in our crate code and exports them for others
      to use.
    </TextBlock>

    <CodeBlock lang="rust">// src/lib.rs
#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
    </CodeBlock>

    <SubHeader id="special-cases">Special Cases</SubHeader>
    <TextBlock>
      In theory, we are done. A <i>cargo build</i> should build our crate and generate the bindings. Unfortunately, there
      are a few special cases that we need to handle. On Linux, there is nothing more to-do. But on the other platforms
      there is something missing. MacOS is very similar to Linux but it takes security a bit more serious (don't hate me
      for that snarky comment) so we need to sign the native libraries <i>libcoolmath_macx64.dylib</i> and
      <i>libcoolmath_macarm64.dylib</i> with a valid developer certificate, else the library cannot be linked against.
      Unfortunatly the vendor I got the lib from did not sign their library, so I had to do it. The process is called
      "notarization" on macOS and you can read more here: <a
        href="https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution">Notarizing
        macOS Software before distribution</a>. If you intend your crate to "just-work" on macOS, make sure your
      libraries are notarized correctly. After that is done, macOS works exactly like Linux.
      <br />
      <br />
      Windows is a bit more complicated. We only have a <i>*.dll</i> but the linker needs a <i>*.lib</i>. Why do we need a
      static library to link against a dynamic one? Windows has the concept of import libraries. They are used to link
      against dynamic libraries. The import library contains the information that is needed to load the dynamic library at
      runtime and itself is not needed at runtime, only at compile time. The import library is usually created by
      the compiler when you compile a dynamic library. But we do not have the source code for the library, so we cannot
      compile it. We need to create the import library ourselves. There are several ways to do that, but I simply used
      tools that are already installed,
      if you have the typical Windows developer tools installed which come with any version of Visual Studio.
    </TextBlock>

    <SubHeader id="create-import-lib">Create the import library</SubHeader>
    <TextBlock>
      I did the following steps to create the import library for the <i>coolmath_winx64.dll</i> and
      <i>coolmath_arm64.dll</i>.

      <ol>
        <li>
          Open a Visual Studio Development Console
        </li>
        <li>
          Dump the exports from the file: dumpbin /EXPORTS coolmath_winx64.dll > coolmath_winx64.exports
        </li>
        <li>
          Remove everything, except the names of the functions you need and save the file as "coolmath_winx64.def"
        </li>
        <li>
          Add the first line to the just created file with the only the word: EXPORT
        </li>
        <li>
          Open the path of the lib.exe tool
          Example: C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC\14.38.33130\bin\Hostarm64\arm64
        </li>
        <li>
          Run the command: (with correct path)
          .\lib.exe /def:C:\path\coolmath_winx64.def /machine:arm64 /out:C:\path\coolmath_winx64.lib
        </li>
      </ol>
      Repeat that for the <i>coolmath_winarm64.dll</i> and you have your import libraries. Add them to the
      <i>vendor/lib</i> directory and you are done. Windows works exactly like Linux and macOS now. The whole project
      looks like this:
    </TextBlock>

    <CodeBlock lang="bash">
coolmath-sys
├── Cargo.toml
├── wrapper.h
├── build.rs
├── src
│   └── lib.rs
└── vendor
    ├── inc
    │   └── coolmath.h
    └── lib
        ├── libcoolmath_linx64.so
        ├── libcoolmath_linarm64.so
        ├── libcoolmath_macx64.dylib
        ├── libcoolmath_macarm64.dylib
        ├── coolmath_winx64.dll
        ├── coolmath_winx64.lib
        ├── coolmath_winarm64.dll
        └── coolmath_winarm64.lib
    </CodeBlock>

    <TextBlock>
      The <i>coolmath-sys</i> crate is now ready to be used as a dependency in other crates. You can publish it to
      crates.io if it contains no proprietary code. In my case I published it to a private instance of Kellnr (obviosly).
    </TextBlock>

    <SubHeader id="crate">The coolmath crate</SubHeader>
    <TextBlock>As we do not want to use the wrapped C code in the <i>coolmath-sys</i> crate directly, but instead provide
      a more convinient and safe crate, we crate a nother crate: <i>cargo new --lib coolmath</i>. We add the
      <i>coolmath-sys</i> crate
      as a dependency in the <i>Cargo.toml</i>.
    </TextBlock>

    <CodeBlock lang="toml"># ... your Cargo.toml
[dependencies]
coolmath-sys = { version = "0.1.0", registry = "kellnr" }
    </CodeBlock>

    <TextBlock>
      We can now use the <i>coolmath-sys</i> crate in our <i>coolmath</i> crate. Usually you want to get rid of all unsafe
      code from the sys-crate by wrapping it in safe Rust in the non-sys crate. As wrapped C code feels a bit clumsy to
      use from Rust, a idiomatic API is added as well. As I want to set the focus on the "build part" of the
      cross-platform crate and not on the safe code wrapper, I leave that to the reader. If you are done with your wrapper
      crate, you can publish it to a registry, too. Now, everyone can use the initial C library in a convinient and safe
      way from Rust. We accomplished our mission.
    </TextBlock>

    <SubHeader id="summary">Summary</SubHeader>
    <TextBlock>
      We created a cross-platform Rust crate that wraps a native C library. We used the typical pattern of a <i>*-sys</i>
      crate and a crate that wraps the sys-crate in a more Rust-like API. The <i>build.rs</i> file we created, deals with
      the different shared libraries and linker options for the different platforms we want to support. Pitfals like
    missing <i>*.lib</i> files or notarization on macOS are handled as well.
    <br />
    <br />
    I hope you had some fun reading the blog post and it is of use for your next cross-platform Rust project.
  </TextBlock>

</BlogPostTemplate></template>
