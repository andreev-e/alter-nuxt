// Язык переключается на текущем домене: выбор запоминается в cookie (см. plugins/locale.js),
// а у залогиненного пользователя ещё и в профиле.
import { applyLocale, saveLocaleCookie } from './locale';

export default ({ app, $axios }, inject) => {
    // Плагин auth-модуля подключается после пользовательских, поэтому $auth берём в момент вызова
    const auth = () => app.$auth;

    let switching = false;

    async function switchLocale(code, { save = true } = {}) {
        if (switching || code === app.i18n.locale) {
            return;
        }
        switching = true;

        try {
            if (auth().loggedIn && save) {
                // Не сохранился выбор в профиле — язык всё равно переключаем
                await $axios.patch(`/api/user/${auth().user.username}`, { locale: code }).catch(() => {});
            }
            saveLocaleCookie(code);
            applyLocale(app.i18n, code);
            if (auth().loggedIn && save) {
                await auth().fetchUser();
            }
        } finally {
            switching = false;
        }
    }

    function applyUserLocale(user) {
        if (user && ['ru', 'en'].includes(user.locale) && user.locale !== app.i18n.locale) {
            switchLocale(user.locale, { save: false }).catch(() => {});
        }
    }

    inject('switchLocale', switchLocale);

    window.onNuxtReady(() => {
        applyUserLocale(auth().user);
        auth().$storage.watchState('user', applyUserLocale);
    });
};
