map_div = document.querySelector("#map");
auto_div = document.querySelector(".autocomplete");
currentCords = []
getCoord = function (position){
    // console.log(position);
    currentCords = [position.coords.latitude,position.coords.longitude]
    // console.log(position.coords)
    const map = L.map('map').setView(currentCords,16)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    
}
navigator.geolocation.getCurrentPosition(getCoord,()=>{
    alert("Allow the location to get access")
})
// getLocation = function(){
//     fetch("https://api.geoapify.com/v1/geocode/search?text=Amma's kottigepalya&format=json&apiKey=1c13db46fb574c9fa08efb8342e27454")
//     .then(data=>{
//         return data.json()
//     })
//     .then(data=>console.log(data));
// }
// getLocation();
// adding event listner to the start location input
start_location = document.querySelector(".start_point");
autoComplete =  async (e)=>{
    if((e.target.value).length>3){
        receivedData = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}&limit=5&format=json&apiKey=1c13db46fb574c9fa08efb8342e27454`)
        data = await receivedData.json();
        // auto_div.style.display = "block";
        data.results.forEach(element => {
            console.log(element)
            // let htmlElement = `<div>${element.}</div>`;
            // auto_div.insertAdjacentHTML=("beforeend",htmlElement);

        });
    }
}
start_location.addEventListener("input",autoComplete);
