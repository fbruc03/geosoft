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
            addUserRides(resp);
        }
    });
}

function addUserRides(object) {

    var table = new Tabulator("#rides", {
        height: 205,
        layout: "fitColumns",
        columns: [
            { title: "User", field: "user" },
            { title: "Busnumber", field: "busnumber" },
            { title: "Direction", field: "direction" },
            { title: "Departure time", field: "departuretime" },
            { title: "Risk", field: "risk" },
        ],
        rowClick: function (e, row) {
            //!!!!!TODO!!!!!
        }
    })

    for (let i = 0; i < object.length; i++) {
        for (let j = 0; j < object[i].ride.length; j++) {

            var rideId = object[i].ride[j];

            //POST request to /getrideinfo
            $.ajax({
                type: "POST",
                data: { id: rideId },
                url: "http://localhost:3000/getrideinfo",
                success: (resp) => {
                    var data = {
                        user: object[i].username,
                        busnumber: resp.busnumber,
                        direction: resp.name,
                        departuretime: resp.date,
                        risk: resp.risk
                    }
                    table.addData(data);
                }
            });
        }
    }
}

getAllUsers();