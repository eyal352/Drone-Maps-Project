# The Drone Strike Project
==================================

The goal of the Drone Strike Project is to build a webapp to help visualize U.S. military drone strikes across Africa and the Middle East.

This is achieved through the use of data from the [dronestre.am API](http://dronestre.am), which provides detailed JSON objects of drone strikes, when they occurred, their Lattitude and Longitude coordinates, how many reported deaths, as well as other relevant information. In addition to this, relevent articles from [Wikipedia](https://www.wikipedia.org) and [The Bureau Investigates](https://www.thebureauinvestigates.com/) have been linked to each strike to provide context and additional information.

The Drone Strike Project can be viewed live via [this](http://www.eyalchistik.com/Drone-Maps-Project/) link. Alternatively, you can clone or download the repository and open the index.html file. You will need a working internet connection for all the components to work.

Use the search bar to input a year between 2006 and 2016, or the country of Somalia, Yemen, or Pakistan to get a better sense of where, when, and how often U.S. drone strikes occur. By clicking on either a list item, or a bomb image, an information window will display with information on that particular drone strike.

Technologies used include Javascript and jQuery for handling data from the droneStrea.am API and appending it to the map through the Google Maps API. The Javascript framework Knockout.js is used for separating the code into the MVVM design pattern. Finally, Bootstrap and the Jasny Bootstrap frameworks are used to style the site and allow for a responsive design.

This project is completely open source and you can see and contribute to the code here on [Github](https://github.com/eyal352/Drone-Maps-Project).
