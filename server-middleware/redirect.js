// eslint-disable-next-line func-names
export default function (req, res, next) {
    const redirects = [
        {
            from: '/routes.php',
            to: '/route',
        },
        {
            from: '/catalog/&stat=time',
            to: '/latest',
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

    if (to) {
        res.writeHead(301, { Location: to });
        res.end();
    } else {
        next();
    }
}
