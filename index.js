const input = document.querySelector('input');

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

// Function handling search functionality with inside input
const onInputHandler = async (e) => {
  const movies = await fetchData(e.target.value);

  for (let movie of movies) {
    const div = document.createElement('div');

    div.innerHTML = `
    <img src="${movie.Poster}" />
    <h1>${movie.Title}</h1>
    `;

    document.querySelector('#here-temp').appendChild(div);
  }
};

input.addEventListener('input', debounce(onInputHandler, 500));
