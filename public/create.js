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

function documentReady() {
    // mapsSearch();
    registerCreate();
}

$(documentReady);