"use strict";
var version = 1;
var i18n_en = {
    not_implemented: 'Not implemented :',
    short_form: 'F',
    short_mood: 'M',
    short_int: 'I'
};
var i18n_fr = {
    not_implemented: 'Non implementé :',
    short_form: 'P',
    short_mood: 'E',
    short_int: 'I'
};
var language = window.navigator.userLanguage || window.navigator.language;
var i18n;
if (language.indexOf('fr') > -1) {
    i18n = i18n_fr;
}
else {
    i18n = i18n_en;
}
console.log('Setting language to ' + language);
"use strict";
function doLogin() {
    document.getElementById('do_login').disabled = true;
    var message = {
        seq: 0,
        login: document.getElementById('email-input').value,
        pwd: document.getElementById('password-input').value
    };
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
"use strict";
console.log('Entering fallback mode with fixed model (for offline users)');
var studydate;
var birthdate;
window.addEventListener("load", function () {
    studydate = document.getElementById('studydate-input');
    birthdate = document.getElementById('birthdate-input');
    birthdate.valueAsDate = new Date('01/01/1980 12:00');
    studydate.valueAsDate = new Date();
    document.getElementById('button-render').addEventListener("click", function () {
        startLists(birthdate.valueAsDate, studydate.valueAsDate);
        return false;
    });
});
var startLists = function (bd, cd) {
    var ctnr = document.getElementById('render-area');
    ctnr.innerHTML = "";
    var cw = ctnr.offsetWidth;
    ctnr.appendChild(showCalendar(bd, cd));
    var mw = ctnr.firstChild.offsetWidth;
    mw += 5;
    var month_count = Math.floor(cw / mw);
    console.log('render width : ' + cw + ' month width ' + mw + ' => ' + month_count);
    for (var i = 1; i < month_count; i++) {
        ctnr.appendChild(showCalendar(bd, cd));
    }
    return false;
};
var showCalendar = function (bd, cd) {
    var p;
    var div;
    var card = document.createElement('div');
    var ca = document.createAttribute('class');
    ca.nodeValue = 'l_outer';
    card.setAttributeNode(ca);
    var da = false;
    var h = document.createElement('h1');
    h.appendChild(document.createTextNode(getMonthName(cd) + ' ' + cd.getFullYear()));
    card.appendChild(h);
    cd.setDate(1);
    var c_month = cd.getMonth();
    var dn = new Array("Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa");
    for (var i = 0; i < 31; i++) {
        if (cd.getMonth() != c_month)
            break;
        div = document.createElement('div');
        p = document.createElement('p');
        p.appendChild(document.createTextNode(dn[cd.getDay()] + ' ' + cd.getDate()));
        ca = document.createAttribute('class');
        ca.nodeValue = 'd';
        p.setAttributeNode(ca);
        div.appendChild(p);
        var cdt = Date.UTC(cd.getFullYear(), cd.getMonth(), cd.getDate()) / 1000;
        var bdt = Date.UTC(bd.getFullYear(), bd.getMonth(), bd.getDate()) / 1000;
        var dif = Math.floor((cdt - bdt) / 86400);
        if (dif >= 0) {
            var cp = dif % 23;
            var ce = dif % 28;
            var ci = dif % 33;
            if ((cp == 0) || (cp == 6) || (cp == 11) || (cp == 17)) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_form + '(' + (cp + 1) + ')'));
                ca = document.createAttribute('class');
                ca.nodeValue = 'p';
                p.setAttributeNode(ca);
                div.appendChild(p);
            }
            else if (da) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_form + '(' + (cp + 1) + ')'));
                div.appendChild(p);
            }
            if ((ce == 0) || (ce == 7) || (ce == 14) || (ce == 21)) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_mood + '(' + (ce + 1) + ')'));
                ca = document.createAttribute('class');
                ca.nodeValue = 'e';
                p.setAttributeNode(ca);
                div.appendChild(p);
            }
            else if (da) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_mood + '(' + (ce + 1) + ')'));
                div.appendChild(p);
            }
            if ((ci == 0) || (ci == 8) || (ci == 16) || (ci == 25)) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_int + '(' + (ci + 1) + ')'));
                ca = document.createAttribute('class');
                ca.nodeValue = 'i';
                p.setAttributeNode(ca);
                div.appendChild(p);
            }
            else if (da) {
                p = document.createElement('p');
                p.appendChild(document.createTextNode(i18n.short_int + '(' + (ci + 1) + ')'));
                div.appendChild(p);
            }
        }
        card.appendChild(div);
        cd.setDate(cd.getDate() + 1);
    }
    return card;
};
var getMonthName = function (d) {
    var options = {
        month: "long"
    };
    return d.toLocaleDateString([], options);
};
console.log('menu >');
var links = document.querySelectorAll('.sidebar-links > div > h4');
var menus = document.querySelectorAll('.sidebar-links > div');
var sections = document.querySelectorAll('.main-content > section');
var toggleSelected = function (e) {
    for (var i = 0; i < menus.length; i++) {
        menus[i].className = '';
    }
    e.target.parentNode.className = 'selected';
    console.log('selected' + e.target);
};
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', toggleSelected);
}
for (var i = 0; i < sections.length; i++) {
    sections[i].className = 'hidden';
}
var login = document.getElementById('do_login');
login.addEventListener('click', function () {
    console.log('TODO login');
    doLogin();
});
