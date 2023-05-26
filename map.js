map_div = document.querySelector("#map");
auto_div1 = document.querySelector(".autocomplete1");
auto_div2 = document.querySelector(".autocomplete2");
start_location = document.querySelector(".start_point");
end_location = document.querySelector(".end_point");
show_route = document.querySelector(".route");
currentCords = []
start_coords =[]
end_coords = []
let map;
bindPopup = (coord,place)=>{
    L.marker(coord,15).addTo(map)
    .bindPopup(place).openPopup();
}
getCoord = function (position){
    currentCords = [position.coords.latitude,position.coords.longitude]
    map = L.map('map').setView(currentCords,16)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}
navigator.geolocation.getCurrentPosition(getCoord,()=>{
    alert("Allow the location to get access")
})
// adding event listner to the start location input
autoComplete =  async (e)=>{
    auto_div=e.target.parentElement.lastElementChild;
    // autocomplete api call
    try{
        if ((e.target.value).length<=3){
            auto_div.style.display='none';
            return;
        }
        receivedData = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}&format=json&apiKey=1c13db46fb574c9fa08efb8342e27454`)
        data = await receivedData.json();
        auto_div.style.display="block";
        auto_div.innerHTML = "";
        if (data.results.length == 0) throw new Error("Can't Find the location");
        data.results.forEach(element => {
            html = 
                `<div class="auto1" lat=${element.lat} lng=${element.lon}>
                    <h4>${element.address_line1}</h4>
                    <p>${element.address_line2}</p>
                </div>`
                auto_div.insertAdjacentHTML('beforeend', html);
        }); 
    }
    catch(err){
            html = `<div>${err.message}</div>`
            auto_div.insertAdjacentHTML("beforeend",html);
    }
}
selectLocation = (e)=>{
    var selectedPlace = (e.target.closest(".auto1"));
    inputField = (selectedPlace.parentElement.parentElement.firstElementChild);
    inputField.value = selectedPlace.querySelector("h4").textContent;
    selectedPlace.parentElement.style.display="none";
    if (selectedPlace.parentElement.classList.contains("autocomplete1")){
        start_coords = [selectedPlace.getAttribute("lat"),selectedPlace.getAttribute("lng")];
        // bindPopup(start_coords,inputField.value);
    }
    else{
        end_coords=[selectedPlace.getAttribute("lat"),selectedPlace.getAttribute("lng")];
        // bindPopup(end_coords,inputField.value);
    }
}
var route;
showRoute = (start_coords,end_coords)=>{
    //Erase the old waypoints
    if(route != null){
        map.removeControl(route)
    }
    route = L.Routing.control({
        waypoints: [
            L.latLng(start_coords[0],start_coords[1]),
            L.latLng(end_coords[0],end_coords[1])
          ]
        });
        
    route.addTo(map);
}
start_location.addEventListener("input",autoComplete);
end_location.addEventListener("input",autoComplete);
auto_div1.addEventListener("click",selectLocation);
auto_div2.addEventListener("click",selectLocation);
show_route.addEventListener("click",(e)=>{
    e.preventDefault();
    if (start_coords.length == 0 || end_coords.length == 0){
        alert("Please Enter Valid locations to Find the Route");
        return;
    }
    
    showRoute(start_coords,end_coords);
});
// console.log(L.latLng(start_coords[0],start_coords[1]))