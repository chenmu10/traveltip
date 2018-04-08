const WEATHER_KEY = '56b75833b11b964a909c13b5b3176ec0';


function getWeatherByCoords(coords) {

    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&units=metric&appid=${WEATHER_KEY}`)
        .then(function (weather) {
            // console.log(weather.data);
            let currWeather = {
                dt: weather.data.dt,
                temp: weather.data.main.temp,
                tempMin: weather.data.main.temp_min,
                tempMax: weather.data.main.temp_max,
                humidity: weather.data.main.humidity,
                windSpeed: weather.data.wind.speed,
                windDeg: weather.data.wind.deg,
                cityName: weather.data.name,
                desc: weather.data.weather[0].description,
                icon: `https://openweathermap.org/img/w/${weather.data.weather[0].icon}.png`
            }
           return currWeather;

        })
        .catch(err => {
            console.log('err getWeatherByCoords', err);
        });

}

export default {
    getWeatherByCoords: getWeatherByCoords
}