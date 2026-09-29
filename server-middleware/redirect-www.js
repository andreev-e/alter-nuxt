// Язык определяется по домену (altertravel.ru / altertravel.pro), а с www nuxt-i18n его не узнаёт,
// поэтому www.altertravel.ru уводим на основной домен
export default function redirectWww(req, res, next) {
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';

    if (host === 'www.altertravel.ru') {
        const proto = req.headers['x-forwarded-proto'] || 'https';
        res.writeHead(301, { Location: `${proto}://altertravel.ru${req.url}` });
        res.end();
    } else {
        next();
    }
}
