// Element UI нужен только формам, поэтому подключаем его в них, а не глобально на всех страницах
import Row from 'element-ui/lib/row';
import Col from 'element-ui/lib/col';
import Input from 'element-ui/lib/input';
import Select from 'element-ui/lib/select';
import Option from 'element-ui/lib/option';
import 'element-ui/lib/theme-chalk/row.css';
import 'element-ui/lib/theme-chalk/col.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/select.css';
import 'element-ui/lib/theme-chalk/option.css';
import './element-locale';

export default {
    ElRow: Row,
    ElCol: Col,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option,
};
