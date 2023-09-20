<script setup lang="ts">

import HeroCard from "@/components/blog/HeroCard.vue";
</script>

<template>
  <div>
    <section class="bg-half bg-light d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title"> Blog </h4>
              <div class="page-next">
                <nav aria-label="breadcrumb" class="d-inline-block">
                  <ul class="breadcrumb bg-white rounded shadow mb-0">
                    <li class="breadcrumb-item">
                      <router-link to="/">Kellnr</router-link>
                    </li>
                    <li class="breadcrumb-item">
                      <router-link to="blog">Blog</router-link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="position-relative">
      <div class="shape overflow-hidden text-white">
        <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="row">
          <HeroCard title="Kellnr goes Open-Source" date="20th September, 2023"
            link="open-source" img="images/kellnr/blog/kellnr-logo.png"></HeroCard>

          <HeroCard title="Leveraging the Type System for Domain Modeling in Rust" date="15th June, 2023"
            link="domain-modeling" img="images/kellnr/blog/ferris.png"></HeroCard>

          <HeroCard title="Kellnr 3.0.0 Release" link="release3" img="images/kellnr/blog/kellnr-logo.png"
            date="29th May, 2023"></HeroCard>

          <HeroCard title="Rust Supply Chain Security" link="rust-supply-chain-security"
            img="images/kellnr/blog/ferris.png" date="10th April, 2023"></HeroCard>

          <HeroCard title="Asynchronous Closures in Rust - Box and Pin" date="24. July, 2022"
            link="async-closures-in-rust" img="images/kellnr/blog/ferris.png"></HeroCard>

          <HeroCard title="WebAssembly Compiler - Building a Runtime" date="24. June, 2021" part="4/4"
            link="wasm-compiler4" img="images/kellnr/blog/WebAssembly_Logo.svg"></HeroCard>

          <HeroCard title="WebAssembly Compiler - Building a Compiler" date="05. June, 2021" part="3/4"
            link="wasm-compiler3" img="images/kellnr/blog/WebAssembly_Logo.svg"></HeroCard>

          <HeroCard title="WebAssembly Compiler - Building a Parser" date="30. June, 2021" part="2/4"
            link="wasm-compiler2" img="images/kellnr/blog/WebAssembly_Logo.svg"></HeroCard>

          <HeroCard title="WebAssembly Compiler - Text format and AST" date="24. June, 2021" part="1/4"
            link="wasm-compiler1" img="images/kellnr/blog/WebAssembly_Logo.svg"></HeroCard>

          <HeroCard title="Improve Rust compile times with sccache" date="15. April, 2021" link="compile-times-sccache"
            img="images/kellnr/blog/ferris.png"></HeroCard>


          <div class="col-12">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Previous">Prev</a>
              </li>
              <li class="page-item active"><a class="page-link" href="javascript:void(0)">1</a></li>
              <li class="page-item"><a class="page-link" href="javascript:void(0)" aria-label="Next">Next</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
