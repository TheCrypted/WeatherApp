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
    let pointerCompass = document.getElementById("pointerCompass");
    let UVdiv = document.getElementById("wid3");
    let airQualityPointer = document.getElementById("airQualityPointer");
    let humidityDiv = document.getElementById("wid4")
    let videoBackground = document.getElementById("testA")
    let video = document.getElementById("container")
    let loadingWidgets = document.getElementsByClassName("loadingWidget");
    let pointerAstro = document.getElementById("pointerAst");
    const link = document.querySelector("link[rel~='icon']");
    let matchupTab = document.getElementById("sportsCont")
    let homeForecast;
    let heatmap = false;
    function resizeWindow(){
        let shiftY = Math.floor(0.3 * (841 - window.innerHeight))
        let shiftX = Math.floor(0.45 * (1707 - window.innerWidth))
        screenBack.style.height = (shiftY + 0.87 * window.innerHeight) + "px";
        screenBack.style.width = (shiftX + 0.87 * window.innerWidth) + "px";
        screenBack.style.left = (0.065 * window.innerWidth - shiftX / 2) + "px";
        screenBack.style.top = (0.06 * window.innerHeight - shiftY / 2) + "px";
    }
    function rotateCompass(deg){
        pointerCompass.style.transform = "rotate(" + deg + "deg)"
    }
    function airQualUpdate(airObj){
        // console.log(airObj)
        // const AQI = airObj.co/9 + airObj.no2/0.08 + airObj.o3/0.065 + airObj.pm2_5/25 + airObj.pm10/50
        // console.log(AQI)
        let rotationDeg = airObj["gb-defra-index"]/10 * 180
        airQualityPointer.style.transform = "rotate(" + rotationDeg + "deg)"
    }
    function uvUpdate(uvIndex){
        let leftShift = Math.floor(uvIndex)/12 * 100
        UVdiv.innerHTML = "<div class=\"loadingWidget\"></div><h1><b>UV INDEX</b></h1><br>" + Math.floor(uvIndex) + "\n" +
            "                                <div id=\"uvIndex\">\n" +
            "                                    <div id=\"pointerUV\"></div>\n" +
            "                                </div>"
        let pointerUV = document.getElementById("pointerUV")
        pointerUV.style.left = leftShift + "%";
    }
    function humidityUpdate(humidity, expectedRain){
        humidityDiv.innerHTML = "<div class=\"loadingWidget\"></div><h1><b>HUMIDITY</b></h1><br>" + humidity + "%<br><h3><b>Expected rain:</b> " +  
            Math.round(expectedRain)+ " mm</h3>"
    }
    function loadWidget(){
        humidityDiv.innerHTML = "<div class=\"loadingWidget\"></div>"
        UVdiv.innerHTML = "<div class=\"loadingWidget\"></div>"
        for(let load of loadingWidgets){
            load.style.display = "block"
        }
    }
    function updateBackground(currentText, isMoonUp){
        console.log(currentText)
        let condition = currentText.split(" ")
        let day = isMoonUp===false ? "night" : "day"
        let conditionURL;
        if(condition.length === 1){
            switch (condition[0].toLowerCase()){
                case "clear":
                case "sunny":
                    conditionURL = "clear"
                    break;
                case "overcast":
                    conditionURL = "cloudy"
                    break;
                case "mist":
                    conditionURL = "mist"
                    break;
                default:
                    conditionURL = "sunny";
            }
        } else{
            switch (condition[1].toLowerCase()){
                case "cloudy":
                    conditionURL = "cloudy"
                    break;
                case "light":
                case "drizzle":
                case "or":
                case "rain":
                    conditionURL = "rain"
                    break;
                case "outbreaks":
                    conditionURL = "thunder"
                    break;
                default:
                    conditionURL = "sunny";
            }
        }
        videoBackground.src = "img/" + day + "/" + conditionURL + ".mp4";
        video.load()
    }
    function timeToMin(localTime) {
        return parseInt(localTime.split(":")[0])*60 + parseInt(localTime.split(":")[1]);
    }
    function updateAstro(astro, localTime){
        let localMin = timeToMin(localTime)
        let sunRise = astro.sunrise.split(" ")[0];
        let sunSet = astro.sunset.split(" ")[0]
        let sunRiseMin = timeToMin(sunRise)
        let sunSetMin = (parseInt(sunSet.split(":")[0])+12)*60 + parseInt(sunSet.split(":")[1])
        let halfNight = (24*60 - (sunSetMin-sunRiseMin))/2
        if(localMin<=sunSetMin && localMin>=sunRiseMin) {
            let movePercent = ((localMin-sunRiseMin)/(sunSetMin - sunRiseMin)) * 47;
            pointerAstro.style.left = (22 + movePercent) + "%";
            return true
        } else if(localMin >= sunSetMin){
            let movePercent = ((localMin - sunSetMin) / halfNight) * 25
            pointerAstro.style.left = (70 + movePercent) + "%";
        } else{
            let movePercent = ((localMin)/halfNight)*25
            pointerAstro.style.left = (movePercent) + "%";
        }
        return false
    }
    
    function teamAcronym(team){
        let teamNames = team.split(" ")
        console.log(teamNames.toString())
        if(teamNames.length === 1){
            return teamNames[0].slice(0, 3)
        } else if(teamNames.length === 2){
            if(teamNames[0].toUpperCase() === teamNames[0]){
                if(teamNames[0].length === 3){
                    return teamNames[0]
                } else {
                    return teamNames[0] + teamNames[1].charAt(0)
                }
            } else {
                return teamNames[0].charAt(0) + teamNames[1].slice(0, 2)
            }
        } else{
            let output = "";
            let count = 0;
            for( let word of teamNames){
                output = output + word.charAt(0)
                count++;
                if(count === 3){
                    return output;
                }
            }
        }
    }
    function matchElement(match, index){
        let matchup = document.createElement("div");
        matchup.id = "index"
        matchup.className = "matchup";
        matchup.innerHTML = "<div class=\"league\">" + match.tournament + ", " + match.country + "," + match.start.split(" ").at(0) + "</div>\n" +
            "                                <div class=\"teamA\"><b>" + teamAcronym(match.match.split(" vs ")[0]).toUpperCase() + "</b></div>\n" +
            "                                <div class=\"timeMatch\">" + match.start.split(" ").at(-1) + "</div>\n" +
            "                                <div class=\"teamB\"><b>" + teamAcronym(match.match.split(" vs ")[1]).toUpperCase() + "</b></div>"
        matchupTab.appendChild(matchup)
    }
    function updateMatchups(userLocation){
        fetch("http://api.weatherapi.com/v1/sports.json?key=" + API_KEY + "&q=" + userLocation)
            .then(response => response.json())
            .then(sports => {
                let {football: footballList} = sports;
                let {cricket: cricketList} = sports;
                let index = 0
                for(let match of footballList){
                    if (match.tournament === "Spanish La Liga" || match.tournament === "Premier League" || match.tournament === "Italian Serie A"){
                        matchElement(match, index)
                        index++;
                    }
                }
                for (let match of cricketList){
                    matchElement(match, index)
                    index++;
                }
            })
    }
    function fetchLocationPage(location){
        loadWidget()
        fetch("https://api.weatherapi.com/v1/forecast.json?key=" + API_KEY + "&q="+ location + "&days=2&aqi=yes&alerts=no")
            .then(response => response.json())
            .then(object => {
                let {current, forecast:{forecastday}} = object
                let {astro, hour} = forecastday[0]
                let {hour: hourNext} = forecastday[1]
                let {location:{name, country, localtime}} = object;
                let now = parseInt(localtime.split(" ").at(-1).split(":")[0])
                heading.innerHTML = "<div id='temperatureCurrent'>" + Math.round(current.temp_c)+"°C</div><div><h1 id=\"Location\">"+ name+ ", </h1><h2>"+ country+ "</h2></div>\n" +
                    "                    <div id=\"rightClock\"><h1>"+ localtime.split(" ").at(-1) +"</h1>\n" +
                    "                        <div id=\"heatmapSwitch\">Show heatmap</div>";
                let heatButton = document.getElementById("heatmapSwitch");
                link.href = current.condition.icon
                //update Astro Widget
                isSunUp = updateAstro(astro, localtime.split(" ").at(-1))
                //update background
                updateBackground(current.condition.text, isSunUp)
                //Updating all widgets
                rotateCompass(current.wind_degree)
                airQualUpdate(current.air_quality)
                uvUpdate(current.uv)
                loadingWidgets[0].style.display = "none"
                humidityUpdate(current.humidity, current.precip_mm)
                loadingWidgets[1].style.display = "none"
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            userLocation = latitude + "," + longitude;
            fetchLocationPage(userLocation);
        })
    }
    //Updating matchups
    updateMatchups(userLocation)
    let matchups = document.getElementsByClassName("matchup");
    let i = 0;
        matchupTab.addEventListener("wheel", (event) =>{
            event.preventDefault();
            if(event.deltaY > 0){
                let div = matchups[i+1]
                // console.log(div.className)
                div.scrollIntoView({behavior: "smooth"})
                i++;
            } else if(event.deltaY < 0){
                let div = matchups[i-1]
                div.scrollIntoView({behavior: "smooth"})
                i--;
            }
        })
    
    inputLocation.addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            mainDisplay.innerHTML = "";
            loadingHome.style.display = "block"
            fetchLocationPage(inputLocation.value)
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
        event.preventDefault()
        if(event.deltaY > 0){
            xScrollFirst.scrollLeft += 10;
        } else if(event.deltaY < 0){
            xScrollFirst.scrollLeft -= 10;
        }
    })
    window.addEventListener("resize", ()=>{
        resizeWindow()
    })
    let modeSwitches = document.getElementsByClassName("optionsCMZ")
    let darkMode = true
    for(let mode of modeSwitches){
        mode.addEventListener("mousedown", () => {
            if(darkMode){
                document.documentElement.classList.add("lightMode")
                darkMode = false
            } else{
                document.documentElement.classList.remove("lightMode")
                darkMode = true
            }
        })
    }
})
