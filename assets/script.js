var now = dayjs();
now.format("dddd,h,m");

var hour = dayjs().hour();
//fix
var text = $('.textarea');
var saveBtn = $('.saveBtn');

function getParams()
{
    //gets parameters for weather api
}

function 

function printResults()
{
    //prints html for generating 5 day forecast
}

function getWeather()
{
    //gets weather for current day
}

//_______________________________________________________
//disect code
function searchApi(query, format) {
    var locQueryUrl = 'https://www.loc.gov/search/?fo=json';
  
    if (format) {
      locQueryUrl = 'https://www.loc.gov/' + format + '/?fo=json';
    }
  
    locQueryUrl = locQueryUrl + '&q=' + query;
  
    fetch(locQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
        // write query to page so user knows what they are viewing
        resultTextEl.textContent = locRes.search.query;
  
        console.log(locRes);
  
        if (!locRes.results.length) {
          console.log('No results found!');
          resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
          resultContentEl.textContent = '';
          for (var i = 0; i < locRes.results.length; i++) {
            printResults(locRes.results[i]);
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
}
  