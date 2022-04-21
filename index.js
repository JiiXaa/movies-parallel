const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd6abc885',
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
