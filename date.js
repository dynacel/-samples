const locale = require('locale')

exports.getLocale = (req, index) => {
    let locales = new locale.Locales(req.headers["accept-language"])
    return locales[index].code
}

exports.full = (req) => {
    let locales = new locale.Locales(req.headers["accept-language"])
    let dateOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}

exports.weekday = (req) => {
    let locales = new locale.Locales(req.headers["accept-language"])
    let dateOptions = {
        weekday: 'long',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}

exports.year = (req) => {
    let locales = new locale.Locales(req.headers["accept-language"])
    let dateOptions = {
        year: 'numeric',
    }

    return new Date().toLocaleDateString(locales[0].code, dateOptions)
}