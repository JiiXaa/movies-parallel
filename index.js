const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd6abc885',
      // general search, only handful of data in every movie search
      s: searchTerm,
    },
  });

  // omdbapi does not accept partial search term, and get data.Error instead of data.Search which looks like an error. That's why we return [] if response has data.Error
  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const root = document.querySelector('.autocomplete');
// dynamically created search component
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

// Function handling search functionality with inside input
const onInputHandler = async (e) => {
  const movies = await fetchData(e.target.value);

  // make sure empty dropdown is not shown if there is no search results.
  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');

  for (let movie of movies) {
    const option = document.createElement('a');
    // Do not show image if there is not one. Omdb API has N/A string if there is no image available.
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movie.Title}
    `;
    // listening for a click on every 'a' element (logic for clicking search entry)
    option.addEventListener('click', () => {
      // when click on the 'a' element close dropdown
      dropdown.classList.remove('is-active');
      // because of a closure, we have access to the movie object
      input.value = movie.Title;
      // helper function, logic when you choose a movie
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
};

input.addEventListener('input', debounce(onInputHandler, 500));

// Simple way to close search dropdown when clicked outside of root element.
document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
});

// second data fetch for more detailed information, after film is chosen
const onMovieSelect = async (movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd6abc885',
      // individual movie information (contains more information)
      i: movie.imdbID,
    },
  });

  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
      <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">BoxOffice</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
