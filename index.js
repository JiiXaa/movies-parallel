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

// Function handling search functionality with inside input
const onInputHandler = (e) => {
  fetchData(e.target.value);
};

input.addEventListener('input', debounce(onInputHandler, 500));
