let input = document.querySelector(".in")
let arrow = document.querySelector(".arrow")
let locateMe = document.querySelector(".locate-me")
let weatherButton = document.querySelector(".weather")
let weatherConditionSection = document.querySelector(".weather-condition")

// ////////////////////////////////////////////////////////////////////////////////
let countryDetails = document.querySelector(".details")
let countryName = document.querySelector(".country")
let cityNameReq = document.querySelector(".city")
let native = document.querySelector(".native")
let population = document.querySelector(".population")
let region = document.querySelector(".region")
let subRegion = document.querySelector(".sub-region")
let statesNumber = document.querySelector(".states-number")
let currency = document.querySelector(".currency")
let language = document.querySelector(".language")
let timeZone = document.querySelector(".time-zone")
let flag = document.querySelector(".flag")
let capital = document.querySelector(".capital")
let close = document.querySelector(".close")

// ////////////////////////////////////////////////////////////////////////////////


input.onfocus = () => {
    input.value = ""
    countryDetails.style.display = "none"
}


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let map = L.map('map').setView([31.50172950, 34.44624480], 13);
let tileLayer = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
let attribution = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

let firstTile = L.tileLayer(tileLayer, attribution)

firstTile.addTo(map)

let marker = L.marker([31.50172950, 34.44624480]).addTo(map);
console.log(timeZone)



// Locate me  API

function getLocation() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("locate-me")) {
            input.value = ""
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let lat = position.coords.latitude
                    let long = position.coords.longitude
                    locatinByLatLong(lat, long)

                })

            }

        }

    })


}
getLocation()


function locatinByLatLong(lat, long) {

    fetch(`https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`)

        .then(respon => respon.json())

        .then(data => {


            countryName.innerHTML = data.countryName

            cityNameReq.innerHTML = data.city

            fullData()

            map.flyTo([data.latitude, data.longitude], 13)

            if (marker !== null) {
                map.removeLayer(marker)
            }

            marker = L.marker([data.latitude, data.longitude])

            marker.addTo(map)

            getWeather(data.city)


        })
}



// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getWeather(cityName) {
    try {
        await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c1714e58688f40e7838114346242710&q=${cityName}&days=3&aqi=no&alerts=no`)
            .then(response => response.json())
            .then(data => {
                let response = data
                console.log(data)
                weatherData(response)
            })
    } catch (error) {
        console.log("error")
    }
}

let locationInfo = document.querySelector(".location-info")
let info = document.querySelector(".info")


function weatherData(response) {

    for (i = 0; i < response.forecast.forecastday.length - 1; i++) {

        document.querySelectorAll(".day-date")[0].textContent = "Today"
        document.querySelectorAll(".day-date")[1].textContent = "Tomorrow"
        document.querySelectorAll(".icon")[i].src = response.forecast.forecastday[i].day.condition.icon
        document.querySelectorAll(".temp")[i].innerHTML = `${response.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>c / ${response.forecast.forecastday[i].day.mintemp_c}<sup>o</sup>c`

    }



}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// countries

async function countryOnly() {
    try {
        let fetchData = await fetch("./All About Countries.json")
        let allData = await fetchData.json()
        responseData = allData
        console.log(responseData)
        showCountryData(input.value)
        fullData()

    } catch {
        error => alert(error)
    }
}


function showCountryData(val) {

    responseData.forEach((data) => {

        if (data.name.common.toLowerCase() == val || data.name.common == val) {
            let lat = data.capitalInfo.latlng[0]
            let long = data.capitalInfo.latlng[1]
            locatinByLatLong(lat, long)
            getWeather(data.capital)

        }
    })
}






async function countryCity() {
    try {
        let fetchData = await fetch("./countries+cities.json")
        let allData = await fetchData.json()
        responseData = allData
        console.log(responseData)
        showCityData()
        fullData()
    } catch {
        error => alert(error)
    }
}

function showCityData() {
    let word = input.value.split(", ")

    responseData.forEach((data) => {
        if (data.name.toLowerCase() == word[1] || data.name == word[1]) {
            cityNameReq.innerHTML = data.name
            cityNameReq.innerHTML = word[0]
            data.cities.forEach((city) => {
                if (city.name.toLowerCase() == word[0] || city.name == word[0]) {
                    let lat = city.latitude
                    let long = city.longitude
                    locatinByLatLong(lat, long)
                    getWeather(city)

                }
            })
        }
    })
}

async function fullData() {
    try {
        let fetchData = await fetch("./All Countries.json")
        let allData = await fetchData.json()
        responseData = allData
        console.log(responseData)
        allCData()
    } catch {
        error => alert(error)
    }
}

console.log(timeZone)

function allCData() {
    responseData.forEach((data) => {
        if (countryName.innerHTML == data.name) {
            native.innerHTML = `Native Name :${data.nativeName}`
            population.innerHTML = `Population : ${data.population.toLocaleString()}`
            region.innerHTML = `Region : ${data.region}`
            subRegion.innerHTML = `Sub Region : ${data.subregion}`
            currency.innerHTML = `currency : ${data.currencies[0].name}`
            language.innerHTML = `Language : ${data.languages.map((e) => e.name)}`
            timeZone.innerHTML = `Time Zone : ${data.timezones[0]}`
            capital.innerHTML = `Capital: ${data.capital}`
            flag.src = data.flags.svg
        }
    })

}


// /////////////////////////////////////////////////////////////



// Arrow Button

arrow.addEventListener("click", function () {

    if (input.value == "") {
        alert("Input is Empty")

    } else if (input.value.match(/\b([A-Za-z\s\-]+)\b/g)) {

        // let word = input.value.split(",")

        if (input.value.split("").includes(",")) {
            input.value = input.value.replace(/,\s*/g, ", ")
            countryCity()

        } else {
            countryOnly()
        }



    }
})



// Enter Press 

document.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        if (input.value == "") {
            alert("Input is Empty")
        } else if (input.value.match(/\b([A-Za-z\s\-]+)\b/g)) {

            // let word = input.value.split(",")

            if (input.value.split("").includes(",")) {
                input.value = input.value.replace(/,\s*/g, ", ")
                countryCity()


            } else {
                countryOnly()
            }

        }
    }
})


document.addEventListener("click", function (e) {
    if (e.target.classList.contains("close")) {
        countryDetails.style.display = "none"
    }
    if (e.target.classList.contains("country-details")) {
        countryDetails.style.display = "flex"
    }
})

console.log(countryDetails)
// //////////////////////////////////////////////////////////////////////////