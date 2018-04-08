const MAPS_KEY = 'AIzaSyBFG1Mi1Yy3Mjlpt2wVx_9GKuVh42O6kHk';

// returns a promise with .coords property
function getCurrPosition() {

    return new Promise((resolve, reject) => {
        // if service takes too long, return default loc instead
        setTimeout(() => {
            resolve({
                coords: {
                    latitude: 32.087888,
                    longitude: 34.803204
                }
            })
        }, 2000)
        // asks user for permission
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function getCoordsByAddress(address) {

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAPS_KEY}`)
        .then(pos => {
            // console.log('getPositionByAddress: '+ JSON.stringify(pos));
             let coords = pos.data.results[0].geometry.location;
         
            return coords;
        })
        .catch(err => {
            console.log('err getCoordsByAddress', err);
        })
}

function getAddressByCoords(coords) {

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coords.lat},${coords.lng}&key=${MAPS_KEY}`)
        .then(function (pos) {
            let address = pos.data.results[0].formatted_address;
            console.log('address is: ' + address);
            return address;
        })
        .catch(err => {
            console.log('err getAddressByCoords', err);
           
        })

}


export default {
    getCoordsByAddress,
    getAddressByCoords,
    getCurrPosition
}