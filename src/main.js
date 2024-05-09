import { createApp } from 'vue'
import router from './router/index.js'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primeicons/primeicons.css'

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import AutoComplete from 'primevue/autocomplete';
import ToggleButton from 'primevue/togglebutton';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const app = createApp(App);


app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('FloatLabel', FloatLabel);
app.component('AutoComplete', AutoComplete);
app.component('ToggleButton', ToggleButton);
app.component('ProgressSpinner', ProgressSpinner);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.use(ToastService);
app.use(router);
app.use(PrimeVue);
app.mount('#app')