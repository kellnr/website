<template>
  <div>
    <!-- Hero Start -->
    <section class="bg-home d-flex align-items-center" style="
        background: url('images/saas/home-shape.png' ) center center;
        height: auto;
      " id="home">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center mt-0 mt-md-5 pt-0 pt-md-5">
            <div class="title-heading margin-top-100">
              <h1 class="heading mb-3">Kellnr - The private crate registry</h1>
              <p class="para-desc mx-auto text-muted">
                Kellnr allows you to host private Rust crates on your own hardware.
                Keep full control of your code at any time.
              </p>
              <div class="mt-4 pt-2">
                <router-link to="documentation#installation" class="btn btn-primary">Get For Free <i
                    class="mdi mdi-chevron-right"></i></router-link>
              </div>
            </div>

            <div class="home-dashboard">
              <img src="/images/kellnr/landing.png" alt="" class="img-fluid img-border" />
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

    <!-- Feature overview start -->
    <section class="section bg-light mt-0 mt-md-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <div class="section-title mb-4 pb-2">
              <h4 class="title mb-4">Kellnr runs everywhere</h4>
              <p class="text-muted para-desc mx-auto mb-0">
                Keep you code truly private.
                <span class="text-primary font-weight-bold">Kellnr</span> is easy to setup and supports
                multiple architectures and deployment methods.
              </p>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->

        <div class="row justify-content-center align-middle">
          <div class="d-flex mx-4">
            <vue-feather type="server" class="icons mr-1"></vue-feather>
            Bare Metal
          </div>
          <!--end col-->

          <div class="d-flex mx-4">
            <vue-feather type="box" class="icons mr-1"></vue-feather>
            Docker + Helm
          </div>
          <!--end col-->

          <div class="d-flex mx-4">
            <vue-feather type="cpu" class="icons mr-1"></vue-feather>
            AMD64 + ARM64
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->
    </section>
    <!--end section-->
    <!-- Partners End -->

    <!-- Feature Start -->
    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-md-4 col-12">
            <div class="features">
              <div class="image position-relative d-inline-block">
                <i class="uil uil-box h1 text-primary"></i>
              </div>

              <div class="content mt-4">
                <h5>Private Registry</h5>
                <p class="text-muted mb-0">Host your private Rust crates securely in <span
                    class="text-primary font-weight-bold">Kellnr</span>.</p>
              </div>
            </div>
          </div><!--end col-->

          <div class="col-md-4 col-12 mt-5 mt-sm-0">
            <div class="features">
              <div class="image position-relative d-inline-block">
                <i class="uil uil-document-layout-left h1 text-primary"></i>
              </div>

              <div class="content mt-4">
                <h5>Host Documentation</h5>
                <p class="text-muted mb-0">Automatically generate and display <a
                    href="https://doc.rust-lang.org/rustdoc/index.html">rustdocs</a> for your
                  crates.</p>
              </div>
            </div>
          </div><!--end col-->

          <div class="col-md-4 col-12 mt-5 mt-sm-0">
            <div class="features">
              <div class="image position-relative d-inline-block">
                <i class="uil uil-server-connection h1 text-primary"></i>
              </div>

              <div class="content mt-4">
                <h5>Proxy Crates.io</h5>
                <p class="text-muted mb-0">Transparently proxy and cache <a href="https://crates.io/">crates.io</a>
                  to keep your deployments fast and independent.</p>
              </div>
            </div>
          </div><!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->

      <FeatureBox orientation="left" title="List and search your private crates" checkbox1="Simple to use UI"
        checkbox2="Easy access to crate information" link="documentation" image="images/kellnr/search-light.png">
        <span class="text-primary font-weight-bold">Kellnr</span> makes is easy to find the crates you need.
        With one click
        you find all the information needed to use a crate in your code.
      </FeatureBox>

      <FeatureBox orientation="right" title="Rustdocs beside your crates"
        checkbox1="Auto-generate rustdocs for each crate" checkbox2="Upload of custom rustdocs possible"
        link="documentation#rustdoc" image="images/kellnr/rustdoc-light.png">
        Automatically generate rustdocs with <span class="text-primary font-weight-bold">Kellnr</span> for each
        uploaded crate or upload custom docs from your custom build process.
      </FeatureBox>

      <FeatureBox orientation="left" title="Users and Groups" checkbox1="Fine grained user management"
        checkbox2="Group policies for users and crates" image="images/kellnr/users-light.png">
        Add and remove users and authentication tokens with ease. <span
          class="text-primary font-weight-bold">Kellnr</span>
        makes it easy to control who has access to your crates.
      </FeatureBox>

      <FeatureBox orientation="right" title="Crates.io proxy and cache" checkbox1="Transparently proxy crates.io"
        checkbox2="Cache crates.io to keep your deployments fast" link="documentation#cratesio-proxy"
        image="images/kellnr/cratesio-proxy-light.png">
        <span class="text-primary font-weight-bold">Kellnr</span> transparently proxies and caches crates.io to
        keep your deployments fast and independent.
      </FeatureBox>

      <FeatureBox orientation="left" title="Dark Mode" checkbox1="Switch between light and dark mode"
        checkbox2="Easy on the eyes" image="images/kellnr/dependencies-dark.png">
        Requested by many, <span class="text-primary font-weight-bold">Kellnr</span> comes with light and a dark mode to
        allow you to work in the environment you prefer.
      </FeatureBox>

      <div class="container pb-lg-4 mb-md-5 mb-4 mt-100 mt-60">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <div class="section-title">
              <h4 class="title mb-4">
                Start using Kellnr now
              </h4>
              <p class="text-muted para-desc mx-auto mb-0">
                Use <span class="text-primary font-weight-bold">Kellnr</span> to host your private
                crates and documentation.
              </p>

              <div class="mt-4">
                <router-link to="documentation#installation" class="btn btn-primary mt-2 mr-2">Get Started Now
                </router-link>
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
    <div class="position-relative">
      <div class="shape overflow-hidden text-footer">
        <svg viewBox="0 0 2880 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M720 125L2160 0H2880V250H0V125H720Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
    <!-- Client End -->
  </div>
</template>

<script setup lang="ts">
import FeatureBox from "@/components/landing/FeatureBox.vue";
</script>

<style scoped>
.img-border {
  border: 5px solid #ccc;
  /* Light gray border */
  border-radius: 10px;
  /* Rounded corners */
  padding: 5px;
  /* Space between the border and the image */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Adds a subtle shadow for depth */
}
</style>
