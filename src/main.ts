import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VueFeather from "vue-feather";

import "./assets/css/materialdesignicons.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/base.css";
import "highlight.js/styles/github.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component(VueFeather.name ?? "VueFeather", VueFeather);
app.mount("#app");
