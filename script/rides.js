var mymap = L.map('mapid').setView([51.962239, 7.6259], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(mymap);

var virusIcon = L.icon({
    //Icons erstellt von https://www.flaticon.com/de/autoren/freepik
    iconUrl: '/images/virus.png',
    iconSize: [38, 38]
})

var gemueseIcon = L.icon({
    //Icons erstellt von https://www.flaticon.com/de/autoren/icongeek26
    iconUrl: '/images/gemuese.png',
    iconSize: [38, 38]

})

//get username from cookies
const user = document.cookie
    .split('; ')
    .find(row => row.startsWith('cookie'))
    .split('=')[1];


/**
 * GET rides by username
 */
function getRides() {
	/**
     * POST request to get all rides from username stored in cookie
     */
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/getrides",
        data: { username: user },
        success: (resp) => {
            showRides(resp);
        }
    });
}

/**
 * show rides from user as table and markers on map
 * @param {Object} object 
 */
function showRides(object) {

    //generate table with tabulator
    var table = new Tabulator("#departures", {
        layout: "fitColumns",
        columns: [
            { title: "From", field: "name" },
            { title: "Busnumber", field: "busnumber" },
            { title: "Departure time", field: "date" },
            { title: "Infection risk", field: "risk" }
        ]
    })
    table.setData(object);

    /**
     * iterate all rides from user
     */
    for (var i = 0; i < object.length; i++) {
        if (object[i].risk == 'high') {
            var marker = L.marker([object[i].location[0], object[i].location[1]], { icon: virusIcon });
        }
        else {
            var marker = L.marker([object[i].location[0], object[i].location[1]], { icon: gemueseIcon });
        }
        marker.bindPopup('You took bus number ' + object[i].busnumber + ' from Station "' + object[i].name + '" on Date ' + object[i].date);
        marker.addTo(mymap);
    }
}

getRides();