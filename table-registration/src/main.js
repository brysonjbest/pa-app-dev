import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

//Common component imports
import Button from "primevue/button";
import Card from "primevue/card";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import DialogService from "primevue/dialogservice";
import DynamicDialog from "primevue/dynamicdialog";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";

//Form Component imports
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(DialogService);

//Component Initialization
app.component("Button", Button);
app.component("Card", Card);
app.component("ConfirmDialog", ConfirmDialog);
app.component("DynamicDialog", DynamicDialog);
app.component("Sidebar", Sidebar);
app.component("Menu", Menu);

app.component("Dropdown", Dropdown);
app.component("Checkbox", Checkbox);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputText", InputText);

app.mount("#app");
