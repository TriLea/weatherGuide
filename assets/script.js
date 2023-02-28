//fix

var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');
var inputSelect = document.querySelector('#format-input');

const API_Key = 'd7f16e022429c27e14665625f2e3a757';

function reloadStorage()
{
  let history = localStorage.getItem("history");

  if (history == null) //need this because first time I run it it is null
  {
    return;
  }
  else
  {
    history = JSON.parse(history);
  }

  var historyList = '';

  for (let i = 0; i < history.length; i++) 
  {
    city = history[i];
    historyList += `<option value="${city}">${city}</option>`;
  }
  console.log("history list", historyList);

  inputSelect.innerHTML = historyList; //do backwards to get most recent first
}

function addToHistory(cityName)
{

  //adds to history list of city names previously searched
  let history = localStorage.getItem("history");
  if (history == null)
  {
    console.log("empty");
    history = [];
  }
  else
  {
    history = JSON.parse(history);
  }
  
  for (var i = 0; i < history.length; i++) // change to a stack first in last out
  {
    if (history[i] == cityName)
    {
      console.log("already in history")
      return;
    }
  }

  console.log("pushed to history");
  history.push(cityName);

  localStorage.setItem("history", JSON.stringify(history));
  reloadStorage();
}

function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  console.log(resultObj.dt_txt);
  var titleEl = document.createElement('h3'); // setup for date
  titleEl.innerHTML = '<strong>Date:</strong> ' + resultObj.dt_txt.split(' ')[0] + '<br/>';

  //setup icon for weather
  console.log(); // log out icon?
  var iconEl = document.createElement('img');
  iconEl.setAttribute('src', 'http://openweathermap.org/img/w/' + resultObj.weather[0].icon + '.png'); //go through and fix

  //setup temp
  console.log(resultObj.main.temp);
  var tempEl = document.createElement('p');
  tempEl.textContent = 'Temp: ' + resultObj.main.temp + ' F';

  //setup humidity
  console.log(resultObj.main.humidity);
  var humidityEl = document.createElement('p');
  humidityEl.textContent = 'Humidity: ' + resultObj.main.humidity + '%';

  //setup wind speed
  console.log(); //wing.deg
  console.log(); //wing.gust
  console.log(); //wing.speed
  var windEl = document.createElement('p');
  windEl.textContent = 'Wind Speed: ' + resultObj.wind.speed + ' MPH'; // needs to include the other 2 properties

  //append to resultBody
  resultBody.append(titleEl);
  resultBody.append(iconEl);
  resultBody.append(tempEl);
  resultBody.append(humidityEl);
  resultBody.append(windEl);
  resultContent.append(resultCard);
}

function searchApi(city) {
  //geo coding api, lat and long
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_Key}`;

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        console.log('No results found!');
        resultContent.innerHTML = '<h3>No results found, search again!</h3>';
      }
      //why does this use function?
      return response.json();
    })
    .then(function (locQueryUrl) {
      // write query to page so user knows what they are viewing
      console.log(locQueryUrl);
      console.log(locQueryUrl.coord.lat);
      console.log(locQueryUrl.coord.lon);
      //printResults(locQueryUrl);

      weatherFiveDay(locQueryUrl.coord.lat, locQueryUrl.coord.lon);
    })
}

function weatherFiveDay(lat, lon)
{
  var localFiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_Key}`;

  fetch(localFiveDay)
    .then(function (response) {
      if (!response.ok) {
        console.log('No results found!');
        resultContent.innerHTML = '<h3>No results found, search again!</h3>';
      }
      //why does this use function?
      return response.json();
    })
    .then(function (localFiveDay) {
      // write query to page so user knows what they are viewing
      console.log(localFiveDay);
      for (var i = 2; i < 40; i += 8) // for loop should go through same time, there are 8 a day 3 hour intervals starting at 6:00:00
      {
        //iterate throught the days
        //call printResults for each day
        printResults(localFiveDay.list[i]);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;
  addToHistory(searchInputVal);

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal, formatInputVal);
}

reloadStorage();
searchForm.addEventListener('submit', handleSearchFormSubmit);
