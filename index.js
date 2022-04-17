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

// variable to store setTimeout id, for clearing it when needed
let timeoutId;

// simple debounce with setting timeout with first click, and next will clear it until you stop typing inside input. When you stop it will fetch data.
const onInputHandler = (e) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    fetchData(e.target.value);
  }, 500);
};

input.addEventListener('input', onInputHandler);
