import {
    GoogleMapsApi
} from './gmap.class.js';

var map;
var gMarker;

function initMap(lat = 32.0917, lng = 34.8850) {

    const gmapApi = new GoogleMapsApi();
    return gmapApi.load().then(() => {
        map = new google.maps.Map(
            document.querySelector('#map'), {
                center: {
                    lat,
                    lng
                },
                zoom: 15,

            })
    });


}

function addMarker(loc, address) {

    gMarker = new google.maps.Marker({
        position: loc,
        map: map,
        title: address
    });
    attachMessage(address);
    setCenter(loc);
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
function attachMessage(address) {
    var infowindow = new google.maps.InfoWindow({
        content: address
    });
    infowindow.open(gMarker.get('map'), gMarker);
    gMarker.addListener('click', function () {
        infowindow.open(gMarker.get('map'), gMarker);
    });
}

function removeMarker() {
    gMarker.setMap(null);

}

function setCenter(loc) {
    map.setCenter(loc);
}



export default {
    initMap,
    addMarker,
    removeMarker,
    setCenter
}