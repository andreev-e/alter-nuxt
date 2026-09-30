// robots.txt и sitemap.xml. Поисковики принимают карту сайта только с того же домена,
// поэтому файл, который генерирует бэкенд, отдаём с основного домена.
const API_URL = process.env.API_URL || 'https://api.altertravel.ru';

const HOST = 'altertravel.ru';

function robots(host) {
    // Тестовые и прочие копии сайта не индексируем
    if (host !== HOST) {
        return 'User-agent: *\nDisallow: /\n';
    }

    return [
        'User-agent: *',
        'Disallow: /secure',
        'Disallow: /moderation',
        'Disallow: /login',
        'Disallow: /register',
        'Disallow: /api/',
        '',
        'User-agent: Yandex',
        'Disallow: /secure',
        'Disallow: /moderation',
        'Disallow: /login',
        'Disallow: /register',
        'Disallow: /api/',
        'Clean-Param: stat&d&social_login&social_error&redirect',
        '',
        `Sitemap: https://${host}/sitemap.xml`,
        '',
    ].join('\n');
}

export default async function seoFiles(req, res, next) {
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(':')[0];
    const path = req.url.split('?')[0];

    if (path === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(robots(host));
        return;
    }

    if (path === '/sitemap.xml' && host === HOST) {
        try {
            const response = await fetch(`${API_URL}/sitemap.xml`);
            if (!response.ok) {
                throw new Error(`Sitemap responded with ${response.status}`);
            }
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.end(await response.text());
        } catch (e) {
            res.statusCode = 502;
            res.end();
        }
        return;
    }

    next();
}
