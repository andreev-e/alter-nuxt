// Язык по умолчанию определяется доменом (altertravel.ru / altertravel.pro), но выбранный
// в переключателе язык запоминается в cookie и применяется на том же домене без редиректа.
// nuxt-i18n при differentDomains cookie не учитывает, поэтому язык выставляем сами.
export const LOCALE_COOKIE = 'locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readCookie(header, name) {
    const match = (header || '').split(';')
        .map((part) => part.trim().split('='))
        .find(([key]) => key === name);
    return match ? decodeURIComponent(match[1] || '') : null;
}

export function saveLocaleCookie(code) {
    document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function applyLocale(i18n, code) {
    const properties = i18n.locales.find((l) => l.code === code);
    if (!properties || code === i18n.locale) {
        return;
    }
    // Сообщения всех языков уже загружены (lazy выключен), достаточно сменить текущий
    // eslint-disable-next-line no-param-reassign
    i18n.locale = code;
    Object.keys(i18n.localeProperties).forEach((key) => {
        // eslint-disable-next-line no-param-reassign
        i18n.localeProperties[key] = properties[key];
    });
}

export default ({ app, req }) => {
    // Так же, как домен определяет nuxt-i18n
    const host = process.server ? req.headers['x-forwarded-host'] || req.headers.host : window.location.host;
    const domainLocale = app.i18n.locales.find((l) => l.domain === host);
    // Язык домена нужен для абсолютных адресов: canonical остаётся на текущем домене
    app.i18n.domainLocale = domainLocale ? domainLocale.code : app.i18n.defaultLocale;

    const cookie = process.server ? req.headers.cookie : document.cookie;
    const saved = readCookie(cookie, LOCALE_COOKIE);
    if (saved) {
        applyLocale(app.i18n, saved);
    }
};
