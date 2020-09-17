### geosoft ###

To start the app using the Node Package Manager type "npm install" and AFTER that "npm start" in the directory.
To start the app using docker...

Here are some instructions on how to navigate through and use the app properly.

For the login you need to register yourself through the form which you can access by pressing the button 'register' on the top right. Here you will have to select for yourself if you are a user or a doctor using the site. This will grant you access to different parts of the app after login. 
        
Please select a username (with a minimum of 6 and a maximum of 64 characters) and a password (with a minimum of 6 and a maximum of 64 characters) for yourself. You'll also need to confirm your password and click the register button to complete the process.

Now you will be redirected to the login screen, where you can login. To login you also need an api key for the here api. You can get this by creating an account on the linked page below the api key field or [here](https://developer.here.com/documentation/authentication/dev_guide/topics/api-key-credentials.html).
        
As you log in you can see a map and will be asked if the browser may use your location, please answer this with yes to be able to use the site. If you're logged in as a user you'll see a map on your dashboard which will display your current location aswell as the closest five busstops in your area. Below the map is an interactive table which displays next five rides of every busstop and information about those rides. You can add a ride which you have taken by simply clicking on it in the table. This ride will then be stored within the database if you confirm the alert.

You can now access your rides via the navigation bar at the top. If you navigate to My Rides, you'll see a map of your selected rides with further information within the popup as you click the specific marker on the map. Below the map is a table which contains all of your selected rides and information about the infection risk on those rides.

# USED NPM PACKAGES #
- body-parser
- bootstrap
- cookie-parser
- cors
- express
- jquery
- leaflet
- mongoose
- tabulator-tables
