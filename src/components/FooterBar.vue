<template>
  <div>
    <!-- Footer Start -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
            <span class="h3 font-weight-bold text-blue">&lt;'kellnr&gt;</span>
            <p class="mt-4">
              Start hosting private Rust crates with <span class="text-primary font-weight-bold">Kellnr</span>.
              It's free and open source under the MIT license.
            </p>
            <ul class="list-unstyled social-icon social mb-0 mt-4">
              <li class="list-inline-item ml-1">
                <router-link to="contact" class="rounded">
                  <vue-feather type="mail" class="fea icon-sm fea-social"></vue-feather>
                </router-link>
              </li>
              <li class="list-inline-item ml-1">
                <a href="/rss.xml" class="rounded">
                  <vue-feather type="rss" class="fea icon-sm fea-social"></vue-feather>
                </a>
              </li>
              <li class="list-inline-item ml-1">
                <a href="https://github.com/kellnr/kellnr" class="rounded">
                  <vue-feather type="github" class="fea icon-sm fea-social"></vue-feather>
                </a>
              </li>
            </ul>
            <!--end icon-->
          </div>
          <!--end col-->

          <div class="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
            <h5 class="text-light footer-head">Useful Links</h5>
            <ul class="list-unstyled footer-list mt-4">
              <li>
                <router-link to="documentation" class="text-foot"><i class="mdi mdi-chevron-right mr-1"></i>
                  Documentation
                </router-link>
              </li>
              <li>
                <router-link to="changelog" class="text-foot"><i class="mdi mdi-chevron-right mr-1"></i>
                  Changelog
                </router-link>
              </li>
              <li>
                <router-link to="blog" class="text-foot"><i class="mdi mdi-chevron-right mr-1"></i> Blog
                </router-link>
              </li>
            </ul>
          </div>
          <!--end col-->

          <div class="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
            <h5 class="text-light footer-head">Contact</h5>
            <p class="mt-4">Have a question or found a bug?</p>
            <div class="row col-lg-12">
              <router-link to="contact">
                <div class="btn btn-primary btn-block">
                  Contact us
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!--end container-->
    </footer>
    <!--end footer-->
    <footer class="footer footer-bar">
      <div class="container text-center">
        <div class="row align-items-center">
          <div class="col-sm-6">
            <div class="text-sm-left">
              <p class="mb-0">
                © 2021 - {{ new Date().getFullYear() }} by the Kellnr open source organisation.
              </p>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!--end container-->
    </footer>
    <!--end footer-->
    <!-- Back to top -->
    <a href="javascript: void(0);" class="btn btn-icon btn-primary back-to-top" id="back-to-top"
      onclick="window.scrollTo({ top: 0, behavior: 'smooth' });">
      <vue-feather type="arrow-up" class="icons"></vue-feather>
    </a>
    <!-- Back to top -->
  </div>
</template>

<script setup lang="ts">

</script>

