"use strict";

//event listener for submit button
function registerCreate() {
  $(".createTeamForm").on("submit", event => {
    event.preventDefault();
    if (localStorage.getItem("localtoken") === null) {
      alert("Login to make a post!");
      return;
    } else {
      createTeam();
    }
  });
}

//Creates a new post
function createTeam() {
  const url = "https://immense-brushlands-16839.herokuapp.com/api/teams/";

  const localtoken = localStorage.getItem("localtoken");
  const title = $("#titleCreate").val();
  const membersLimit = $("#playerLimitCreate").val();
  const description = $("#descriptionCreate").val();
  const rules = $("#rulesCreate").val();
  const address = $("#search-input").val();

  const googleQuery = address.replace(/\s/g, "+");
  const geocodeBase =
    "https://maps.googleapis.com/maps/api/geocode/json?address=";
  const geoKey = "&key=AIzaSyCVE0EVrFMwT7F0tBXuStCz7mpfmrO_Hd4";
  const geocodeUrl = geocodeBase + googleQuery + geoKey;

  fetch(geocodeUrl)
    .then(res => res.json())
    .then(response => {
      const { lat, lng } = response.results[0].geometry.location;
      const newPost = {
        sport: sport,
        rules: rules,
        title: title,
        membersLimit: membersLimit,
        description: description,
        address: address,
        location: {
          lat: lat,
          long: lng
        }
      };
      return newPost;
    })
    .then(response => {
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(response),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localtoken}`
        }
      })
        .then(res => res.json())
        .then(response => {
          $(".createLegend").html("Success. See your post in Find Game");
          $(".clear").val("");
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

//Google Maps API generates map
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.7009, lng: -73.988 },
    zoom: 11
  });
  var input = document.getElementById("search-input");

  var autocomplete = new google.maps.places.Autocomplete(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener("place_changed", function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(16);

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  });
}

function documentReady() {
  registerCreate();
  initMap();
}

$(documentReady);
