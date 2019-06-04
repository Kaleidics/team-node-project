"use strict";

//Originally meant to be for multiple sports, now its only basketball, used to fill deprecated form field
const sport = "basketball";
const base = "https://immense-brushlands-16839.herokuapp.com";

//Loads different navbars depending if user is authed
function pseudoState() {
  if (localStorage.getItem("localtoken")) {
    $("#post-nav").addClass("unhidden");
    $("#pre-nav").addClass("hidden");
  }
}

function logout() {
  $("#logoutBtn").on("click", event => {
    localStorage.removeItem("localtoken");
    localStorage.removeItem("currentUser");
    location.href = "./index.html";
  });
}

//Modal controls for login/signup divs
function toggleOnSignUp() {
  $("#signUpBtn").on("click", function(event) {
    $("#signup-Modal").addClass("unhide");
    $("#login-Modal").removeClass("unhide");
  });
}

function toggleOffSignUp() {
  $(".cSpan").on("click", function(event) {
    $("#signup-Modal").removeClass("unhide");
  });
}

function toggleOnLogin() {
  $("#loginBtn").on("click", function(event) {
    $("#login-Modal").addClass("unhide");
    $("#signup-Modal").removeClass("unhide");
  });
}

function toggleOffLogin() {
  $(".cSpan").on("click", function(event) {
    $("#login-Modal").removeClass("unhide");
  });
}

//Auth form event listeners

function submitSignUp() {
  $("#signup-submit").on("submit", event => {
    event.preventDefault();
    SignUp();
  });
}

function submitLogin() {
  $("#login-submit").on("submit", event => {
    event.preventDefault();
    login();
  });
}

// =================  AUTH AJAX  ========================

function SignUp() {
  const url = base + "/api/users/register";

  const username = $("#usernameS").val();
  const password = $("#passwordS").val();

  const signupCreds = {
    username: username,
    password: password
  };

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(signupCreds),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      //if response success trigger login modal
      if (response.status === 201) {
        $("#signup-Modal").removeClass("unhide");
        $("#login-Modal").addClass("unhide");
      }
      //if fail any signup requirements trigger error message
      else {
        return response
          .json()
          .then(response => {
            alert(`${response.location} ${response.message}`);
          })
          .catch(err => console.log(err));
      }
      return response.json();
    })
    .catch(err => console.log(err));
}

function login() {
  const url = base + "/api/auth/login";

  const username = $("#usernameL").val();
  const password = $("#passwordL").val();

  const loginCreds = {
    username: username,
    password: password
  };

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(loginCreds),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      const authToken = response.authtoken;
      const userid = response.userid;
      //store jwt
      localStorage.setItem("localtoken", authToken);
      localStorage.setItem("currentUser", userid);
    })
    .then(response => {
      if (localStorage.getItem("localtoken")) {
        $("#login-Modal").removeClass("unhide");
        $("#post-nav").removeClass("hidden");
        $("#pre-nav").addClass("hidden");
      }
    })
    .catch(err => {
      alert("Username or password do not match.");
    });
}

//Event listener for the Find a Game button on navbar, triggers AJAX request for all posts
function registerFind() {
  $("#findBtn").on("click", event => {
    location.reload();
  });
}

// Event listener for the My Profile button on navbar, triggers AJAX request for Posts, you created and Posts, you joined
function registerProfile() {
  $("#profileBtn").on("click", event => {
    location.reload();
  });
}

//Remove the appended modal from modalizePost functions -- CHANGED TO MULTI PURPOSE CLOSE BTN NEEDS REFACTOR
function profileCloseBtn() {
  $("#post-container").on("click", ".cSpan", event => {
    $(event.target)
      .closest("#signup-Modal")
      .remove();
    $("body").removeClass("preventScroll");
  });
}

//General purpose event listener for clicking on a post
function popPost2() {
  $("#view-container").on("click", ".findView", event => {
    const singlePost = $(event.target)
      .closest("div.findView")
      .attr("id");
    $("body").addClass("preventScroll");
    viewSinglePost2(singlePost);
  });
}

//Control navbar responsiveness
function mobileNav() {
  $(".content").on("click", event => {
    $(".content").toggleClass("change");
    $(".mDelta").toggle("mobileHide");
    $(".nav").toggleClass("heightMobile");
    $(".navbar li").toggleClass("overlaySpacing");
  });

  $("#loginBtn, #signUpBtn").on("click", event => {
    if ($(".content").hasClass("change")) {
      $(".content").toggleClass("change");
      $(".mDelta").toggle("mobileHide");
      $(".nav").removeClass("heightMobile");
      $(".navbar li").toggleClass("overlaySpacing");
    }
  });

  //For Mobile
  $(window).on("resize", function() {
    var width = $(window).width();
    if (width > 1024) {
      $(".mDelta").show();
    }

    if (width < 1024 && !$(".content").hasClass("change")) {
      $(".mDelta").hide();
    }
  });
}

function documentReady() {
  //SIMULATE STATES
  pseudoState();
  logout();
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
  mobileNav();
}

$(documentReady);
