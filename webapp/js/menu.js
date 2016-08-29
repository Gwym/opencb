console.log('menu >');

// drop-down menus
var links = document.querySelectorAll('.sidebar-links > div > h4');
var menus = document.querySelectorAll('.sidebar-links > div');
var sections = document.querySelectorAll('.main-content > section');

var toggleSelected = function(e) { 

  for (var i = 0 ; i < menus.length ; i++) {
    menus[i].className = '';
  } 

  e.target.parentNode.className = 'selected';
  console.log('selected' + e.target);
};

for (var i = 0 ; i < links.length ; i++) {

  links[i].addEventListener('click', toggleSelected );
}

var displaySection = function(e) {
  console.log(e);
  console.log(e.getAttribute("href"));
  
  for (var i = 0 ; i < sections.length ; i++) {
    sections[i].className = 'hidden';
  }
  
  document.querySelector(e.getAttribute("href")).className = '';
  
};

/* for (var i = 0 ; i < menus.length ; i++) {

  menus[i].addEventListener('click', displaySection );
} */

for (var i = 0 ; i < sections.length ; i++) {
  sections[i].className = 'hidden';
}
			
/*
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
// Draw Logo
var logo = document.getElementById('logo');
var ctx = logo.getContext('2d');
ctx.fillStyle = "lime";
ctx.strokeStyle = "white";
ctx.font = "48px monospace";
ctx.fillText("opencb "+String.fromCharCode(0x2665), 25, 70); // todo image logo or requestanimation

*/


// login
var login = document.getElementById('do_login');
login.addEventListener('click', function() {
  console.log('TODO login');
  
  // window.location.replace('opencb.html');
  
  // websocket login
  doLogin();
} );
