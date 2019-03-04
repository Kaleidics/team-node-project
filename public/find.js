'use strict';

//AJAX function to view all posts, trigged by click event on nav button Find a Game
function viewPosts() {
    const url = 'https://immense-brushlands-16839.herokuapp.com/api/teams/';
    return fetch(url)
        .then(res => res.json())
        .then(response => {
            populatePosts(response);
        })
        .catch(err => console.log(err));
}


function populatePosts(arr) {
    let items = ``;

    for (let i = 0; i < arr.length; i++) {
        const { title, sport, membersLimit, description, _id, address, rules } = arr[i];
        const { creator, joiners } = arr[i].members;
        const { lat, long } = arr[i].location;

        items = items.concat(`
            <div id="${_id}" class="findView post-item" aria-controls="self-expanded-post">
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
    $('#view-container').html(items);
}

function viewSinglePost2(postId) {
    const base = 'https://immense-brushlands-16839.herokuapp.com/api/teams/post/';
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
            modalizePostFind(response);
        })
        .catch(err => console.log(err));
}

function modalizePostFind(arr) {
    const { title, sport, membersLimit, description, _id, address, rules } = arr;
    let { creator, joiners } = arr.members;
    const { lat, long } = arr.location;
    creator = creator.username;

    $('#post-container').append(`
    <div id="signup-Modal" class="modal unhide" role="self-expanded-post">
            <div class="class modal-content">
                <a href="#" class="closeBtn" aria-controls="self-expanded-post"><span class="cSpan">Go back</span></a>
                <div id="${_id}">
                <div>
                    <ul class="postUl">
                        <li class="postTitle"><h3>${title}</h3></li>
                        <li class="postHost">Host: ${creator}</li>
                        <li class="postRules">Rules: ${rules}</li>
                        <li class="postMaxPlayer">Looking for: ${membersLimit} players</li>
                        <li class="postCurrentPlayers">Current players: ${joiners}</li>
                        <li class="postDes">Description: <p>${description}</p></li>
                        <li class="postAdd">Location: <address>${address}</address></li>
                        <div id='map' class="map-style"></div>
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
    if (
        navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
       
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

function documentReady() {
    viewPosts();
    // $('.modal-content').niceScroll();
}

$(documentReady);