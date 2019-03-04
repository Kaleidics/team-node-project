'use strict';
// function mapsSearch() {
//     var input = document.getElementById('search-input');
//     var autocomplete = new google.maps.places.Autocomplete(input);
// }


//Initial load triggers payload of DOM elements. Calls populateProfile.
function viewProfile() {
    const base = 'http://localhost:8080/api/teams/';
    const localtoken = localStorage.getItem('localtoken');
    const currentUserId = localStorage.getItem('currentUser');
    const url = base + currentUserId;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
        .then(res => res.json())
        .then(response => {
            populateProfile(response);
        })
        .catch(err => console.log(err));
}

//Called by view profile for DOM manipulation.
function populateProfile(arr) {
    let items = ``;

    for (let i = 0; i < arr.length; i++) {
        const { title, sport, members, membersLimit, description, _id, address, rules } = arr[i];
        const { creator, joiners } = arr[i].members;
        const { lat, long } = arr[i].location;

        items = items.concat(`
            <div id="${_id}" class="post-item">
                <div class="post-item-list">
                    <ul>
                        <li class="preTitle"><h3>${title}</h3></li>
                        <li class="preRules">Rules: ${rules}</li>
                        <li class="preMax">Looking for: ${membersLimit} players</li>
                        <li class="preDes">Description: <div>${description}</div></li>
                        <li class="preAdd">Location: <address>${address}</address></li>
                    </ul>
                </div>
            </div>
        `);
    }
    $('#ownPosts').html(items);
}

//AJAX function to view posts owned by Logged in User, and posts joined by Logged in user, triggered by click event on nav button My Profile
function viewProfile() {
    const base = 'http://localhost:8080/api/teams/';
    const localtoken = localStorage.getItem('localtoken');
    const currentUserId = localStorage.getItem('currentUser');
    const url = base + currentUserId;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
        .then(res => res.json())
        .then(response => {
            populateProfile(response);
        })
        .catch(err => console.log(err));
}

//Triggered by clicking a game post on profile page. Start of chain >> ViewSinglePost >> modalizePostProfile >> End.
function popPost() {
    $('#ownPosts').on('click', '.post-item', (event) => {
        const singlePost = $(event.target).closest('div.post-item').attr('id');
        viewSinglePost(singlePost);
        $('body').addClass('preventScroll');
    });
}

//AJAX function to view a single post. ViewSinglePost >> modalizePostProfile >> End.
function viewSinglePost(postId) {
    const base = 'http://localhost:8080/api/teams/post/';
    const localtoken = localStorage.getItem('localtoken');
    const url = base + postId;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
        .then(res => res.json())
        .then(response => {
            modalizePostProfile(response);
        })
        .catch(err => console.log(err));
}

//DOM Manipulation create a Modal. modalizePostProfile >> End.
function modalizePostProfile(arr) {
    const { title, sport, members, membersLimit, description, _id, address, rules } = arr;
    let { creator, joiners } = arr.members;
    const { lat, long } = arr.location;
    creator = creator.username;

    $('#post-container').append(`
    <div id="signup-Modal" class="modal unhide">
            <div class="class modal-content">
                <a href="#" class="closeBtn"><span class="cSpan">Go back</span></a>
                <div id="${_id}" class="modal-pop">
                <div>
                    <ul class="postUl">
                        <li><h3>${title}</h3></li>
                        <li>Host: ${creator}</li>
                        <li>Rules: ${rules}</li>
                        <li>Looking for: ${membersLimit} players</li>
                        <li>Current players: ${creator} ${joiners}</li>
                        <li>Description: <p>${description}</p></li>
                        <li>Location: <address>${address}</address></li>
                        <div id='map' class="map-style"></div>
                        <li class="options-row"><button class="update">Update</button><button class="delete">Delete</button></li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    `)
    var location = { lat: lat, lng: long };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: location,
            streetViewControl: false,
            mapTypeControl: false
        });
    var marker = new google.maps.Marker({ position: location, map: map });
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        console.log('this is mobile');
    }
    else {
        $('.modal-content').niceScroll({
            cursorcolor: "#4285f4",
            cursoropacitymin: 0.8,
            background: "#bbb",
            cursorborder: "0",
            autohidemode: false,
            cursorminheight: 30
        });
    }
   
}


function updateBtn() {
    $('#post-container').on('click', 'button.update', (event) => {
        const singlePost = $(event.target).parents('div.modal-pop').attr('id');
        generateUpdateForm(singlePost);
    });
}


function registerUpdate() {
    $('#post-container').on('submit', '.updateTeamForm', (event) => {
        event.preventDefault();
        const singlePost = $(event.target).parents('div.updateId').attr('id');
        callUpdate(singlePost);
    });
}

function callUpdate(id) {

    const base = 'http://localhost:8080/api/teams/update/';
    const url = base + id;

    const localtoken = localStorage.getItem('localtoken');
    const title = $('#titleCreate').val();
    const membersLimit = $('#playerLimitCreate').val();
    const description = $('#descriptionCreate').val();
    const rules = $('#rulesCreate').val();
    const address = $('#search-input').val();


    const googleQuery = address.replace(/\s/g, '+');
    const geocodeBase = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    const geoKey = '&key=AIzaSyCVE0EVrFMwT7F0tBXuStCz7mpfmrO_Hd4';
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
            }
            return newPost;
        })
        .then(response => {
            return fetch(url, {
                method: 'PUT',
                body: JSON.stringify(response),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localtoken}`
                }
            })
            .then(res => res.json())
            .then(response => {
                    $('.updateSpan').html('Updated. Go back.')
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log('whole thing failed', err));
}

function generateUpdateForm(id) {

    $('#post-container').append(`
    <div id="${id}" class="updateId">
    <div id="signup-Modal" class="modal unhide">
            <div class="class modal-content updateBox">
                <a href="#" class="closeBtn"><span class="cSpan updateSpan">Go back</span></a>
                <div class="modal-pop">
                <form class="updateTeamForm" role="form">
                    <fieldset>
                        <legend>Update this game</legend>
                        <label for="Title">Title</label>
                        <input id="titleCreate" type="text" name="Title" placeholder="Type here" required>
                        <label for="Rules">Rules</label>
                        <select name="Rules" id="rulesCreate">
                            <option value="Half-Court">Half-Court</option>
                            <option value="Full-Court">Full-Court</option>
                        </select>
                        <label for="PlayerLimit">Player Limit</label>
                        <input id="playerLimitCreate" type="number" name="PlayerLimit" min="1" max="99" required>
                        <label for="Description">Give us some details</label>
                        <input id="descriptionCreate" type="text" name="Description" placeholder="Type here" id="create-des" required>
                        <label for="search-input">Search for a court to play at</label>
                        <input id="search-input" type="text" name="search-input">
                        <input class="update" type="submit" value="Update">
                    </fieldset>
                </form>
            </div>
            </div>
        </div>
    </div>
    `)
    var input = document.getElementById('search-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    
}


function deleteBtn() {
    $('#post-container').on('click', 'button.delete', (event) => {
        const singlePost = $(event.target).parents('div.modal-pop').attr('id');
        deletePost(singlePost);
        $(event.target).closest('#signup-Modal').remove();
        $('body').removeClass('preventScroll');
    });
}

function deletePost(id) {
    const base = 'http://localhost:8080/api/teams/post/';
    const localtoken = localStorage.getItem('localtoken');
    const url = base + id;

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        },
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                $(`div[id^=${id}]`).remove();
                return;
            }
            throw new Error(response.status);
        })
        .catch(err => {
            console.error(err);
        });
}

function documentReady() {
    viewProfile();
    popPost();
    updateBtn();
    registerUpdate();
}

$(documentReady);