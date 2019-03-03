// function mapsSearch() {
//     var input = document.getElementById('search-input');
//     var autocomplete = new google.maps.places.Autocomplete(input);
// }

function registerCreate() {
    $('.createTeamForm').on('submit', (event) => {
        event.preventDefault();
        console.log('attempted the post request');
        if (localStorage.getItem('localtoken') === null) {
            alert('Login to make a post!');
            return;
        }
        else {
            console.log('logged in, attempting to post server');
            createTeam();
        }
    });
}
// function generateMap() {
//     var location = { lat: 37.0902, lng: -95.7129 };
//     var map = new google.maps.Map(
//         document.getElementById('map'), {
//             zoom: 4,
//             center: location,
//             streetViewControl: false,
//             mapTypeControl: false
//         });
//     var marker = new google.maps.Marker({ position: location, map: map });

//     var input = document.getElementById('search-input');
//     var autocomplete = new google.maps.places.Autocomplete(input);

//     $('#search-input').on('autocompletechange change', (event) => {
//         console.log($('#search-input').val())
//     })
// }

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7009, lng: -73.9880 },
        zoom: 11
    });
    var input = document.getElementById('search-input');
    

    var autocomplete = new google.maps.places.Autocomplete(input);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
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
    // mapsSearch();
    registerCreate();
    initMap();
}

$(documentReady);