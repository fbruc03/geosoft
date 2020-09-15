var mymap = L.map('mapid').setView([51.962239, 7.6259], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(mymap);

function getAllUsers() {
    //POST request to /getrides
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/getusers",
		success: (resp) => {
            console.log(resp);
            addUserRides(resp);
		}
	  });
}

function addUserRides(object) {

    var tableData = [];

    for (let i = 0; i < object.length; i++) {
        for (let j = 0; j < object[i].takenBusses.length; j++) {
            var username = object[i].username;
            var risk = object[i].takenBusses[j].danger;
            var location = [object[i].takenBusses[j].location[0],object[i].takenBusses[j].location[1]];
            var busnumber = object[i].takenBusses[j].busnumber;
            var name = object[i].takenBusses[j].name;
            var date = object[i].takenBusses[j].date;
            var marker = L.marker(location);
            marker.bindPopup('User: '+username + '<br>Busnumber: '+busnumber + '<br>Date: '+date);
            marker.addTo(mymap);
            var data = {"User": username, "Busnumber": busnumber, "Departuretime": date, "Infectionrisk": risk};
            tableData.push(data);
        }
    }

    var table = new Tabulator("#departures", {
        height: 205,
        layout: "fitColumns",
        columns: [
            { title: "User", field: "User"},
            { title: "Busnumber", field: "Busnumber" },
            { title: "Departure time", field: "Departuretime" },
            { title: "Infection risk", field: "Infectionrisk"}
        ],
		rowClick: function (e, row) {

            //Get data from row 
			var busnumber = row.getData().Busnumber;
            var date = row.getData().Departuretime;
            date = date.split('T')[0];
            //Update objects
            //!!!!!TODO!!!!!
		}
    })

    console.log(tableData);
    table.setData(tableData);
}

getAllUsers();