const mapDiv = document.getElementById('map');
const placeInput = document.getElementById('place_input');

let map;
let marker;
let autocomplete;
let placeTime;
let utcOffsetMinutes;
function initMap(){
	map = new google.maps.Map(mapDiv, {
	    center: { lat: 0, lng: 0 },
	    zoom: 1.75,
	});
	marker = new google.maps.Marker({
	  	position: { lat: 0, lng: 0 },
	    map: map,
	});
	initAutocomplete();
}
function initAutocomplete() {
	autocomplete = new google.maps.places.Autocomplete(placeInput);
	autocomplete.bindTo('bounds', map);
	autocomplete.addListener('place_changed', function(){
		document.getElementById('clock').style.display = 'block';
		const place = autocomplete.getPlace();
		//console.log(place);

		map.setCenter(place.geometry.location);
		map.setZoom(5);
		//map.fitBound(place.geometry.viewport);
		marker.setPosition(place.geometry.location);

		placeTime = place.address_components.map(component => component.long_name).join(', ');

		utcOffsetMinutes = place.utc_offset_minutes;
		//console.log(utcOffsetMinutes);

		setTime();
		setInterval(setTime, 1000);
	})
}

/*Clock*/

const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.second');
const timeInEl = document.querySelector('.timeIn');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setTime() {

	const timeZoneString = `Etc/GMT${utcOffsetMinutes <= 0 ? '+' : '-'}${Math.floor(Math.abs(utcOffsetMinutes / 60))}`;

	const options = {
	    timeZone: timeZoneString,
	    hour12: false,
	};

    
    const time = new Date().toLocaleString('en-US', options);
 /* Solucion a los +- .5 SOlO REDONDEA    const offsetHours = Math.floor(utcOffsetMinutes / 60);

// Calcular el desplazamiento de minutos
const offsetMinutes = utcOffsetMinutes % 60;

// Ajustar el desplazamiento de horas según los minutos
let roundedOffsetHours = offsetHours;
if (offsetMinutes >= 30) {
    roundedOffsetHours += 1; // Redondear hacia arriba
}

// Crear la cadena de zona horaria
	const sign = roundedOffsetHours >= 0 ? '+' : '-';
	const absOffsetHours = Math.abs(roundedOffsetHours);
	const timeZoneString = `Etc/GMT${sign}${absOffsetHours}`;

	// Configurar las opciones de fecha y hora
	const options = {
	    timeZone: timeZoneString,
	    hour12: false,
	};

	// Obtener la hora en la zona horaria especificada
	const time = new Date().toLocaleString('en-US', options);
*/
    const timeParts = time.split(", ");
    const dateParts = timeParts[0].split("/");
    const month = parseInt(dateParts[0], 10) - 1;
    const date = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const timeString = timeParts[1].split(":");
    const hours = parseInt(timeString[0], 10);
    const minutes = parseInt(timeString[1], 10);
    const seconds = parseInt(timeString[2], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hoursForClock = hours % 12 || 12;

    const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
    const minuteAngle = (minutes / 60) * 360;
    const secondAngle = (seconds / 60) * 360;

    hourEl.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    secondEl.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
    if (seconds === 0) {
        secondEl.style.display = 'block';
    } else if (seconds === 59) {
        secondEl.style.display = 'none';
    }
    timeInEl.innerHTML = `Time in ${placeTime}`;
    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    dateEl.innerHTML = `${days[new Date(year, month, date).getDay()]}, ${months[month]} ${date}`;
}
setTime()
setInterval(setTime, 1000)