var mymap = L.map('mapid').setView([51.962239, 7.6259], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(mymap);

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
			console.log(location)
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
		var busstop = L.marker(object.boards[i].place.location, { icon: busIcon }).addTo(mymap);
		generateDeparturesTable(object.boards[i], busstop, i);
	}
}

/**
 * @function getLocation
 * @desc request geolocation of the browser
 * @returns array [latitude, longitude]
 */
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
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

//get username from cookies
const user = document.cookie
	.split('; ')
	.find(row => row.startsWith('cookie'))
	.split('=')[1];

var busIcon = L.icon({
	// Icon from https://www.flaticon.com/de/autoren/freepik
	iconUrl: '/images/bahnhof.png',
	iconSize: [38, 38]
})

function generateDeparturesTable(object, busstop, i) {


	busstop.bindPopup(object.place.name);

	var table = new Tabulator("#table"+(i+1), {
		layout: "fitColumns",
		columns: [
			{ title: "From", field: "name"},
			{ title: "Busnumber", field: "busnumber" },
			{ title: "Direction", field: "direction" },
			{ title: "Departure time", field: "departuretime" },
			{ title: "Location", field: "location"},
		],
		rowClick: function (e, row) {

			var r = confirm("Want to add this ride?");
			if(r) {
				//Get data from row 
			var busnumber = row.getData().busnumber;
			var lat = parseFloat(row.getData().location.split(',')[0]);
			var lng = parseFloat(row.getData().location.split(',')[1]);
			var location = [lat, lng];
			var date = row.getData().departuretime;
			var name = row.getData().name;
			//Create object
			var newRide = {
				"busnumber": busnumber,
				"location": location,
				"date": date,
				"name": name
			}
			sendRideData(newRide);
			alert('Added!');
			}
		}
	});

	var tabledata = [];

	for (let i = 0; i < object.departures.length; i++) {
		var departure = {
			busnumber: object.departures[i].transport.name,
			direction: object.departures[i].transport.headsign,
			departuretime: object.departures[i].time.split('+')[0],
			location: object.place.location.lat + "," + object.place.location.lng,
			name: object.place.name
		}
		tabledata.push(departure);
	}
	table.setData(tabledata);
}

function sendRideData(object) {
	//POST request to /addride with newRide as Object
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/addride",
		data: object,
		success: console.log("Added ride")
	  });
}

function checkRisk() {
	console.log(user);
	//request alle fahrten ids
	//POST request to /getrides with newRide as Object
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/getrides",
		data: {username: user},
		success: (resp) => {
			checkRides(resp);
		}
	  });

	//request risk für alle fahrten
}

function checkRides(object) {
	console.log(object);
	var risk = false;
	for (let i = 0; i < object.length; i++) {
		if(object[i].risk == "high") {
			risk = true;
		}
	}
	if(risk == true) {
		alert("This risk of one of your rides is marked as 'high'. Please take a look at 'My Rides' for more information");
	}
}

checkRisk();

getLocation();
