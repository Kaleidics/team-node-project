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
        location.href = './index.html'
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
    .catch(err => {
        console.log(err);
        alert('Username or password do not match.')
    });
}
// =========================================================//

//================== AJAX EVENT LISTENERS  ==================

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
    const rules = $('#rulesCreate').val();
    const address = $('#search-input').val();
    console.log('attempted new post', address);


    const googleQuery = address.replace(/\s/g, '+');
    console.log(googleQuery);
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
        .then(response =>{
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(response),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localtoken}`
                }
            })
                .then(res => res.json())
                .then(response => {
                    console.log(response);
                    $('.createLegend').html('Success. See your post in Find Game');
                })
                .catch(err => console.log(err));
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



//Remove the appended modal from modalizePost functions -- CHANGED TO MULTI PURPOSE CLOSE BTN NEEDS REFACTOR
function profileCloseBtn() {
    $('#post-container').on('click', '.cSpan', (event) => {
        console.log('clicked profile close');
        $(event.target).closest('#signup-Modal').remove();
        $('body').removeClass('preventScroll');
    });
}
// =========================================================//

//==================== UPDATE and DELETE =====================

function popPost2() {
    $('#view-container').on('click', '.findView', (event) => {
        console.log('view container');
        const singlePost = $(event.target).closest('div.findView').attr('id');
        console.log(singlePost);
        $('body').addClass('preventScroll');
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
        $('body').removeClass('preventScroll');
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



//==================== SCROLL CONTROLS =====================

// function registerArrow() {
//     $(".fas").on("click", () => {
//         $("html").animate({
//             scrollTop: 2000
//         }, 500)
//     });
//     $(window).on('scroll', () => {
//         $('.fas').addClass('hidden');
//     });
// }


//Spaghetti to control navbar responsiveness
function mobileNav() {
    $('.content').on('click', (event) => {
        $('.content').toggleClass('change');
        $('.mDelta').toggle('mobileHide');
        $('.nav').toggleClass('heightMobile');
        $('.navbar li').toggleClass('overlaySpacing');
       
    });

    $('#loginBtn, #signUpBtn').on('click', (event) => {
        if($('.content').hasClass('change')){
            $('.content').toggleClass('change');
            $('.mDelta').toggle('mobileHide');
            $('.nav').removeClass('heightMobile');
            $('.navbar li').toggleClass('overlaySpacing');
        }
    })

    $(window).on('resize', function () {
        var width = $(window).width();
        if (width > 1024) {
            console.log(width);
            $('.mDelta').show();
        }

        if (width < 1024 && !($('.content').hasClass('change'))) {
            console.log(width);
            $('.mDelta').hide();
        }
    });
}


function documentReady() {
//SIMULATE STATES
    pseudoState();
    logout();
    //SCROLL CONTROLS
//MODAL CONTROLS
    toggleOnSignUp();
    toggleOffSignUp();
    toggleOnLogin();
    toggleOffLogin();
//AUTH FORM LISTENERS
    submitSignUp();
    submitLogin();
//MAKE POST FOR CREATE A POST
    registerFind();
    registerProfile();
//UPDATE DELETE
    popPost2();
//profile controls
    profileCloseBtn();
    deleteBtn();
    mobileNav();
}

$(documentReady);