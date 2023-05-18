let start = document.getElementById("start")
let loadingstart = document.getElementById("loadingStart")
document.addEventListener("DOMContentLoaded", ()=>{
        start.style.width = "0"
        loadingstart.style.left = "-200px"
    setTimeout(()=>{
        start.style.display = "none"
        loadingstart.style.display = "none"
    }, 2000)
    let screenBack = document.getElementById("screenBack")
    let inputLocation = document.getElementById("newLocation");
    let headerLinks = document.getElementById("headerLinks");
    let currentLink = document.getElementById("current");
    let xScrollFirst = document.getElementById("temp");
    let mainDisplay = document.getElementById("mainDisplay");
    let userLocation = "Dubai";
    let currentTime = new Date();
    let loadingHome = document.getElementById("loadingHomeForecast");
    let heading = document.getElementById("heading");
    let homeForecast;
    let API_KEY;
    let heatmap = false;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            userLocation = latitude + "," + longitude;
        })
    }
    let shiftY = Math.floor(0.3*(841 - window.innerHeight))
    let shiftX = Math.floor(0.45*(1707 - window.innerWidth))
    screenBack.style.height = (shiftY + 0.87*window.innerHeight) +  "px";
    screenBack.style.width = (shiftX + 0.87*window.innerWidth) + "px";
    screenBack.style.left = (0.065*window.innerWidth - shiftX/2)+"px";
    screenBack.style.top = (0.06*window.innerHeight - shiftY/2)+"px";
    
    function fetchLocationPage(location){
        fetch("https://api.weatherapi.com/v1/forecast.json?key=APIKEYHERE&q="+ location + "&days=2&aqi=no&alerts=no")
            .then(response => response.json())
            .then(object => {
                let {forecast:{forecastday}} = object
                let {hour} = forecastday[0]
                let {hour: hourNext} = forecastday[1]
                let {location:{name, country, localtime}} = object;
                let now = parseInt(localtime.split(" ").at(-1).split(":")[0])
                heading.innerHTML = "<div id='temperatureCurrent'>" + Math.round(hour[0].temp_c)+"°C</div><div><h1 id=\"Location\">"+ name+ ", </h1><h2>"+ country+ "</h2></div>\n" +
                    "                    <div id=\"rightClock\"><h1>"+ localtime.split(" ").at(-1) +"</h1>\n" +
                    "                        <div id=\"heatmapSwitch\">Show heatmap</div>";
                let heatButton = document.getElementById("heatmapSwitch");
                function addDiv(weatherInformation, tempC){
                    weatherInformation.setAttribute("data-value", tempC.toString())
                    weatherInformation.addEventListener("mouseenter", ()=>{
                        weatherInformation.style.backgroundColor = "rgba(" + 6*tempC+ ", "+ (180 - tempC) + ", "+ (255 - 6*tempC) + ", 1)"
                    })
                    weatherInformation.addEventListener("mouseleave", ()=>{
                        if(!heatmap) {
                            weatherInformation.style.backgroundColor = "rgba(0, 0, 0, 0)"
                        }
                    })
                    loadingHome.style.display = "none";
                    mainDisplay.appendChild(weatherInformation)
                }
                for(let i = 0; i < hour.length-now; i++){
                    let weatherInformation = document.createElement("div")
                    let description = hour[now+i].condition.text.split(" ").splice(0, 2).join(" ")
                    let tempC = Math.round(hour[now+i].temp_c);
                    weatherInformation.className = "homeForecast"
                    weatherInformation.style.backgroundImage = "url(" +hour[now+i].condition.icon + ")"
                    weatherInformation.innerHTML = "<h2>" + tempC + "°C</h2>" +
                        "<p>" + (now+i) + ":00<br>" + description + "</p>"
                    addDiv(weatherInformation, tempC)
                }
                for(let i = 0; i < now; i++){
                    let weatherInformation = document.createElement("div")
                    let description = hourNext[i].condition.text.split(" ").splice(0, 2).join(" ")
                    let tempC = Math.round(hourNext[i].temp_c);
                    weatherInformation.className = "homeForecast"
                    weatherInformation.style.backgroundImage = "url(" +hourNext[i].condition.icon + ")"
                    weatherInformation.innerHTML = "<h2>" + tempC + "°C</h2>" +
                        "<p>" + (i) + ":00<br>" + description + "</p>"
                    addDiv(weatherInformation, tempC)
                }
                heatButton.addEventListener("mousedown", ()=>{
                    if (!heatmap) {
                        for (let forecast of homeForecast) {
                            let tempC = parseInt(forecast.getAttribute("data-value"))
                            console.log(tempC)
                            forecast.style.backgroundColor = "rgba(" + 6 * tempC + ", " + (180 - tempC) + ", " + (255 - 6 * tempC) + ", 1)"
                            heatButton.textContent = "Hide heatmap"
                            heatmap = true
                        }
                    } else {
                        for (let forecast of homeForecast) {
                            let tempC = parseInt(forecast.getAttribute("data-value"))
                            forecast.style.backgroundColor = "rgba(0, 0, 0, 0)"
                            heatButton.textContent = "Show heatmap"
                            heatmap = false
                        }
                    }
                })
                homeForecast=document.getElementsByClassName("homeForecast");
            })
            .catch(error => console.log(error))
    }
    fetchLocationPage(userLocation);
    inputLocation.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            mainDisplay.innerHTML = "";
            loadingHome.style.display = "block"
            // setTimeout(()=>{fetchLocationPage(inputLocation.value)}, 3000)
            fetchLocationPage(inputLocation.value)
            loadingHome.style.display = "none"
        }
    })
    inputLocation.addEventListener("focus", ()=>{
        headerLinks.style.zIndex = "-10"
        headerLinks.style.left = "30%";
        currentLink.style.borderBottom = "2px solid rgba(255, 255, 255, 0)";
    })
    inputLocation.addEventListener("blur", ()=>{
        headerLinks.style.zIndex = "10"
        headerLinks.style.left = "15%";
        currentLink.style.borderBottom = "2px solid rgba(255, 255, 255, 1)";
    })
    xScrollFirst.addEventListener("wheel", (event)=>{
        if(event.deltaY > 0){
            xScrollFirst.scrollLeft += 10;
        } else if(event.deltaY < 0){
            xScrollFirst.scrollLeft -= 10;
        }
    })
})
