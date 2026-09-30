// $message и $msgbox из Element UI с загрузкой библиотеки при первом вызове
const MESSAGE_TYPES = ['success', 'warning', 'info', 'error'];

function loadMessage() {
    return Promise.all([
        import(/* webpackChunkName: "element-message" */ 'element-ui/lib/message'),
        import(/* webpackChunkName: "element-message" */ 'element-ui/lib/theme-chalk/message.css'),
        import(/* webpackChunkName: "element-message" */ '../utils/element-locale'),
    ]).then(([module]) => module.default);
}

function loadMessageBox() {
    return Promise.all([
        import(/* webpackChunkName: "element-message-box" */ 'element-ui/lib/message-box'),
        import(/* webpackChunkName: "element-message-box" */ 'element-ui/lib/theme-chalk/message-box.css'),
        import(/* webpackChunkName: "element-message-box" */ '../utils/element-locale'),
    ]).then(([module]) => module.default);
}

export default (context, inject) => {
    const message = {};
    MESSAGE_TYPES.forEach((type) => {
        message[type] = (text) => loadMessage().then((Message) => Message[type](text));
    });

    inject('message', message);
    inject('msgbox', (options) => loadMessageBox().then((MessageBox) => MessageBox(options)));
};
