// Форматирование дат через Intl вместо moment: moment с локалями добавлял в бандл ~60 КБ
const FORMATS = {
    // «11 марта 2016 г.»
    date: { day: 'numeric', month: 'long', year: 'numeric' },
    // «пятница, 11 марта 2016 г., 10:53»
    dateTime: {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    },
};

function parse(value) {
    // «2016-03-11 10:53:39» без часового пояса Safari не разбирает,
    // а с «T» это локальное время во всех браузерах
    return new Date(typeof value === 'string' ? value.replace(' ', 'T') : value);
}

export default ({ app }, inject) => {
    inject('formatDate', (value, format = 'date') => {
        const date = parse(value);
        if (!value || Number.isNaN(date.getTime())) {
            return '';
        }
        return new Intl.DateTimeFormat(app.i18n.localeProperties.iso, FORMATS[format]).format(date);
    });
};
