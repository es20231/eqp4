import { createApp } from "vue";
import App from "./App.vue";
// Vue Router
import router from "./router";
// Vuex
import store from "./store";
// Css Presets
import "@/theme/_reset.scss";
import "@/theme/_global.scss";
// Ant for Vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
// Remix Icons
import "remixicon/fonts/remixicon.css";

const app = createApp(App);

app.use(Antd);
app.use(store);
app.use(router);

app.mount("#app");
