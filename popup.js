const request = new XMLHttpRequest();

// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
//      check if logged in
// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
chrome.storage.sync.get('username', (result) => {
  if (result.username) {
      document.getElementById('authenticated-username').textContent = "Hello " + result.username;
      document.getElementById('authenticated').style.display = "block";
  } else {
      document.getElementById('unauthenticated').style.display = "block";
  }
})


// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
//          save urls
// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
document.getElementById('authenticated-save-url').addEventListener('click', function() {
  document.getElementById('overlay').style.display = "block";

  chrome.storage.sync.get('username', (result) => {
    var username = result.username;

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      let currentUrl = tabs[0].url;

      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          let result = JSON.parse(request.response);

          if (result.success) {
              document.getElementById('overlay').style.display = "none";
              document.getElementById('authenticated-saved-success').textContent = 'Saved URLs in ' + currentUrl;
          } else {
              document.getElementById('overlay').style.display = "none";
              document.getElementById('authenticated-saved-success').textContent = result.error;
          }
        }
      }

      let ajaxUrl = "http://angkiki-bookmarker.herokuapp.com/links/new/ajax?username=" + username + "&url=" + currentUrl;
      request.open('POST', ajaxUrl);
      request.setRequestHeader('Content-type', 'application/json');
      request.send();
    });
  });
});



// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
//     logout/empty storage
// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
document.getElementById('logout').addEventListener('click', function() {
  chrome.storage.sync.remove('username');

  document.getElementById('authenticated').style.display = "none";
  document.getElementById('unauthenticated').style.display = "block";
})


// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
//     display login form
// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
document.getElementById('login').addEventListener('click', function() {
  document.getElementById('login-form').style.display = "block";
})


// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
//      log user in
// ~ ~ ~   ~ ~ ~   ~ ~ ~   ~ ~ ~
document.getElementById('login-submit').addEventListener('click', function(event) {
  document.getElementById('overlay').style.display = "block";
  event.preventDefault();

  request.onreadystatechange = function(){
    if (request.readyState == 4 && request.status == 200){
        let result = JSON.parse(request.response);

        if (result.authenticated) {
            document.getElementById('overlay').style.display = "none";
            chrome.storage.sync.set({username: result.username});
            document.getElementById('unauthenticated').style.display = "none";
            document.getElementById('authenticated-username').textContent = "Hello " + result.username;
            document.getElementById('authenticated').style.display = "block";
        } else {
            document.getElementById('overlay').style.display = "none";
            document.getElementById('authentication-failed').textContent = result.error;
        }
    }
  }

  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let url = 'http://angkiki-bookmarker.herokuapp.com/users/login/ajax';

  let fullUrl = url + '?username=' + username + '&password=' + password + '&apple=pie';

  request.open('POST', fullUrl);
  request.setRequestHeader('Content-type', 'application/json');
  request.send();
});
