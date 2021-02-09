/**  file: app.js
 * 
 * Creating a Server and Client exercise.
 * Weather info is retrieved from an API and
 * delivered to a Server.  Data then returned
 * to the client-side for posting in the UI.
 * 
 * Dependencies:
 			Node: 15.7.0,
 			Express: 4.17.1,
			Cors: 2.8.5,
			Promises: 0.2.5,		
            Body-parser: 1.19.0
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/
/*Global Variables*/
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';

// API key
const apiKey = '&units=metric&appid=c302e82cdc5d2979a38a4d4d3bc2cb53';
const zipCode = document.querySelector('#zip-input');
const uFeel = document.querySelector('#feelings');

// Create new date instance dynamically with javascript
let d = new Date()
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
let dateToday = `${da}-${mo}-${ye}`;

document.getElementById("disDate").innerHTML = dateToday;

// Event listener for the click
document.getElementById('generate').addEventListener('click', pressEvent);

/* Function called by event listener */

function pressEvent() {
    let feelValue = uFeel.value;
    let zipValue = zipCode.value;
  //  console.log("zip: "+zipValue);
    
    if (zipValue === "") {
     return alert("Zipcode must be entered");
 }
    getWeather(zipValue,feelValue);
}

// Function to get Web API data
function getWeather(zip,feel) {	
    const zipCode = zip;
    const userFeeling = feel;
    getWeatherForcast(baseURL, zipCode, apiKey)
    .then(function (weatherData) {
        const temperature = weatherData.main.temp;
        const city = weatherData.name;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const feeling = userFeeling;
        let country = weatherData.sys.country;
        if(country =='US') {
            country = "United States";
        }     
        // sending the weather data to the server
        postData('/add', {
            temperature, 
            city, 
            description, 
            icon, 
            windSpeed,
            humidity,
            feeling,
            country
        }).then(
            function callUpdate () {updateUI();})
        // updateUI function to be called after the click is fired off and the weather info is gathered
    });
}

// POST the journal data
const getWeatherForcast = async (baseURL, zipCode, apiKey) => {
    const response = await fetch(baseURL + zipCode + apiKey)
    try {
        const newData = await response.json();
        return newData;
    } 
    catch(error) {
        console.log("error returning data", error);
    }
};

// Function to POST data 
async function postData(url, data) {
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
};

async function updateUI() {
    // this function GET the data from the server
    const response = await fetch('/retrieve');
    const lastEntry = await response.json();
    document.querySelector('.city').innerText = "Weather in " + lastEntry.city;
    document.querySelector('.country').innerText = lastEntry.country;
    document.querySelector('.temperature').innerText = Math.floor(lastEntry.temperature) + "°C";
    document.querySelector('.description').innerText = lastEntry.description;
  //  console.log(document.querySelector('.description').innerText);
    document.querySelector('.humidity').innerText = "Humidity: " + lastEntry.humidity + "%";
    document.querySelector('.wind').innerText = "Wind speed: " + lastEntry.windSpeed + "km/H";
    document.querySelector('.icon').src = "https://openweathermap.org/img/wn/" + lastEntry.icon +"@2x.png";
    document.querySelector('.date').innerText = dateToday;
    document.querySelector('.userContent').innerText = lastEntry.feeling;
}