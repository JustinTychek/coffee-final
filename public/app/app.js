/////////creating the hamburger menu //////////////////////////////////////////////
const hamburger = document.querySelector(".hamburger");
const links = document.querySelector(".bottom-nav");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  links.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  links.classList.remove("active");
}

////////////////////////////////////////////////////////////////////////////////

// creating the login modal ////////////////////////////////////////////////////
function addModalListener() {
  $(".bg-click").click(function (e) {
    // $(".modal").css("display", "none");
    gsap.to($(".modal"), { scale: 0, duration: 0 });
  });
}

function initModal() {
  $("#submit").click(function (e) {
    e.preventDefault();

    let text = $("#callout-text").val();
    gsap.to($(".modal"), {
      scale: 0,
      duration: 0,
      onComplete: showAlert,
      onCompleteParams: [text],
    });
  });
  $("#showModal").click(function (e) {
    //     $("body").append(`<div class="modal">
    //     <div class="bg-click"></div>
    //     <div class="callout"></div>
    // </div>`);
    // $(".modal").css("display", "flex");
    gsap.to($(".modal"), {
      // ease: "elastic.out",
      scale: 1,
      duration: 0.01,
    });
    addModalListener();
  });
}

///////////////////////////////////////////////////////////////////////////////

// login, logout, create user ////////////////////////////////////////////////

function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("connected");
      $(".callout").css("height", "455px");
      $(".form-titles").css("display", "none");
      $(".login-form").css("display", "none");
      $(".signup-form").css("display", "none");
      $(".account-info").css("display", "flex");
    } else {
      console.log("user is not there");
      $(".callout").css("height", "565px");
      $(".form-titles").css("display", "block");
      $(".login-form").css("display", "flex");
      $(".signup-form").css("display", "flex");
      $(".account-info").css("display", "none");
    }
  });
}

function createUser() {
  let password = document.getElementById("password-signup").value;
  let email = document.getElementById("email-signup").value;
  let fName = document.getElementById("fname-signup").value;
  let lName = document.getElementById("lname-signup").value;

  // alert(fName + " " + lName + " " + email + " " + password);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(userCredential.user);
      // navToPage("home");
      $("input").val("");
      // window.location.reload();
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage); //make this an alert to show users
      alert("An error occured. Please try again.");
      // ..
    });
}

function login() {
  let password = document.getElementById("password-login").value;
  let email = document.getElementById("email-login").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("signed in");
      // navToPage("home");
      $("input").val("");
      // window.location.reload();
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      alert("Invalid email or password. Please try again.");
    });
}

function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("signed out");
      // window.location.reload();
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
}

//////////////////////////////////////////////////////////////////////////////

// JSON functions ////////////////////////////////////////////////////////////

function loadCoffeeMakers() {
  console.log("load coffee makers");
  $.getJSON("data/data.json", function (coffeeMakers) {
    $.each(coffeeMakers.coffee_makers, function (index, coffeeMakers) {
      $("#app .home .content-holder").append(
        ` <div class="coffee-maker">
        <img class="coffee-maker-img" src="${coffeeMakers.coffeeImg}" alt="">
        <div class="coffee-text">
            <p class="coffee-maker-title">${coffeeMakers.coffeeName}</p>
            <p class="price">${coffeeMakers.coffeePrice}</p>
        </div>

        <div class="compare"><input type="checkbox" value="Compare"> Compare</div>

        <button class="buy-now">BUY NOW</button>
    </div>`
      );
    });
  }).fail(function (jqxhr, textStatus, error) {
    console.log(jqxhr + " text " + textStatus + " " + error);
  });
}

//////////////////////////////////////////////////////////////////////////////

//  html injection  //////////////////////////////////////////////////////////

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  //takes you to the home page if the url is empty
  if (pageID == "") {
    navToPage("home");
  } else {
    navToPage(pageID);
  }
}

//function that takes you to the page based on the pageID
function navToPage(pageName) {
  MODEL.getPageContent(pageName);
  // console.log("nav to page");
}

function pagelistener() {
  $(window).on("hashchange", route);
  route();
  // console.log("pagelistener");
}

function initlistener() {
  $("nav a").click(function (e) {
    // e.preventDefault();
    let btnID = e.currentTarget.id;

    if (btnID == "create") {
      createUser();
    } else if (btnID == "login") {
      login();
    } else if (btnID == "signout") {
      signout();
    }
  });
}
/////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initlistener();
  } catch {
    console.error(e);
  }

  pagelistener();
  loadCoffeeMakers();
  gsap.set($(".modal"), { scale: 0 });
  initModal();
});
