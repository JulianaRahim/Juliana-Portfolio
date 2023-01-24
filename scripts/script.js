/**
 * Set Location
 */
$('.input').on('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        setLocation($('.input').val());
        loadWeather();
    }
});

$('.input').focusout(() => {
    setLocation($('.input').val());
    loadWeather();
});

/**
 * Change location
 */
function changeLocation() {
    $('.field').css('display', 'block');
    $('#location').html('Location: ');
    $('#locationLevel').css('display', 'none');
}

/**
 * Retrieve time
 */
function getTime() {
    let date = new Date();
    let h = getHour();
    let m = date.getMinutes();
    let s = date.getSeconds();

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    if (h == 00) h = 12;

    $('#time').html(`Current Time: ${h}:${m}:${s} ${getSession(h)}`);
}

/**
 * Get Session
 */
function getSession() {
    const timezone = localStorage.getItem('timezone');
    const d = new Date();
    const h = d.getUTCHours() + parseInt(timezone);
    let s = 'AM';

    if (h > 11 && h < 24) {
        s = 'PM';
    }

    return s;
}

/**
 * Get Hour
 */
function getHour() {
    const timezone = localStorage.getItem('timezone');
    const d = new Date();
    let h = d.getUTCHours() + parseInt(timezone);
    if (h < 0) {
        h = 12 - h;
    }
    if (h == 0) {
        h = 12;
    }

    if (h > 23) {
        h = h - 24;
    }

    if (h > 12) {
        h = h - 12;
    }
    return h;
}

/**
 * Fetch API and loads weather
 */
function loadWeather() {
    let location;
    if (localStorage.getItem('location') != undefined) {
        location = localStorage.getItem('location');
    } else {
        location = 'Toronto, Ontario';
        localStorage.setItem('location', location);
    }
    $('#location').html('Location:  ' + location);
    let temperature, prediction;
    // Safe to store key with limit (free tier)
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1e77fb69d26c242a76402146e8484da8`
    )
        .then((response) => {
            response.json().then((data) => {
                if (response.status != 404) {
                    localStorage.setItem('timezone', data.timezone / 3600);
                    temperature = data.main.temp;
                    prediction = data.weather[0].main;
                    $('#temperature').html(
                        'Temperature:  ' + Math.round(temperature - 273.15) + ' °C'
                    );
                    $('#prediction').html('Prediction:  ' + prediction);
                    switch (prediction) {
                        case 'Sunny':
                        case 'Clear':
                            if (
                                (getHour() <= 6 && getSession() == 'AM') ||
                                (getHour() >= '18' && getSession() == 'PM')
                            ) {
                                document.getElementById('weatherIcon').src =
                                    './assets/img/moon.png';
                            } else {
                                document.getElementById('weatherIcon').src =
                                    './assets/img/sunny.png';
                            }
                            break;
                        case 'Thunderstorm':
                            document.getElementById('weatherIcon').src =
                                './assets/img/thunderstorm.png';
                            break;
                        case 'Clouds':
                            document.getElementById('weatherIcon').src = './assets/img/cloudy.png';
                            break;
                        case 'Rain':
                            document.getElementById('weatherIcon').src = './assets/img/raining.png';
                            break;
                        case 'Snow':
                            document.getElementById('weatherIcon').src = './assets/img/snowing.png';
                            break;
                        case 'Mist':
                            document.getElementById('weatherIcon').src = './assets/img/mist.png';
                            break;
                    }
                    setInterval(getTime, 1000);
                }
            });
        })
        .catch(() => {
            $('#weatherIcon').attr('src', './assets/img/error.png');
            $('#temperature').innerHTML = 'Temperature:  N/A';
            $('#prediction').innerHTML = 'Prediction:  N/A';
            $('#location').html('Location: N/A');
        });
}

/**
 * Set location in localStorage
 */
function setLocation(location) {
    localStorage.setItem('location', location);
}

/**
 * Load location
 */
function loadLocation() {
    let location;
    if (localStorage.getItem('location') != undefined) {
        location = localStorage.getItem('location');
    } else {
        location = 'Selangor, Klang';
    }

    $('.input').val(location);
}

loadLocation();

loadWeather();

setInterval(loadWeather, 600000);
