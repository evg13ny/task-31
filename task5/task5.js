const wsUri = "wss://echo.websocket.org/";

const messageContent = document.querySelector('.messageContent');
const btnSend = document.querySelector('.j-btn-send');
const btnGeolocation = document.querySelector('.geoLocation');
const output = document.querySelector('.output');

btnSend.disabled = true;
btnGeolocation.disabled = true;

let websocket;

function appendMessage(messageOutput, type) {
  var p = document.createElement('p');
  p.setAttribute('id', type);
  p.appendChild(document.createTextNode(messageOutput));
  output.appendChild(p);
}

window.onload = (evt) => {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    console.log("CONNECTED");
    // для избежания ошибки блокируем кнопки до соединения
    btnSend.disabled = false;
    btnGeolocation.disabled = false;
  };
  websocket.onclose = function (evt) {
    console.log("DISCONNECTED");
    btnSend.disabled = true;
    btnGeolocation.disabled = true;
  };
  websocket.onmessage = function (evt) {
    if (evt.data.indexOf('https://www.openstreetmap.org') === -1) {
      appendMessage(
        evt.data, 'response'
      );
    }
  };
  websocket.onerror = function (evt) {
    appendMessage(
      "ERROR: " + evt.data, 'error'
    );
  };
}

btnSend.addEventListener('click', () => {
  const message = messageContent.value;
  appendMessage(message, 'request');
  messageContent.value = '';
  websocket.send(message);
});

const error = () => {
  appendMessage('Невозможно получить ваше местоположение', 'error');
}

const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const onRequest = `https://www.openstreetmap.org/#map=14/${latitude}/${longitude}`;
  appendMessage(onRequest, 'geoData');
  websocket.send(onRequest);
}

btnGeolocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    appendMessage('Geolocation не поддерживается вашим браузером', 'error');
  } else {
    console.log = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
});