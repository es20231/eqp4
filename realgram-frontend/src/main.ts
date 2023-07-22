import { createApp } from "vue";
import App from "./App.vue";
// Vue Router
import router from "./router";
// Vuex
import store from "./store";
// Ant for Vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);

app.use(Antd);
app.use(store);
app.use(router);

app.mount("#app");
