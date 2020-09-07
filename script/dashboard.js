var mymap = L.map('mapid').setView([51.962239, 7.6259], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(mymap);

function getNextBusstops(apiKey, location) {
	$.ajax({
		url: 'https://transit.hereapi.com/v8/stations?apiKey=' + apiKey + '&in=' + location,
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		success: (response) => {
			console.log(response);
		},
		error: function () { alert('Failed!!!'); }
	});
}

function getNextDepartures(location) {
	$.ajax({
		url: 'https://transit.hereapi.com/v8/departures?apiKey=' + apiKey + '&in=' + location,
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		success: (response) => {
			mymap.setView(location, 16);
			setLocationMarker(location);
			setBusstops(response);
			console.log(response);
		},
		error: function () { alert('Failed!'); }
	});
}

/**
 * @function setLocationMarker
 * @desc set marker for location
 * @returns void
 */
function setLocationMarker(coordinates) {
	var marker = L.marker(coordinates).addTo(mymap);
	marker.bindPopup('You are here!');
}

/**
 * @function setBusstops
 * @desc set markers for nearby busstops
 * @returns void
 */
function setBusstops(object) {
	for (let i = 0; i < object.boards.length; i++) {
		var busstop = L.marker(object.boards[i].place.location, {icon: busIcon}).addTo(mymap);
		generateDeparturesTable(object.boards[i].departures, busstop, object.boards[i].place.name);
	}
}

function generateDeparturesTable(object, busstop, name) {

	var div = document.createElement('div');

	var head = document.createElement('h4');
	head.innerHTML = name.split('|')[0];
	div.appendChild(head);

	var table = document.createElement('table');
	div.appendChild(table);
	var tr = document.createElement('tr');
	table.appendChild(tr);

	var busnumber = document.createElement('th');
	busnumber.innerHTML = 'Busnumber';
	var direction = document.createElement('th');
	direction.innerHTML = 'Direction';
	var time = document.createElement('th');
	time.innerHTML = 'Departure time';

	tr.appendChild(busnumber);
	tr.appendChild(direction);
	tr.appendChild(time);

	for (let i = 0; i < object.length; i++) {
		var tr1 = document.createElement('tr');
		table.appendChild(tr1)
		var tdnumber = document.createElement('td');
		tr1.appendChild(tdnumber);
		var tddirection = document.createElement('td');
		tr1.appendChild(tddirection);
		var tdtime = document.createElement('td');
		tr1.appendChild(tdtime);

		tdnumber.innerHTML = object[i].transport.name;
		tddirection.innerHTML = object[i].transport.headsign.split('|')[0];

		tdtime.innerHTML = object[i].time.split('T')[1].split('+')[0];

		var date = object[i].time.split('T')[0]
	}

	busstop.bindPopup(div);
}

/**
 * @function getLocation
 * @desc request geolocation of the browser
 * @returns array [latitude, longitude]
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function (position) {
			var coordinates = [position.coords.latitude, position.coords.longitude];
			getNextDepartures(coordinates);
			return coordinates;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


//get api Key from cookies
const apiKey = document.cookie
  .split('; ')
  .find(row => row.startsWith('apiKey'))
  .split('=')[1];

var busIcon = L.icon({
	// Icon from https://www.flaticon.com/de/autoren/freepik
	iconUrl: '/images/bahnhof.png',
	iconSize: [38, 38]
})


getLocation();