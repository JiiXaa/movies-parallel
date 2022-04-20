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

  dropdown.classList.add('is-active');

  for (let movie of movies) {
    const option = document.createElement('a');

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img src="${movie.Poster}" />
    ${movie.Title}
    `;

    resultsWrapper.appendChild(option);
  }
};

input.addEventListener('input', debounce(onInputHandler, 500));
