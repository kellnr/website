<script setup lang="ts">
import {ref} from "vue";
import {Checkbox} from "vue-recaptcha/head";
import {FREE_LICENSE_URL} from "@/Backend";

const license_name = ref("")
const license_email = ref("")
const license_ordered = ref(false)
const captcha_response = ref("")
const invalid_request = ref(false)


type PostData = {
  Name: string,
  EMail: string,
  Captcha: string,
}

async function submit() {
  const postData: PostData = {
    Name: license_name.value,
    EMail: license_email.value,
    Captcha: captcha_response.value,
  };

  if (!isValidRequest(postData)) {
    console.log("Invalid request. Not all required fields filled out.")
    invalid_request.value = true;
    return;
  }

  if (captcha_response.value === "") {
    console.log("Invalid request. No captcha response.")
    invalid_request.value = true;
    return;
  }

  const rawResponse = await fetch(FREE_LICENSE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData),
    mode: 'no-cors'
  })
  license_ordered.value = true;

  if (rawResponse.ok) {
    console.log("successfully requested a free community license")
  } else {
    const content = await rawResponse.text();
    console.log(content);
  }
}

function isValidRequest(postData: PostData): boolean {
  return !(!postData.EMail || !postData.Name);
}
</script>

<template>
  <div v-if="license_ordered === false" class="container">
    <div class="row">
      <div class="col-lg-auto col-md-auto mt-2 pt-2">
        <div class="card shadow rounded border-0">
          <div class="card-body py-5">
            <h4 class="card-title">Free Community License</h4>
            <div class="custom-form mt-4">
              <div id="message"></div>
              <form name="contact-form" id="contact-form">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label
                      >Name <span class="text-danger">*</span></label
                      >
                      <div class="position-relative">
                        <vue-feather type="user" class="fea icon-sm icons"></vue-feather>
                        <input
                            v-model="license_name"
                            type="text"
                            class="form-control pl-5"
                            placeholder="Your name"
                        />
                      </div>
                    </div>
                  </div>
                  <!--end col-->
                  <div class="col-md-6">
                    <div class="form-group">
                      <label
                      >Email
                        <span class="text-danger">*</span></label
                      >
                      <div class="position-relative">
                        <vue-feather type="mail" class="fea icon-sm icons"></vue-feather>
                        <input
                            v-model="license_email"
                            type="email"
                            class="form-control pl-5"
                            placeholder="Your email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!--end row-->
                <div class="row">
                  <div class="col-sm-12 text-center">
                    <input
                        type="button"
                        class="submitBnt btn btn-primary btn-block"
                        value="Get free license"
                        @click.prevent="submit"
                    />
                  </div>
                  <!--end col-->
                </div>
                <div v-if="invalid_request" class="row mt-3">
                  <div class="col-sm-12 text-center">
                    Failed to send: <b>Name</b>, <b>Email</b> and <b>Captcha</b> are required.
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-sm-12">
                    <div>{{ captcha_response ? 'Verified' : 'Please click the checkbox' }}</div>
                    <Checkbox v-model="captcha_response"/>
                  </div>
                </div>

                <!--end row-->
              </form>
              <!--end form-->
            </div>
            <!--end custom-form-->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container">
    <div class="row">
      <div class="col-lg-auto col-md-auto mt-2 pt-2">
        <div class="card shadow rounded border-0">
          <div class="card-body py-5">
            <h4 class="card-title">Free Community License</h4>
            <span class="text-muted">Thank you for using Kellnr. Your free Community license was send to you in an email.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end col-->
</template>

<style scoped>

</style>
