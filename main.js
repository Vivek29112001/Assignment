const api = {
    key: "fcc8de7015bbb202209bbf0261babf4c",
    base: "https://api.openweathermap.org/data/2.5/"
  };
  
  const searchbox = document.querySelector('.search-box');
  const unitToggle = document.querySelectorAll('input[name="unit"]');
  const geolocationButton = document.querySelector('.geolocation-button');
  
  let selectedUnit = 'metric'; // Default to Celsius
  
  // Add event listener for "Enter" key press on the search box
  searchbox.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      getResults(searchbox.value);
    }
  });
  
  // Add event listener to the unit toggle
  unitToggle.forEach((input) => {
    input.addEventListener('change', function () {
      selectedUnit = this.value;
      // Call the API again to fetch data in the selected unit
      if (searchbox.value) {
        getResults(searchbox.value);
      }
    });
  });
  
  // Add event listener to the geolocation button
  geolocationButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
      // Request geolocation permission
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        // Call the API with the user's geolocation
        getResultsByGeolocation(latitude, longitude);
      }, (error) => {
        alert("Geolocation error. Please try again or enter a location manually.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
  
  function setQuery(evt) {
    if (evt.keyCode == 13) {
      getResults(searchbox.value);
    }
  }
  
  function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=${selectedUnit}&APPID=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City/Zipcode not found or API request failed. Please check your input and try again.");
        }
        return response.json();
      })
      .then(displayResults)
      .catch((error) => {
        alert(error.message);
      });
  }
  
  function getResultsByGeolocation(latitude, longitude) {
    fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=${selectedUnit}&APPID=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Geolocation data not found or API request failed. Please try again later.");
        }
        return response.json();
      })
      .then(displayResults)
      .catch((error) => {
        alert(error.message);
      });
  }
  
  function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;
  
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);
  
    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>${getTemperatureSymbol()}</span>`;
  
    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
  
    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
  }
  
  function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
  }
  
  function getTemperatureSymbol() {
    return selectedUnit === 'metric' ? '°C' : '°F';
  }
  