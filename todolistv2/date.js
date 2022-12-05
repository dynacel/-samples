const locale = require('locale')

exports.getLocale = (req, index) => {
    const locales = new locale.Locales(req.headers["accept-language"])
    return locales[index].code
}

exports.full = (req) => {
    const locales = new locale.Locales(req.headers["accept-language"])
    const dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}

exports.weekday = (req) => {
    const locales = new locale.Locales(req.headers["accept-language"])
    const dateOptions = {
        weekday: 'long',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}

exports.year = (req) => {
    const locales = new locale.Locales(req.headers["accept-language"])
    const dateOptions = {
        year: 'numeric',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}