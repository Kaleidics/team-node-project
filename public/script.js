'use strict'
const sport = 'basketball';


// ==================  SIMULATE STATES =====================
//loads different navbars depending if jwt is in local storage
function pseudoState() {
    console.log('using pseudostate');
    console.log('level 1 trigger');
    if (localStorage.getItem('localtoken')) {
        console.log('triggered');
        $('#post-nav').addClass('unhidden');
        $('#pre-nav').addClass('hidden');
    }
}

function logout() {
    $('#logoutBtn').on('click', (event) => {
        console.log('logged out');
        localStorage.removeItem('localtoken');
        localStorage.removeItem('currentUser');
        location.reload();
    })
}
// =========================================================//

// ======== MODAL CONTROLS FOR LOGIN AND SIGNUP ON LANDING PAGE  ========
function toggleOnSignUp() {
    $('#signUpBtn').on('click', function(event) {
        $('#signup-Modal').addClass('unhide');
        $('#login-Modal').removeClass('unhide');
    });
}

function toggleOffSignUp() {
    $('.cSpan').on('click', function(event) {
        $('#signup-Modal').removeClass('unhide');
    });
}

function toggleOnLogin() {
    $('#loginBtn').on('click', function(event) {
        $('#login-Modal').addClass('unhide');
        $('#signup-Modal').removeClass('unhide');
    });
}

function toggleOffLogin() {
    $('.cSpan').on('click', function(event) {
        $('#login-Modal').removeClass('unhide');
    });
}
//===================================================================//

//================== AUTH FORM CLICK EVENT LISTENERS =======================

function submitSignUp() {
    $('#signup-submit').on('submit', (event) => {
        event.preventDefault();
        console.log('clicked');
        SignUp();
    });
}

function submitLogin() {
    $('#login-submit').on('submit', (event) => {
        event.preventDefault();
        console.log('clicked');
        login();
    });
}
//==========================================================//

// =================  AUTH AJAX  ========================

function SignUp() {
    const url = 'http://localhost:8080/api/users/register';

    const username = $('#usernameS').val();
    const password = $('#passwordS').val();

    const signupCreds = {
        username: username,
        password: password
    }

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(signupCreds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('signup triggered');
        //if response success trigger login modal
        if (response.status === 201){
            $('#signup-Modal').removeClass('unhide');
            $('#login-Modal').addClass('unhide');
        }
        //if fail any signup requirements trigger error message
        else {
            return response.json()
            .then(response => {
                console.log(response);
                alert(`${response.location} ${response.message}`);
            })
            .catch(err => console.log(err));
        }
        return response.json();
    })
    .catch(err => console.log(err));
}

function login() {
    const url = 'http://localhost:8080/api/auth/login';

    const username = $('#usernameL').val();
    const password = $('#passwordL').val();

    const loginCreds = {
        username: username,
        password: password
    }

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(loginCreds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log('login success', response);
        const authToken = response.authtoken;
        const userid = response.userid;
        console.log(authToken);
        //store jwt
        localStorage.setItem('localtoken', authToken);
        localStorage.setItem('currentUser', userid);
    })
    .then(response => {
        if (localStorage.getItem('localtoken')){
            $('#login-Modal').removeClass('unhide');
            $('#post-nav').removeClass('hidden');
            $('#pre-nav').addClass('hidden');
            console.log('logged in');
        }
    })
    .catch(err => console.log(err));
}
// =========================================================//

//================== AJAX EVENT LISTENERS  ==================
//For the Create Game view, the button on the form
function registerCreate() {
    $('.createTeamForm').on('submit', (event) => {
        event.preventDefault();
        console.log('attempted the post request');
        if(localStorage.getItem('localtoken') === null) {
            alert('Login to make a post!');
            return;
        }
        else {
            console.log('logged in, attempting to post server');
            createTeam();
        }
    });
}

//Event listener for the Find a Game button on navbar, triggers AJAX request for all posts
function registerFind() {
    $('#findBtn').on('click', (event) => {
        location.reload();
    });
}

// Event listener for the My Profile button on navbar, triggers AJAX request for Posts, you created and Posts, you joined
function registerProfile() {
    $('#profileBtn').on('click', (event) => {
        location.reload();
    })
}

//============================================================//

//==================  TEAM ROUTES AJAX  =========================
//AJAX function to create a team, triggered by form submit on Create a Game view
function createTeam() {
    const url = 'http://localhost:8080/api/teams/';

    const localtoken = localStorage.getItem('localtoken');
    const title = $('#titleCreate').val();
    const membersLimit = $('#playerLimitCreate').val();
    const description = $('#descriptionCreate').val();
    const lat = $('#latCreate').val();
    const long = $('#longCreate').val();

    const newPost = {
        sport: sport,
        title: title,
        membersLimit: membersLimit,
        description: description,
        location: {
            lat: lat,
            long: long 
        }
    }

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log(response);
    })
    .catch(err => console.log(err));
}

//AJAX function to view all posts, trigged by click event on nav button Find a Game
function viewPosts() {
    const url = 'http://localhost:8080/api/teams/';

    return fetch(url)
    .then(res => res.json())
    .then(response => {
        console.log('find triggered');
        console.log(response);
        populatePosts(response);
    })
    .catch(err => console.log(err));
}

//AJAX function to view posts owned by Logged in User, and posts joined by Logged in user, triggered by click event on nav button My Profile
function viewProfile() {
    const base = 'http://localhost:8080/api/teams/';
    const localtoken = localStorage.getItem('localtoken');
    const currentUserId = localStorage.getItem('currentUser');
    const url = base + currentUserId;
    console.log(url);
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log('find profile triggered');
        console.log(response);
        populateProfile(response);
    })
    .catch(err => console.log(err));
}

//AJAX function to view a single post, represented as a modal in the My Profile View, trigged by click event on a single post
function viewSinglePost(postId) {
    const base = 'http://localhost:8080/api/teams/post/';
    const localtoken = localStorage.getItem('localtoken');
    const url = base + postId;
    console.log(url);
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log('find triggered');
        console.log(response);
        modalizePostProfile(response);
    })
    .catch(err => console.log(err));
}

//AJAX function to view a single post, represented as a modal in the Find a Game view, trigged by click event on a single post
function viewSinglePost2(postId) {
    const base = 'http://localhost:8080/api/teams/post/';
    const localtoken = localStorage.getItem('localtoken');
    const url = base + postId;
    console.log(url);
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
    .then(res => res.json())
    .then(response => {
        console.log('find triggered');
        console.log(response);
        modalizePostFind(response);
    })
    .catch(err => console.log(err));
}

//==============================================================//

//==================== POPULATE FIND VIEW =====================
//DOM manipulation that follows AJAX call for User's owned posts
function populateProfile(arr) {
    let items = ``;

    for (let i = 0; i < arr.length; i++) {
        const { title, sport, members, membersLimit, description, _id } = arr[i];
        const { creator, joiners } = arr[i].members;
        const { lat, long } = arr[i].location;

        items = items.concat(`
            <div id="${_id}" class="post-item">
                <div class="post-item-list">
                    <ul>
                        <li><h4>${title}<h4></li>
                        <li>Sport: ${sport}</li>
                        <li>Host: ${creator}</li>
                        <li>Max players: ${membersLimit}</li>
                        <li>Current players: ${creator} ${joiners}</li>
                        <li> Description: <p>${description}</p></li>
                        <li>${lat},${long}</li>
                    </ul>
                </div>
            </div>
        `);
    }
    $('#ownPosts').html(items);
}

//DOM manipulation that follows AJAX call for Join Game view
function populatePosts(arr) {
    let items = ``;

    for (let i = 0; i < arr.length; i++) {
        const { title, sport, membersLimit, description, _id } = arr[i];
        const { creator, joiners } = arr[i].members;
        const { lat, long } = arr[i].location;

        items = items.concat(`
            <div id="${_id}" class="findView post-item">
                    <ul class="post-item-list">
                        <li><h4>${title}<h4></li>
                        <li>Sport: ${sport}</li>
                        <li>Host: ${creator}</li>
                        <li>Max players: ${membersLimit}</li>
                        <li>Current players: ${creator} ${joiners}</li>
                        <li>Description: <p>${description}</p></li>
                        <li>${lat},${long}</li>
                    </ul>
            </div>
        `);
        console.log('before initMap', lat, long, _id);
    }
    $('#view-container').html(items);
}

//Creates a modal onclick in the Profile view for one post
function modalizePostProfile(arr) {
    const { title, sport, members, membersLimit, description, _id } = arr;
    const { creator, joiners } = arr.members;
    const { lat, long } = arr.location;

    $('#post-container').append(`
    <div id="signup-Modal" class="modal unhide">
            <div class="class modal-content">
                <a href="#" class="closeBtn"><span class="cSpan">&times</span></a>
                <div id="${_id}" class="modal-pop">
                <div>
                    <ul class="postUl">
                        <li><h4>${title}<h4></li>
                        <li>Sport: ${sport}</li>
                        <li>Host: ${creator}</li>
                        <li>Max players: ${membersLimit}</li>
                        <li>Current players: ${creator} ${joiners}</li>
                        <li>Description: <p>${description}</p></li>
                        <li>${lat},${long}</li>
                        <div id='map' class="map-style"></div>
                        <li><button class="update">Update</button></li>
                        <li><button class="delete">Delete</button></li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    `)
    var location = { lat: lat, lng: -long };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: location,
            streetViewControl: false,
            mapTypeControl: false
        });
    var marker = new google.maps.Marker({ position: location, map: map });
}

//Creates modal onclick in the Join Games view for one post
function modalizePostFind(arr) {
    const { title, sport, membersLimit, description, _id } = arr;
    const { creator, joiners } = arr.members;
    const { lat, long } = arr.location;

    $('#post-container').append(`
    <div id="signup-Modal" class="modal unhide">
            <div class="class modal-content">
                <a href="#" class="closeBtn"><span class="cSpan">&times</span></a>
                <div id="${_id}">
                <div>
                    <ul class="postUl">
                        <li><h4>${title}<h4></li>
                        <li>Sport: ${sport}</li>
                        <li>Host: ${creator}</li>
                        <li>Max players: ${membersLimit}</li>
                        <li>Current players: ${creator} ${joiners}</li>
                        <li>Description: <p>${description}</p></li>
                        <li>${lat},${long}</li>
                        <div id='map' class="map-style"></div>
                        <li><button class="joinBtn">Join</button></li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    `)
    var location = { lat: lat, lng: -long };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: location,
            streetViewControl: false,
            mapTypeControl: false
        });
    var marker = new google.maps.Marker({ position: location, map: map });
}
//Remove the appended modal from modalizePost functions
function profileCloseBtn() {
    $('#post-container').on('click', '.cSpan', (event) => {
        console.log('clicked profile close');
        $(event.target).closest('#signup-Modal').remove();
    });
}
// =========================================================//

//==================== UPDATE and DELETE =====================

function popPost() {
    $('#ownPosts').on('click', '.post-item', (event) => {
        const singlePost = $(event.target).closest('div.post-item').attr('id');
        viewSinglePost(singlePost);
    });
}

function popPost2() {
    $('#view-container').on('click', '.findView', (event) => {
        console.log('view container');
        const singlePost = $(event.target).closest('div.findView').attr('id');
        console.log(singlePost);
        viewSinglePost2(singlePost);
    });
}

function deleteBtn() {
    $('#post-container').on('click', 'button.delete', (event) => {
        console.log('clicked');
        const singlePost = $(event.target).parents('div.modal-pop').attr('id');
        console.log(singlePost, event.target);
        deletePost(singlePost);
        $(event.target).closest('#signup-Modal').remove();
    });
}

function deletePost(id) {
    const base = 'http://localhost:8080/api/teams/post/';
    const localtoken = localStorage.getItem('localtoken');
    const url = base + id;
    console.log(url);

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        },
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log("Deleted");
            $(`div[id^=${id}]`).remove();
            return;
        }
        throw new Error(response.status);
    })
    .catch(err => {
        console.error(err);
    });
}

function updateBtn() {
    $('#post-container').on('click', 'button.update', (event) => {
        console.log('clicked');
        const singlePost = $(event.target).parents('div.modal-pop').attr('id');
        // console.log(singlePost, event.target);
        generateUpdateForm(singlePost);
        // updatePost(singlePost);
        // $(event.target).closest('#signup-Modal').remove();
    });
}

function registerUpdate() {
    $('#post-container').on('submit', '.updateTeamForm', (event) => {
        event.preventDefault();
        console.log('attempted the put request');
        console.log($(event.target).parents('div.updateId'))
        const singlePost = $(event.target).parents('div.updateId').attr('id');
        callUpdate(singlePost);
    });
}

function callUpdate(id) {

    const localtoken = localStorage.getItem('localtoken');
    const title = $('#titleCreate').val();
    const membersLimit = $('#playerLimitCreate').val();
    const description = $('#descriptionCreate').val();
    const lat = $('#latCreate').val();
    const long = $('#longCreate').val();

    const base = 'http://localhost:8080/api/teams/update/';
    const url = base + id;
    console.log(url);

    const updatePost = {
        sport: sport,
        title: title,
        membersLimit: membersLimit,
        description: description,
        location: {
            lat: lat,
            long: long
        }
    }

    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(updatePost),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localtoken}`
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("updated");
                // $(`div[id^=${}]`).remove();
                return;
            }
            throw new Error(response.status);
        })
        .catch(err => {
            console.error(err);
        });
}

function generateUpdateForm(id) {

    $('#post-container').append(`
    <div id="${id}" class="updateId">
    <div id="signup-Modal" class="modal unhide">
            <div class="class modal-content">
                <a href="#" class="closeBtn"><span class="cSpan">&times</span></a>
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
                        <label for="">Hard coding location until gmaps integration</label>
                        <input id="latCreate" type="number" name="lat" placeholder="lat" id="" step="0.0001" required>
                        <input id="longCreate" type="number" name="long" placeholder="long" id="" step="0.0001" required>
                        <input type="submit" value="Update">
                    </fieldset>
                </form>
            </div>
            </div>
        </div>
    </div>
    `)
}

// function updatePost(team, id) {
//     const base = 'http://localhost:8080/api/teams/post/';
//     const localtoken = localStorage.getItem('localtoken');
//     const url = base + id;
//     console.log(url);

//     fetch(url, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localtoken}`
//         },
//         method: 'PUT',
//         body: JSON.stringify(team)
//         })
//         .then(response => {
//             if (response.ok) {
//                 return;
//             }
//             throw new Error(response.status);
//         })
//         .catch(err => {
//             console.error(err);
//         });
// }
// =========================================================//


//==================== SANDBOX AREA =====================
// function navBtn() {
//     $('#profileBtn').on('click', (event) => {
//         viewProfile();
//         setTimeout(function () {
//             window.location.href = './profile.html';
//         }, 3000)
//     })
// }

//==================== SCROLL CONTROLS =====================

function registerArrow() {
    $(".fas").on("click", () => {
        $("html").animate({
            scrollTop: 2000
        }, 500)
    });
    $(window).on('scroll', () => {
        $('.fas').addClass('hidden');
    });
}

// =========================================================//
// =========================================================//



function documentReady() {
//SIMULATE STATES
    pseudoState();
    logout();
    //SCROLL CONTROLS
    registerArrow();
//MODAL CONTROLS
    toggleOnSignUp();
    toggleOffSignUp();
    toggleOnLogin();
    toggleOffLogin();
//AUTH FORM LISTENERS
    submitSignUp();
    submitLogin();
//MAKE POST FOR CREATE A POST
    registerCreate();
    registerFind();
    registerProfile();
//UPDATE DELETE
    popPost();
    popPost2();
//profile controls
    profileCloseBtn();
    deleteBtn();
    updateBtn();
    registerUpdate();
}

$(documentReady);