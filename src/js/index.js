const MOVIEDB_API_KEY = 'fff2f288005425652515f2361d8b1964';
const MOVIEDB_BASE_URL = 'https://api.themoviedb.org/3';
const MOVIEDB_IMAGES_URL = 'https://image.tmdb.org/t/p/w780/';
const MOVIEDB_AUTHENTICATE_URL = 'https://www.themoviedb.org/authenticate/'

const methods = {
  getToken: {url: 'authentication/token/new', type: 'GET'},
  createSession: {url: 'authentication/session/new', type: 'GET'},
  createGuestSession: {url: 'authentication/guest_session/new', type: 'GET'},
  searchMovie: {url: 'search/movie', type: 'GET'}
};

let MovieDB = {
  guestSessionId: null,
  results: null,
  makeRequest (method, data) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      let queryString;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          resolve(JSON.parse(this.response))
        }
      });

      if (methods[method]['type'] === 'GET') {
        queryString = MovieDB.createQueryString(data);
      }
      xhr.onerror = reject;
      xhr.open(methods[method]['type'], `${MOVIEDB_BASE_URL}/${methods[method]['url']}${queryString}`, true);

      xhr.send(data || {});
    });
  },
  createQueryString (data) {
    let string = `?api_key=${MOVIEDB_API_KEY}`;
    if (data) {
      Object.keys(data).forEach((key) => {
        console.log(data[key]);
        string += `&${key}=${data[key]}`
      });
    }
    return string;
  },
  listenerAction (textQuery) {
    // TODO: what in case when questSessionId is on system but expired form API site - fix it or catch error
    this.guestSessionId ? this.searchMovie(textQuery) : this.authenticateUser(textQuery)
  },
  searchMovie (textQuery, page) {
    this.makeRequest('searchMovie', {query: textQuery, page: 1}).then((response) => {
      this.results = response
    }).then(() => {
      this.renderResultsList();
    })
  },
  authenticateUser (textQuery) {
    this.makeRequest('getToken').then((response) => {
      return this.makeRequest('createGuestSession');
    }).then((response) => {
      this.guestSessionId = response.guest_session_id;
    }).then(() => {
      this.searchMovie(textQuery)
    }).catch((error) => {
      console.log(error)
    })
  },
  renderResultsList () {
    let container = document.getElementById('results');

    this.results.results.forEach( (result) => {
      let imageUrl = result.backdrop_path ? `${MOVIEDB_IMAGES_URL}${result.backdrop_path}` : 'https://assets.tmdb.org/images/v4/logos/91x81.png';
      let template = `
      <div class="result__header">
        <img src="${imageUrl}" alt="">
      </div>
      <div class="result__body">
        <h1>${result.title}</h1>
        <span>${result.overview}</span>
      </div>
      <div class="result__footer">
        <span>${result.vote_average}</span>
        <span>${result.release_date}</span>
      </div>`;

      let div = document.createElement('div');
      div.innerHTML = template;
      container.insertBefore(div, null);
    })
  }
};

window.onload = function () {
  let searchInput = document.getElementById('search');
  searchInput.addEventListener('input', _.debounce(function (evt) {
    MovieDB.listenerAction(evt.target.value)
  }, 1000))
};


// TODO: pagination
// TODO: loader
// TODO: empty result
// TODO: style everything

