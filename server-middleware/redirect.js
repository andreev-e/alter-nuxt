export default function (req, res, next) {
    function urlSlug(s, opt) {
    // eslint-disable-next-line no-param-reassign
        s = String(s);
        // eslint-disable-next-line no-param-reassign
        opt = Object(opt);

        const defaults = {
            delimiter: '-',
            limit: undefined,
            lowercase: true,
            replacements: {},
            transliterate: true,
        };

        // Merge options
        // eslint-disable-next-line no-restricted-syntax
        for (const k in defaults) {
            // eslint-disable-next-line no-prototype-builtins
            if (!opt.hasOwnProperty(k)) {
                opt[k] = defaults[k];
            }
        }

        const charMap = {
            // Russian
            А: 'A',
            Б: 'B',
            В: 'V',
            Г: 'G',
            Д: 'D',
            Е: 'E',
            Ё: 'Yo',
            Ж: 'Zh',
            З: 'Z',
            И: 'I',
            Й: 'J',
            К: 'K',
            Л: 'L',
            М: 'M',
            Н: 'N',
            О: 'O',
            П: 'P',
            Р: 'R',
            С: 'S',
            Т: 'T',
            У: 'U',
            Ф: 'F',
            Х: 'H',
            Ц: 'C',
            Ч: 'Ch',
            Ш: 'Sh',
            Щ: 'Sh',
            Ъ: '',
            Ы: 'Y',
            Ь: '',
            Э: 'E',
            Ю: 'Yu',
            Я: 'Ya',
            а: 'a',
            б: 'b',
            в: 'v',
            г: 'g',
            д: 'd',
            е: 'e',
            ё: 'yo',
            ж: 'zh',
            з: 'z',
            и: 'i',
            й: 'y',
            к: 'k',
            л: 'l',
            м: 'm',
            н: 'n',
            о: 'o',
            п: 'p',
            р: 'r',
            с: 's',
            т: 't',
            у: 'u',
            ф: 'f',
            х: 'h',
            ц: 'c',
            ч: 'ch',
            ш: 'sh',
            щ: 'sh',
            ъ: '',
            ы: 'y',
            ь: '',
            э: 'e',
            ю: 'yu',
            я: 'ya',

            // Ukrainian
            Є: 'Ye',
            І: 'I',
            Ї: 'Yi',
            Ґ: 'G',
            є: 'ye',
            і: 'i',
            ї: 'yi',
            ґ: 'g',

            // Czech
            Č: 'C',
            Ď: 'D',
            Ě: 'E',
            Ň: 'N',
            Ř: 'R',
            Ť: 'T',
            Ů: 'U',
            ď: 'd',
            ě: 'e',
            ň: 'n',
            ř: 'r',
            ť: 't',
            ů: 'u',

            // Polish
            Ą: 'A',
            Ć: 'C',
            Ę: 'e',
            Ł: 'L',
            Ń: 'N',
            Ó: 'o',
            Ś: 'S',
            Ź: 'Z',
            Ż: 'Z',
            ą: 'a',
            ć: 'c',
            ę: 'e',
            ł: 'l',
            ń: 'n',
            ó: 'o',
            ś: 's',
            ź: 'z',
            ż: 'z',

            // Latvian
            Ā: 'A',
            Ē: 'E',
            Ģ: 'G',
            Ī: 'i',
            Ķ: 'k',
            Ļ: 'L',
            Ņ: 'N',
            Š: 'S',
            Ū: 'u',
            Ž: 'Z',
            ā: 'a',
            č: 'c',
            ē: 'e',
            ģ: 'g',
            ī: 'i',
            ķ: 'k',
            ļ: 'l',
            ņ: 'n',
            š: 's',
            ū: 'u',
            ž: 'z',
        };

        // Make custom replacements
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const k in opt.replacements) {
            // eslint-disable-next-line no-param-reassign
            s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
        }

        // Transliterate characters to ASCII
        if (opt.transliterate) {
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const k in charMap) {
                // eslint-disable-next-line no-param-reassign
                s = s.replace(RegExp(k, 'g'), charMap[k]);
            }
        }

        // Replace non-alphanumeric characters with our delimiter
        const alnum = RegExp('[^a-z0-9]+', 'ig');
        // eslint-disable-next-line no-param-reassign
        s = s.replace(alnum, opt.delimiter);

        // Remove duplicate delimiters
        // eslint-disable-next-line no-param-reassign
        s = s.replace(RegExp(`[${opt.delimiter}]{2,}`, 'g'), opt.delimiter);

        // Truncate slug to max. characters
        // eslint-disable-next-line no-param-reassign
        s = s.substring(0, opt.limit);

        // Remove delimiter from ends
        // eslint-disable-next-line no-param-reassign
        s = s.replace(RegExp(`(^${opt.delimiter}|${opt.delimiter}$)`, 'g'), '');

        return opt.lowercase ? s.toLowerCase() : s;
    }

    function startsWithCapital(word) {
        return word.charAt(0) === word.charAt(0).toUpperCase();
    }

    function catalogTo(redirect) {
        let { location } = redirect;
        if (location) {
            location = location.split(',');
            if (location.length > 1) {
                location = location.slice(0, 2);
                location.forEach((chunk, key) => { location[key] = urlSlug(chunk); });
                return `/region/${location.join('/')}`;
            }
            if (startsWithCapital(location[0])) {
                return `/region/${urlSlug(location[0])}`;
            }
            return `/tag/${urlSlug(redirect[0])}`;
        }
        return `/region/${urlSlug(redirect.location)}/${redirect.category}`;
    }

    const redirects = [
        {
            from: '/routes.php',
            to: '/route',
        },
        {
            from: '/news.php',
            to: '/',
        },
        {
            from: '/register_altertravel.php',
            to: '/register',
        },
        {
            from: '/secure.php',
            to: '/secure',
        },
        {
            from: '/catalog/&stat=time',
            to: '/latest',
        },
        {
            from: '/catalog',
            to: '/',
        },
        {
            from: '/users.php',
            to: '/user',
        },
    ];

    let { to } = redirects.find((r) => r.from === req.url) ?? {};

    if (!to && req.url.includes('/view.php?id=')) {
        to = req.url.replace('/view.php?id=', '/poi/');
    }

    if (!to && req.url.includes('/view_route.php?id=')) {
        to = req.url.replace('/view_route.php?id=', '/route/');
    }

    if (!to && req.url.includes('/show_user.php?name=')) {
        to = req.url.replace('/show_user.php?name=', '/user/');
    }

    if (!to && req.url.includes('/catalog/')) {
        const path = decodeURI(req.url.replace('/catalog/', '')).split('/');
        to = catalogTo({
            location: path[0],
            category: path[1],
        });
    }

    if (to) {
        res.writeHead(301, { Location: to });
        res.end();
    } else {
        next();
    }
}
