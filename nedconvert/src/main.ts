import { createApp } from 'vue'
import './style.css'
import Antd from 'ant-design-vue';
import App from './App.vue'
import {router} from '@/router.ts';
import {createPinia} from 'pinia';
import 'ant-design-vue/dist/reset.css';

const pinia = createPinia();
const app = createApp(App);

app.use(Antd);
app.use(router);
app.use(pinia)


app.mount('#app');
