import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { 
  Button, 
  Form, 
  Field, 
  CellGroup, 
  Tab, 
  Tabs, 
  List, 
  PullRefresh, 
  NavBar, 
  Toast,
  Tabbar,
  TabbarItem,
  Uploader,
  Cell,
  Dialog
} from 'vant';
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
app.use(Tabbar);
app.use(TabbarItem);
app.use(Uploader);
app.use(Cell);
app.use(Dialog);

app.use(router);
app.mount('#app'); 