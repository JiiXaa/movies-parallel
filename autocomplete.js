const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
}) => {
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

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

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

      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(movie);
      // listening for a click on every 'a' element (logic for clicking search entry)
      option.addEventListener('click', () => {
        // when click on the 'a' element close dropdown
        dropdown.classList.remove('is-active');
        // because of a closure, we have access to the movie object
        input.value = inputValue(movie);
        // helper function, logic when you choose a movie
        onOptionSelect(movie);
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
};
