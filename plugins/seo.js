// SEO-разметка: абсолютные URL, Open Graph, JSON-LD.
// Абсолютные адреса строятся из домена локали,
// поэтому canonical тестовых копий ведёт на основной сайт.
// Протокол фиксированный: за прокси nuxt-i18n может определить его как http.
const DESCRIPTION_LENGTH = 160;

export default ({ app }, inject) => {
    function origin(code = app.i18n.locale) {
        const locale = app.i18n.locales.find((l) => l.code === code) || {};
        return `https://${locale.domain}`;
    }

    function url(path, code) {
        return /^https?:\/\//.test(path) ? path : `${origin(code)}${path}`;
    }

    // Адрес страницы без служебных параметров, кроме номера страницы пагинации
    function pagePath(currentRoute = app.router.currentRoute) {
        const page = parseInt(currentRoute.query.p, 10);
        return page > 1 ? `${currentRoute.path}?p=${page}` : currentRoute.path;
    }

    function truncate(text, length = DESCRIPTION_LENGTH) {
        const clean = String(text || '').replace(/\s+/g, ' ').trim();
        if (clean.length <= length) {
            return clean;
        }
        const cut = clean.lastIndexOf(' ', length - 1);
        return `${clean.slice(0, cut > 0 ? cut : length - 1)}…`;
    }

    // head() для страницы: title, description, Open Graph, noindex и JSON-LD
    function head({
        title, description, image, type = 'website', noindex = false, jsonLd = [],
    } = {}) {
        const meta = [];
        if (description) {
            const content = truncate(description);
            meta.push(
                { hid: 'description', name: 'description', content },
                { hid: 'og:description', property: 'og:description', content },
            );
        }
        if (title) {
            meta.push({ hid: 'og:title', property: 'og:title', content: title });
        }
        meta.push({ hid: 'og:type', property: 'og:type', content: type });
        if (image) {
            meta.push(
                { hid: 'og:image', property: 'og:image', content: url(image) },
                { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
            );
        }
        if (noindex) {
            meta.push({ hid: 'robots', name: 'robots', content: 'noindex, follow' });
        }

        return {
            title,
            meta,
            script: [].concat(jsonLd).filter(Boolean).map((json, index) => ({
                hid: `ld-json-${index}`,
                type: 'application/ld+json',
                json: { '@context': 'https://schema.org', ...json },
            })),
        };
    }

    inject('seo', {
        origin, url, pagePath, truncate, head,
    });
};
