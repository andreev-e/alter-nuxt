// Языки живут на разных доменах (altertravel.ru / altertravel.pro) с отдельными сессиями,
// поэтому залогиненного пользователя переносим через одноразовую ссылку бэкенда.
export default ({ app, $axios, $auth }, inject) => {
    let switching = false;

    function localeDomain(code) {
        return (app.i18n.locales.find((l) => l.code === code) || {}).domain;
    }

    async function switchLocale(code, { save = true } = {}) {
        if (switching || code === app.i18n.locale) {
            return;
        }
        switching = true;

        try {
            if ($auth.loggedIn && save) {
                // Не сохранился выбор в профиле — язык всё равно переключаем
                await $axios.patch(`/api/user/${$auth.user.username}`, { locale: code }).catch(() => {});
            }

            // Локально (localhost) доменов нет — просто меняем язык интерфейса
            if (window.location.hostname !== localeDomain(app.i18n.locale)) {
                app.i18n.locale = code;
                if ($auth.loggedIn) {
                    await $auth.fetchUser();
                }
                switching = false;
                return;
            }

            // Пути на обоих доменах совпадают, меняется только домен
            const origin = `${window.location.protocol}//${localeDomain(code)}`;
            const path = app.router.currentRoute.fullPath;
            if ($auth.loggedIn) {
                const { data } = await $axios.post('/api/login/transfer', { redirect: path });
                window.location.href = origin + data.url;
            } else {
                window.location.href = origin + path;
            }
        } catch (e) {
            switching = false;
            throw e;
        }
    }

    function applyUserLocale(user) {
        if (user && ['ru', 'en'].includes(user.locale) && user.locale !== app.i18n.locale) {
            switchLocale(user.locale, { save: false }).catch(() => {});
        }
    }

    inject('switchLocale', switchLocale);

    window.onNuxtReady(() => {
        applyUserLocale($auth.user);
        $auth.$storage.watchState('user', applyUserLocale);
    });
};
