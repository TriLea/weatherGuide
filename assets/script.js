//fix
var text = $('.textarea');
var saveBtn = $('.saveBtn');

var resultText = document.querySelector('#result-text');
var resultContent = document.querySelector('#result-content');
var searchForm = document.querySelector('#search-form');
var inputSelect = document.querySelector('#forat-input');

var API_Key = 'd7f16e022429c27e14665625f2e3a757';

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

  resultContentEl.append(resultCard);
}

function searchApi(query, format) {
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`;

  // if (format) {
  //   locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
  // }

  //locQueryUrl = locQueryUrl + '&q=' + query;

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      //why does this use function?
      return response.json();
    })
    .then(function (localResults) {
      // write query to page so user knows what they are viewing
      resultTextEl.textContent = localResults.search.query;

      console.log(localResults);

      if (!localResults.results.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {

        
        resultContentEl.textContent = '';
        for (var i = 0; i < localResults.results.length; i++) {
          printResults(localResults.results[i]);
        }
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

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal, formatInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
