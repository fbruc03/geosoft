# geosoft

To start the app using the Node Package Manager enter $ npm install && npm start in the directory.
To start the app using docker enter $ docker-compose up

## How to use this ap?

### User instructions:
For the login you need to register yourself through the form which you can access by pressing the button 'register' on the top right. Here you will have to select 'user'. This will grant you access to different parts of the app after login.

Please select a username (with a minimum of 6 and a maximum of 64 characters) and a password (with a minimum of 6 and a maximum of 64 characters) for yourself. You'll also need to confirm your password and click the register button to complete the process.
Now you will be redirected to the login screen. To login you also need an api key for the here api. You can get this by creating an account on the linked page below the api key field or [here](https://developer.here.com/documentation/authentication/dev_guide/topics/api-key-credentials.html).

As you log in you can see a map and will be asked if the browser may use your location, please answer this with yes to be able to use the site. You'll see a map on your dashboard which will display your current location aswell as the closest five busstops in your area. Below the map is an interactive table which displays next five rides of every busstop and information about those rides. You can add a ride which you have taken by simply clicking on it in the table. This ride will then be stored within the database if you confirm the alert.

You can now access your rides via the navigation bar at the top. If you navigate to My Rides, you'll see a map of your selected rides with further information within the popup as you click the specific marker on the map. Below the map is a table which contains all of your selected rides and information about the infection risk on those rides.

If one of your rides is marked as a 'high risk ride' you will get notified when open up your dashboard.

### Doc instructions:
For the login you need to register yourself through the form which you can access by pressing the button 'register' on the top right. Here you will have to select 'doc'. This will grant you access to different parts of the app after login.

Please select a username (with a minimum of 6 and a maximum of 64 characters) and a password (with a minimum of 6 and a maximum of 64 characters) for yourself. You'll also need to confirm your password and click the register button to complete the process.
Now you will be redirected to the login screen. To login you also need an api key for the here api. You can get this by creating an account on the linked page below the api key field or here.

As you log in you can see a map with all rides stored in the database. You can see those rides below the map in a table too. If you want to mark a single ride as a 'high risk ride' click the table row and confirm the alert. If you want to mark every ride a user has taken between two specific dates use the form. Select the user from the dropdown and provide the two dates e.g. 2020-09-21.

## USED NPM PACKAGES
- body-parser
- bootstrap
- cookie-parser
- cors
- express
- jquery
- leaflet
- mongoose
- tabulator-tables
- chai
- mocha
- sinon

## TESTING
For testing type 'npm test' in the directory.

#### Authors
Malte Tiemann & Frederick Bruch
