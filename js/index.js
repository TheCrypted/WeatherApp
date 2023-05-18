document.addEventListener("DOMContentLoaded", ()=>{
    let inputLocation = document.getElementById("newLocation")
    let headerLinks = document.getElementById("headerLinks")
    let currentLink = document.getElementById("current")
    let xScrollFirst = document.getElementById("temp")
    let mainDisplay = document.getElementById("mainDisplay")
    let userLocation = "Dubai"
    let currentTime = new Date()
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            userLocation = latitude + "," + longitude;
        })
    }
    //add mechanism for adding all the divs from the given information using fetch request
    fetch("https://api.weatherapi.com/v1/forecast.json?key=INSERTKEYHERE&q="+ userLocation + "&days=1&aqi=no&alerts=no")
        .then(response => response.json())
        .then(object => {
            let {forecast:{forecastday}} = object
            let {hour} = forecastday[0]
            let now = currentTime.getHours()
            for(let i = 0; i < hour.length-now; i++){
                let weatherInformation = document.createElement("div")
                weatherInformation.className = "homeForecast"
                weatherInformation.style.backgroundImage = "url(" +hour[now+i].condition.icon + ")"
                // mainDisplay.appendChild(weatherInformation)
            }
            // for(let step of hour){
            //     let weatherInformation = document.createElement("div")
            //     weatherInformation.className = "homeForecast"
            //     weatherInformation.style.backgroundImage = "url(" +step.condition.icon + ")"
            //     mainDisplay.appendChild(weatherInformation)
            // }
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
