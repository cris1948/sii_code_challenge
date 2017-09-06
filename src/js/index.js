const MOVIEDB_API_KEY = 'fff2f288005425652515f2361d8b1964';
const MOVIEDB_BASE_URL = 'http://api.themoviedb.org/3';
const MOVIEDB_IMAGES_URL = 'http://image.tmdb.org/t/p';

let MovieDB = {
  listenerAction (text) {
    console.log(text, this)
  },
  makeRequest (requestedUrl, method, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      } else {
        console.log(this.readyState);
      }
    });

    xhr.open(method, `${MOVIEDB_BASE_URL}/${requestedUrl}/${MOVIEDB_API_KEY}`);

    xhr.send(data);
  }
};

window.onload = function () {
  let searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (evt) => {
    _.delay((evt) => {
      MovieDB.listenerAction(evt.target.value)
    }, 1000, evt)
  })
};


