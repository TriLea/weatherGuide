//fix

var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');
var inputSelect = document.querySelector('#format-input');

const API_Key = 'd7f16e022429c27e14665625f2e3a757';

// function getParams() {
//   // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
//   var searchParamsArr = document.location.search.split('&');

//   // Get the query and format values
//   var query = searchParamsArr[0].split('=').pop();
//   var format = searchParamsArr[1].split('=').pop();

//   searchApi(query, format);
// }

function reloadStorage()
{
  let history = localStorage.getItem("history");
  if (history == null)
  {
    return;
  }

  var historyList = '';

  for (let i = 0; i < history.length; i++) 
  {
    city = history[i];
    historyList += `<options value=${city}>${city}</options>`;
  }

  inputSelect.innerHTML = historyList; //do backwards to get most recent first
}

function addToHistory(cityName)
{

  //adds to history list of city names previously searched
  let history = localStorage.getItem("history");
  if (history == null)
  {
    history = [];
  }
  else
  {
    history = JSON.parse(history);
  }
  
  for (var i = 0; i < history.length; i++)
  {
    if (history[i] == cityName)
    {
      return;
    }
    else
    {
      history.push(cityName);
    }
  }

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

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Date:</strong> ' + resultObj.date + '<br/>';

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ' + resultObj.subject.join(', ') + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong> ' + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }

  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.url);
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);

  resultContent.append(resultCard);
}

function searchApi(city) {
  //geo coding api, lat and long
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`;

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

      weatherFiveDay(locQueryUrl.coord.lat, locQueryUrl.coord.lon);
    })
}

function weatherFiveDay(lat, lon)
{
  var localFiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}`;

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
  addToHistory(); //add cityname to param
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal, formatInputVal);
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
