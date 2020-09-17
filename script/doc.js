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

/**
 * Set markers with risk as icon on map
 */
function setMarkers() {
    /**
    * GET request for all rides in db
    */
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/rides",
        success: (resp) => {
            // iterate all rides
            for (let i = 0; i < resp.length; i++) {
                // low risk
                if (resp[i].risk == "low") {
                    //use virus icon as marker
                    var marker = L.marker([resp[i].location[0], resp[i].location[1]], { icon: gemueseIcon });
                    marker.bindPopup('Busnumber: ' + resp[i].busnumber + '<br>From: ' + resp[i].name + '<br>At: ' + resp[i].date)
                    marker.addTo(mymap);
                }
                //high risk
                if (resp[i].risk == "high") {
                    // use virus icon as marker
                    var marker = L.marker([resp[i].location[0], resp[i].location[1]], { icon: virusIcon });
                    marker.bindPopup('Busnumber: ' + resp[i].busnumber + '<br>From: ' + resp[i].name + '<br>At: ' + resp[i].date)
                    marker.addTo(mymap)
                }
            }
        }
    });
}
/**
 * GET request for all users in db
 */
function getAllUsers() {
    //GET request to /getusers
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getusers",
        success: (resp) => {
            // all users as object
            addUserRides(resp);
        }
    });
}

/**
 * Generate table with click events and get ride information
 * @param {object} object All users
 */
function addUserRides(object) {

    //generate table with tabulator
    var table = new Tabulator("#rides", {
        layout: "fitColumns",
        columns: [
            { title: "User", field: "user" },
            { title: "Busnumber", field: "busnumber" },
            { title: "Direction", field: "direction" },
            { title: "Departure time", field: "departuretime" },
            { title: "Risk", field: "risk" },
        ],
        //Click event on a row
        rowClick: function (e, row) {

            //extract data from a clicked row
            var busnumber = row.getData().busnumber;
            var user = row.getData().user;
            var direction = row.getData().direction;
            var date = row.getData().departuretime;
            var risk = row.getData().risk;

            var r = confirm("Want to set the risk for this ride to 'high'?");

            if (r) {
                /**
                 * POST request to set high risk
                 */
                $.ajax({
                    type: "POST",
                    data: { busnumber: busnumber, date: date },
                    url: "http://localhost:3000/updaterisk",
                    success: (resp) => {
                        //reload page to see new results
                        location.reload();
                    }
                });
            }
        }
    })

    // iterate all users
    for (let i = 0; i < object.length; i++) {
        //iterate all ride ids from user
        for (let j = 0; j < object[i].ride.length; j++) {

            var rideId = object[i].ride[j];

            /**
             * POST request to get information about the ride
             */
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
                    //add object to tabulator table
                    table.addData(data);
                }
            });
        }
    }
}

/**
 * generate form for user and date input
 */
function generateForm() {
    /**
     * GET request for all users in db
     */
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getusers",
        success: (resp) => {
            //array for all usernames
            var usernames = [];
            //iterate all users
            for (let i = 0; i < resp.length; i++) {
                var username = resp[i].username;
                //push username to username array
                usernames.push(username);
            }
            generateDropdown(usernames);
        }
    });
}

/**
 * 
 * @param {String} array all usernames
 */
function generateDropdown(array) {

    var div = document.getElementById('users');

    //Create and append form
    var form = document.createElement("form");
    form.action = "/setriskbydate";
    form.method = "POST";
    div.appendChild(form);

    //Create and append select label
    var selectLabel = document.createElement("label");
    selectLabel.for = "username";
    selectLabel.innerHTML = "Select a user: ";
    form.appendChild(selectLabel);

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.name = "username"
    selectList.id = "username";
    form.appendChild(selectList);

    //Create and append the options
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.name = array[i];
        option.id = array[i];
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
    }

    //Create and append from label
    var fromLabel = document.createElement("label");
    fromLabel.for = "from";
    fromLabel.innerHTML = "From (e.g '2020-09-21'): ";
    form.appendChild(fromLabel);

    //Create and append from input
    var fromInput = document.createElement("input");
    fromInput.id = "from";
    fromInput.type = "text";
    fromInput.name = "from";
    form.appendChild(fromInput);

    //Create and append to label
    var toLabel = document.createElement("label");
    toLabel.for = "to";
    toLabel.innerHTML = "To (e.g '2020-09-21'): ";
    form.appendChild(toLabel);

    //Create and append from input
    var toInput = document.createElement("input");
    toInput.id = "to";
    toInput.type = "text";
    toInput.name = "to";
    form.appendChild(toInput);

    //Create and append submit button
    var submitButton = document.createElement('input');
    submitButton.type = "submit";
    submitButton.value = "Submit";
    form.appendChild(submitButton);
}

generateForm();
setMarkers();
getAllUsers();