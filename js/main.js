import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherService from './services/weather.service.js'

var gCurrCoords = {};
var gCurrAddress;
var gMarkerExist = false;

window.onload = () => {
    mapService.initMap()
        .then(() => {

            // get values from query url
            let lat = +getParameterByName('lat');
            let lng = +getParameterByName('lng');

            let queryExist = (lat !== 0 && lng !== 0);

            if (!queryExist) {
                setCurrPos();
            } else {
                setAddressByCoords({
                    lat,
                    lng
                });
            }

        })
        .catch(err => {
            console.log('err initMap', err);
        })
}

// get coords from browser and show address
// can happen on init / on btn click
function setCurrPos() {
    locService.getCurrPosition()
        .then(pos => {
            console.log('User position is: ', pos.coords);
            gCurrCoords.lat = pos.coords.latitude;
            gCurrCoords.lng = pos.coords.longitude;
            setAddressByCoords(gCurrCoords);
        })
        .catch(err => {
            console.log('err getPosition', err);
        })
}


function setAddressByCoords(coords) {
    locService.getAddressByCoords(coords)
        .then(address => {
                renderLocation(coords, address);

        })
        .catch(err => {
           
            console.log('err getAddress', err);
        })
}

// get address string from search input and show location
// activated on search click
function setSearchedPos() {
    let address = document.querySelector('.search-input').value;
    if (!address) return;
    document.querySelector('.status-text').innerText = 'Searching..';
    locService.getCoordsByAddress(address)
        .then(function (coords) {
            // get the full address
            locService.getAddressByCoords(coords)
                .then(address => {
                    renderLocation(coords, address);

                })
                .catch(err => {
                    console.log('err getAddress', err);
                })
        })
        .catch(err => {
            document.querySelector('.status-text').innerText = 'Couldn\'t find this address.';
            console.log('err getCoords', err);
        })

}

function renderLocation(coords, address) {
    if (coords.lat === undefined) {
        console.log('no coords');
        return;
    } else {
        document.querySelector('.status-text').innerText = '';
        coordsToMap(coords, address);
        renderAddress(address);
        renderLink();
        renderWeather(coords);
    }


}


function coordsToMap(coords, address) {
    gCurrCoords.lat = coords.lat;
    gCurrCoords.lng = coords.lng;

    if (gMarkerExist) mapService.removeMarker();
    mapService.addMarker(coords, address);


    gMarkerExist = true;

}

function renderWeather(coords) {
    weatherService.getWeatherByCoords(coords)
        .then(function (currWeather) {

            currWeather.temp = Math.round(currWeather.temp);
            currWeather.dt = dateConverter(currWeather.dt);

            document.querySelector('.weather').innerHTML =
                `
                <p>City: ${currWeather.cityName}</p>
                <p>${currWeather.dt}</p>
                    <p class="weather-desc"> <img class="weather-icon" src="${currWeather.icon}"/> ${currWeather.desc}, ${currWeather.temp}°C</p>
                    <p>Temperature: from ${currWeather.tempMin}°C to ${currWeather.tempMax}°C</p>
                    <p>Humidity: ${currWeather.humidity}%</p>
                    <p>Wind: ${currWeather.windSpeed}mph,  ${currWeather.windDeg}°</p>
                `;

        })
        .catch(err => {
            console.log('err getWeatherByCoords', err);
        });

}


document.querySelector('.btn-curr-loc').addEventListener('click', setCurrPos);
document.querySelector('.logo-link').addEventListener('click', (ev) => {
    window.location = getUrlWithoutQuery();

})
document.querySelector('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    setSearchedPos();
})

document.querySelector('.btn-copy-url').addEventListener('click', (ev) => {
    let elToCopy = document.querySelector('.url-input');
    copyToClipboard(elToCopy);
})

function renderLink() {
    let urlStr = getUrlWithoutQuery();

    urlStr += `?lat=${gCurrCoords.lat}&lng=${gCurrCoords.lng}`;

    document.querySelector('.url-input').value = urlStr;
    document.querySelector('.btn-copy-url').innerText = 'Copy Link';
}

function getUrlWithoutQuery() {
    let urlStr = window.location.href;

    // if url contains query string - remove it
    let querySymbolIdx = urlStr.indexOf('?');
    if (querySymbolIdx !== -1) urlStr = urlStr.substring(0, querySymbolIdx);

    return urlStr;
}


function renderAddress(address) {
    document.querySelector('.address').innerText = address;
    document.querySelector('.geo').innerText = gCurrCoords.lat + ', ' + gCurrCoords.lng;

}


// get url string from input and copy it
function copyToClipboard(elToCopy) {
    var copyObj = elToCopy;
    copyObj.select();
    document.execCommand("Copy");
    console.log('Copied to clipboard: ' + elToCopy.value);
    document.querySelector(".btn-copy-url").innerText = 'Copied!';

}



// get value from url query
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function dateConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var day = a.getDate();

    var date = day + ' ' + month + ', ' + year;
    return date;
}