const { json } = require('express');
const express = require('express')
const bodyParser = require("body-parser")
const https = require('https')

const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/weather", (req, res) => {
    const query = "Syracuse"
    const units = "imperial"
    const apiKey = "785a62937b800b57ccd2d94178cc30e0"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const description = weatherData.weather[0].description
            const city = weatherData.name
            const weatherImg = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
            res.write(`<h1>The temperature in ${city} is ${temp} F with ${description}.</h1>`);
            res.write(`<img src="${weatherImg}"></img>`);
            res.send();
        })
    })
});

app.use(bodyParser.urlencoded({ extended: true }))


app.post('/', (req, res) => {
    const query = req.body.cityName
    const units = "imperial"
    const apiKey = "785a62937b800b57ccd2d94178cc30e0"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const description = weatherData.weather[0].description
            const city = weatherData.name
            const desImg = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
            res.write(`<h1>The temperature in ${city} is ${temp} F and ${description}.</h1>`);
            res.write(`<img src="${desImg}"></img>`);
            res.send();
        })
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))