import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Button, Form, Field, CellGroup, Tab, Tabs, List, PullRefresh, NavBar, Toast } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);

// 注册Vant组件
app.use(Button);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Tab);
app.use(Tabs);
app.use(List);
app.use(PullRefresh);
app.use(NavBar);
app.use(Toast);

app.use(router);
app.mount('#app'); 