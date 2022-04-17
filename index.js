const input = document.querySelector('input');

const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd6abc885',
      s: searchTerm,
    },
  });

  console.log(response.data);
};

const debounce = (callback, delay = 1000) => {
  // variable to store setTimeout id, for clearing it when needed
  let timeoutId;

  // simple debounce with setting timeout with first click, and next will clear it until you stop typing inside input. When you stop it will fetch data.
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // apply keep track of how many attributes need to be passed to the callback function (can use spread ...args instead of passing every argument one by one)
      callback.apply(null, args);
    }, delay);
  };
};

// Function handling search functionality with inside input
const onInputHandler = (e) => {
  fetchData(e.target.value);
};

input.addEventListener('input', debounce(onInputHandler, 500));
