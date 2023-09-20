<script setup lang="ts">
</script>

<template>
  <div>
    <!-- Hero Start -->
    <section class="bg-half bg-light d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title">Contact Us</h4>
              <div class="page-next">
                <nav aria-label="breadcrumb" class="d-inline-block">
                  <ul class="breadcrumb bg-white rounded shadow mb-0">
                    <li class="breadcrumb-item">
                      <router-link to="/">Kellnr</router-link>
                    </li>
                    <li class="breadcrumb-item"><a href="#">Contact</a></li>
                  </ul>
                </nav>
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

    <!-- Start Contact -->
    <section class="section pb-0">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-4 mt-4 mt-sm-0 pt-2 pt-sm-0">
            <div class="card border-0 text-center features feature-clean">
              <div class="icons text-primary text-center mx-auto">
                <i class="uil uil-envelope d-block rounded h3 mb-0"></i>
              </div>
              <div class="content mt-3">
                <h5 class="font-weight-bold">Contact</h5>
                <p class="text-muted">
                  Contact us on Github.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-10">
        <div class="row align-items-center">
          <div class="col-lg-5 col-md-6 pt-sm-0 order-2 order-md-1">
            <div class="card shadow rounded border-0">
              <h4 class="card-title ml-1">Get In Touch!</h4>
              <div class="row ml-1 mr-1">
                <p class="text-muted">
                  Create an issue on Github if you have a question, found a bug or want to request a feature.
                </p>
              </div>
              <div class="row justify-content-center">
                <div class="col-md-6 text-center mb-3">
                  <a href="https://github.com/kellnr/kellnr/issues">
                    <input type="button" class="submitBnt btn btn-primary btn-block" value="Go to Github Issues" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-md-6 order-1 order-md-2 pl-1 pr-1">
            <div class="card border-0">
              <div class="card-body p-0">
                <img src="/images/contact.svg" class="img-fluid" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
