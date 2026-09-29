// Язык определяется по домену (altertravel.ru / altertravel.pro), а с www nuxt-i18n его не узнаёт,
// поэтому www.* уводим на основной домен
export default function (req, res, next) {
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';

    if (host.startsWith('www.')) {
        const proto = req.headers['x-forwarded-proto'] || 'https';
        res.writeHead(301, { Location: `${proto}://${host.slice(4)}${req.url}` });
        res.end();
    } else {
        next();
    }
}
