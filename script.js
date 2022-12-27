'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function(data) {
    const html = `<article class="country">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population/1000000).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[Object.keys(data.languages)[0]]}</p>
            <p class="country__row"><span>💰</span>${data.currencies[Object.keys(data.currencies)[0]].name}</p>
          </div>
        </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1; 
}

const getCountryData = function(country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`).then(response => {
        // console.log(response)
        if(!response.ok)
            throw new Error(`Country not found Status: ${response.status}`);

        return response.json();
    }).then(data => {
        console.log(data[0]);
        renderCountry(data[0]);
    }).catch(err => {
        console.error(err);
        renderError(err);
    })
}

const getPosition = function () {
	return new Promise(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	})
}

const whereIsIt = function(lat, lng) {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`).then(response => {
		// console.log(response);
		if(!response.ok) throw new Error(`Location not found Status: ${response.status}`)

		return response.json();
	}).then(data => {
		// console.log(data);
		if(data.error) throw new Error(`${data.error.description}`);

		console.log(`You are in ${data.region}, ${data.country}`);
		getCountryData(`${data.country}`);
	}).catch(err => renderError(err));
}

const whereAmI = function() {
    getPosition().then(pos => {
        console.log(pos);
        const {latitude: lat, longitude: lng} = pos.coords;

        whereIsIt(`${lat}`, `${lng}`);
    }).catch(err => console.log(err))
}

btn.addEventListener('click', whereAmI);