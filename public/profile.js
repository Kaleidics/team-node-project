'use strict';

function viewProfile() {
    const base = 'https://immense-brushlands-16839.herokuapp.com/api/teams/';
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

function documentReady() {
    viewProfile();
}

$(documentReady);