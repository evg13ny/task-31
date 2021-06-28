const status = document.querySelector('#status');
const btn = document.querySelector('.j-btn-test');

var xhr = new XMLHttpRequest();

// Функция, выводящая текст об ошибке
const error = () => {
    status.textContent = 'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    console.log('position', position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    var link = `https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=${latitude}&long=${longitude}`;
    sendRequest(link);
}

function sendRequest(link) {
    xhr.open('GET', link);
    xhr.send();
}

btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation не поддерживается вашим браузером';
    } else {
        status.textContent = 'Определение местоположения…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

xhr.onload = function () {
    if (xhr.status != 200) {
        console.log('Статус ответа: ', xhr.status);
    } else {
        var data = JSON.parse(xhr.response);
        status.textContent = `Временная зона: ${data.timezone}, местное время: ${data.date_time_txt}`;
    }
};