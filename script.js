const startBtn = document.getElementById("get-started");
const preload = document.getElementById('preload');
const onload = document.getElementById('onload');
const showmap = document.getElementById('showMap');
const div1 = document.getElementById('div1');
const moreInfo = document.getElementById('moreInfo');
const addressInput = document.getElementById('address');
const output = document.getElementById('output');

let IPAddress = null;
let userInformation = null;

document.addEventListener("DOMContentLoaded", function () {
    // Fetch the IP address from the API
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            // Display the IP address on the screen
            IPAddress = data.ip;
            document.getElementById("ip-address").textContent = `Your Current IP Address is: ${IPAddress}`;
        })
        .catch(error => {
            console.error("Error fetching IP address:", error);
        });
});

// handle when user clicks the start btn, 
startBtn.addEventListener('click', () => {
    preload.style.display = 'none';
    onload.style.display = 'block';

    // make a request to get user information
    fetch(`https://ipapi.co/${IPAddress}/json/`)
        .then(response => response.json())
        .then(data => {
            userInformation = data;
            // now render the necessary data to div 1
            renderDiv1();
            // display map based on lat and longitude
            showmap.innerHTML += `<iframe src="https://maps.google.com/maps?q=${userInformation.latitude}, ${userInformation.longitude}&z=15&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe>`;

            // render more info div elemenet
            rendnerMoreInfo();

            // now make a request to get list of post offices using pincode.
            getPostOffices();

        }).catch(error => {
            console.log(error);
        })

})

function renderDiv1(){
    div1.innerHTML += `
        <p>IP Address: <span class="white">${IPAddress}</span></p>
        <div class="flexItem">
            <p>Lat: <span class="white">${userInformation.latitude}</span></p>
            <p>City: <span class="white">${userInformation.city}</span></p>
            <p>Organization: <span class="white">${userInformation.org}</span></p>
        </div>
        <div class="flexItem">
            <p>Lon: <span class="white">${userInformation.longitude}</span></p>
            <p>Region: <span class="white">${userInformation.region}</span></p>
            <p>Version: <span class="white">${userInformation.version}</span></p>
        </div>
    `;
}

function rendnerMoreInfo(){
    const dateTime = new Date().toLocaleString(userInformation.country_code, { timeZone: userInformation.timezone });
    moreInfo.innerHTML = `
        <h1>More Information About You</h1>
        <p>Timezone: <span class="white">${userInformation.timezone}</span></p>
        <p>Date And Time: <span class="white">${dateTime}</span></p>
        <p>Pincode: <span class="white">${userInformation.postal}</span></p>
        <p>Message: <span class="white"></span></p>
    `;
}

let PostOffice = [];
// fetching post offices
function getPostOffices(){
    fetch(`https://api.postalpincode.in/pincode/${userInformation.postal}`)
    .then(response => response.json())
    .then(data => {
        PostOffice = data[0].PostOffice;
        // render the post offices
        renderPostOffice(PostOffice);
    })
    .catch(error => {
        console.log(error)
    })
}

function renderPostOffice(PostOffice){
    output.innerHTML = '';
    PostOffice.map(office => {
        output.innerHTML += `
        <div class="box">
            <p>Name: ${office.Name}</p>
            <p>Branch Type: ${office.BranchType}</p>
            <p>Delivery Status ${office.DeliverStatus}</p>
            <p>District: ${office.District}</p>
            <p>Division: ${office.Division}</p>
        </div>
    `;
    })

}


addressInput.addEventListener('input', (event) => {
    if(event.target.value.trim()){
        // filter the data by name
        const filteredPostOffice = PostOffice.filter(office => {
            return office.Name.toLowerCase().includes(event.target.value.trim().toLowerCase());
        });

        renderPostOffice(filteredPostOffice);
    }else{
        renderPostOffice(PostOffice)
    }
});