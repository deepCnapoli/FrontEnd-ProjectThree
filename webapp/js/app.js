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
const zipCode = document.getElementById('zip-input');


const uFeel = document.querySelector('#userFeelings');

// Create new date instance dynamically with javascript
let d = new Date()
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
let dateToday = `${da}-${mo}-${ye}`;

document.getElementById("disDate").innerHTML = dateToday;
// initialize the icon to display thunder storms on startup
document.querySelector('.icon').src = "http://openweathermap.org/img/wn/11d@2x.png";

// Event listener for the click
document.getElementById('generate').addEventListener('click', performAction);

/* Getting weather with Zipcode after event listener is activated */
function performAction() {
    let feelValue = uFeel.value;
    let zipValue = zipCode.value;
    
    if (zipValue === "") {
     return alert("Zipcode must be entered");
 }
	const appURL=baseURL+zipValue+apiKey;
	
/* Call to the API */
	getWeather(appURL,feelValue);
}
// function to get API data
	const getWeather = async (url,userFeel) => {
           // console.log("url: "+url);
        const response = await fetch(url)
        try {const weatherData = await response.json();
                  //  console.log("weatherData-ct1: ");
                  //  console.log(weatherData);   // API data returned
       //Add data to post request
			 const city = weatherData['name'];
			   //	console.log("city: "+city);
			 const country = weatherData['sys']['country'];  
			   //	console.log("country: "+country);		  
			 const temp = weatherData['main']['temp'].toFixed(1);
			   // 	console.log("temp: "+temp);
			 const icon = weatherData['weather'][0]['icon'];
			   //	console.log("icon: "+icon);
			 const desc = weatherData['weather'][0]['description'];
			 const windSpeed = weatherData['wind']['speed'];
			   //	console.log("windSpeed: "+windSpeed);
			   //	console.log(windSpeed);
			 const windDir = weatherData['wind']['deg'];
			   //	console.log("windDir: "+windDir);
			   //	console.log(windDir);
			   //	console.log("userFeel: "+userFeel);
			 // POST request to store all data received locally in the app
             postData ('/add', {
		   // /add is the URI link to Server POST route		 
				city,country,temp,icon,desc,windSpeed,windDir,userFeel
                }).then (updateUI())
		   // wait until recieved the data from API POSTed the data and then update the UI	 
                   // console.log("data2");
                   // console.log(weatherData);
                   return weatherData;
                   } catch(error) {
                    	console.log({message: "Cannot fetch url from server correctly!"});
                   }
};	
// POST the journal data
const getWeatherForcast = async (appURL) => {
	// create variable resp to hold the data returned
    const resp = await fetch(appURL)
    try {
        const newData = await resp.json();
        return newData;
    } 
    catch(error) {
        console.log("error returning data", error);
    }
};

// Function to POST data to the Server
async function postData(url, data) {
//async function postData(url="", data={}) {
    await fetch(url, {
        method: 'POST',  // to be used to POST data somewhere
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json'}, // to run on JSON data
        body: JSON.stringify(data), // body muct match JSON data. 
    });								// Stringify will turn data into JSON data
};
 
const updateUI = async() => {
    // this function GET the data from the server
    const response = await fetch('/retrieve');  // link to Server route
	try{								
    const rtnData = await response.json();		// variable to hold JSON data rtn from Server
		// console.log("rtnData-CT: "+rtnData);
		// console.log(rtnData);
		// console.log(rtnData.city);
	let country;
		if(rtnData.country =='US') {
							country = "United States";
        }else{
			country = rtnData.country
		}
	// now can update the form fields	
	document.querySelector('.city').innerText = "Weather in " + rtnData.city;
    document.querySelector('.country').innerText = country;
    let tempC = rtnData.temp;
    let tempF = convertToF(tempC);
      // console.log("tempF: "+tempF);
    document.querySelector('.temperatureC').innerText = tempC + "°C";
    document.querySelector('.temperatureF').innerText = tempF + "°F";
    document.querySelector('.description').innerText = rtnData.desc;
    document.querySelector('.wind').innerText = "Wind speed: " + rtnData.windSpeed + "km/H";
    document.querySelector('.icon').src = "http://openweathermap.org/img/wn/" + rtnData.icon +"@2x.png";
	document.querySelector('.date').innerText = dateToday;
    document.querySelector('.userContent').innerText = rtnData.userFeel;
	} catch (error) {
		console.log({message: 'Incorrect entry'});
	}
} // end: updateUI

function convertToF(celsius) {
  // make the given fahrenheit variable equal the given celsius value
  // multiply the given celsius value by 9/5 then add 32
  // let fahrenheit = celsius * 9/5 + 32
  let fahrenheit = (Math.round(celsius * 9/5) + 32).toFixed(1)
  // return the variable fahrenheit as the answer
  return fahrenheit;
}


