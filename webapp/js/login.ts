"use strict"

function doLogin() {

    // FIXME (5) : may be an input type button element in HTML file
    (<HTMLButtonElement>document.getElementById('do_login')).disabled = true; // TODO (1) : timeout/error re-enable

    var message = {
        seq: 0, // TODO (5) : sequence management, retry control
        login: (<HTMLInputElement>document.getElementById('email-input')).value,
        pwd: (<HTMLInputElement>document.getElementById('password-input')).value
    }

    console.log('doLogin > ws://' + window.location.hostname + ':' + window.location.port + ' @ ' + message.login);

    var websocket = new WebSocket('ws://' + window.location.hostname + ':' + window.location.port, 'ocb1');

    websocket.onopen = function (e) {
        console.log('ws open');
        console.log(e);
        websocket.send(JSON.stringify(message));
    };

    websocket.onclose = function (e) {
        console.log('ws close');
        console.log(e);
    };

    websocket.onmessage = function (e) {
        console.log('ws msg');
        console.log(e.data);
    };

    websocket.onerror = function (e) {
        console.log('ws error ');
        console.log(e);
    };
}