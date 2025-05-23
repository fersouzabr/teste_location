let map = L.map('map').setView([-23.55052, -46.633308], 14);
let circle;
let userMarker;
let alarmTriggered = false;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', function(e) {
    placeCircle(e.latlng);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateUserLocation, handleError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
    });
} else {
    alert("Geolocalização não é suportada pelo seu navegador.");
}

function placeCircle(location) {
    if (circle) {
        map.removeLayer(circle);
    }

    circle = L.circle(location, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 1000 // Raio em metros
    }).addTo(map);
}

function updateUserLocation(position) {
    const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);

    if (!userMarker) {
        userMarker = L.marker(userLocation).addTo(map);
    } else {
        userMarker.setLatLng(userLocation);
    }

    map.setView(userLocation, map.getZoom());

    checkLocation(userLocation);
}

function checkLocation(userLocation) {
    if (circle && userLocation.distanceTo(circle.getLatLng()) <= circle.getRadius()) {
        if (!alarmTriggered) {
            alarmTriggered = true;
            playAlarm();
        }
    } else {
        alarmTriggered = false;
    }
}

function playAlarm() {
    const audio = new Audio('alarm.mp3');
    audio.play();
}

function handleError(error) {
    console.error("Erro ao obter localização: ", error);
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informação de localização não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A requisição para obter a localização demorou muito.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}
