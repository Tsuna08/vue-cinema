import "./style.scss";

import { createPinia } from "pinia";
import { createApp } from "vue";

import router from "@/app/routers";

import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
