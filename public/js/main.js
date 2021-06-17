const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signupForm = document.getElementById('signupForm')
const signInForm = document.getElementById('signInForm')

if (signUpButton)
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

if (signInButton)
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });

if (signupForm)
    signupForm.addEventListener('submit', registerMember)

if (signInForm)
    signInForm.addEventListener('submit', signInMember)

async function registerMember(event) {
    event.preventDefault()
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value
    const password = document.getElementById('password').value
    const confPassword = document.getElementById('confPassword').value

    const result = await fetch('/member', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email,
            password, name, confPassword
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        location.href = '/member'
    } else {
        if (result.type == "password")
            document.getElementById("passError").innerHTML = result.error
        else if (result.type == "email")
            document.getElementById("emailError").innerHTML = result.error
        setTimeout(function () {
            $('#passError').fadeOut('slow'),
                $('#emailError').fadeOut('slow');
        }, 5000);
    }
}
async function signInMember(event) {
    event.preventDefault()
    const email = document.getElementById('emailSignIn').value
    const password = document.getElementById('passwordSignIn').value

    const result = await fetch('/member/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        location.href = '/member/index'
    } else {
        if (result.type == "password")
            document.getElementById("passErrorSignIn").innerHTML = result.error
        else if (result.type == "email")
            document.getElementById("emailErrorSignIn").innerHTML = result.error
        setTimeout(function () {
            $('#passErrorSignIn').fadeOut('slow'),
                $('#emailErrorSignIn').fadeOut('slow');
        }, 4000);
    }
}
function checkPass() {
    //Store the password field objects into variables ...
    var pass1 = document.getElementById("password");
    var pass2 = document.getElementById("confPassword");
    //Store the Confimation Message Object ...
    var message = document.getElementById('confPassword_msg');
    //Set the colors we will be using ...
    var correctColor = "#2a7f2a";
    var errorColor = "#a80808";
    //Compare the values in the password field 
    //and the confirmation field
    if (pass1.value != "" && pass2.value != "") {
        if (pass1.value == pass2.value) {
            //The passwords match. 
            //Set the color to the correct color and inform
            //the user that they have entered the correct password 
            pass2.style.backgroundColor = "#17ad1794";
            message.style.color = correctColor;
            message.innerHTML = "Passwords Match!"

            // if no mismatch => enable the submit button                 
            var tabPom = document.getElementById("sign_up_btn");
            setTimeout(function () {
                $('#confPassword_msg').fadeOut('slow'),
                    $("#confPassword").css("background-color", "");
            }, 6000);
            $(tabPom).prop('disabled', false);
        } else {
            //The passwords do not match.
            //Set the color to the error color and
            //notify the user.
            pass2.style.backgroundColor = "#c0070786";
            message.style.color = errorColor;
            message.innerHTML = "Passwords Do Not Match!"
            // if  mismatch => disable the submit button       
            var tabPom = document.getElementById("sign_up_btn");
            $(tabPom).prop('disabled', true);
        }
    }
    else {
        message.innerHTML = ""

    }
}



// Typed.js

$(function () {
    $(".typed").typed({
        strings: ["Its the only place you have to live. "],
        // Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
        stringsElement: null,
        // typing speed
        typeSpeed: 0,
        // time before typing starts
        startDelay: 300,
        // backspacing speed
        backSpeed: 20,
        // time before backspacing
        backDelay: 1100,
        // loop
        loop: true,
        // false = infinite
        loopCount: 1,
        // show cursor
        showCursor: true,
        // character for cursor
        cursorChar: "|",
        // attribute to type (null == text)
        attr: null,
        // either html or text
        contentType: 'html',


    });
});

