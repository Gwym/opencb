"use strict"


console.log('Entering fallback mode with fixed model (for offline users)');

var studydate: HTMLInputElement;
var birthdate: HTMLInputElement;

/*	var cd = new Date();
	$('birthdate').value = cd.getDate() + '/' + (cd.getMonth()+1) + '/' + cd.getFullYear();
	$('studydate').value = (cd.getMonth()+1) + '/' + cd.getFullYear(); */
window.addEventListener("load", function () {

	studydate = <HTMLInputElement>document.getElementById('studydate-input');
	birthdate = <HTMLInputElement>document.getElementById('birthdate-input');

	birthdate.valueAsDate = new Date('01/01/1980 12:00'); // TODO (2) : LocalDateTime
	studydate.valueAsDate = new Date();

	document.getElementById('button-render').addEventListener("click", function () {

		startLists(birthdate.valueAsDate, studydate.valueAsDate);

		return false;

	});

});

var startLists = function (bd: Date, cd: Date) {

	var ctnr = document.getElementById('render-area');
	ctnr.innerHTML = "";

	// get container width
	var cw = ctnr.offsetWidth;

	// add first month in all cases
	ctnr.appendChild(showCalendar(bd, cd));

	// get month width !!! css style dependent ?!!!
	var mw = (<HTMLDivElement>ctnr.firstChild).offsetWidth;
	// FIXME (1) : get css margin 
	mw += 5;

	var month_count = Math.floor(cw / mw);

	console.log('render width : ' + cw + ' month width ' + mw + ' => ' + month_count);

	// fill other months if space remains
	for (var i = 1; i < month_count; i++) {
		ctnr.appendChild(showCalendar(bd, cd));
	}

	// TODO (3) : responsive height ? adapt days in month to display size ?

	return false;
}

var showCalendar = function (bd: Date, cd: Date) {

	var p: HTMLParagraphElement;
	var div: HTMLDivElement;
   	var card = document.createElement('div');
   	var ca = document.createAttribute('class');
	ca.nodeValue = 'l_outer';
	card.setAttributeNode(ca);
	var da = false; // document.getElementById('dispall').checked; // display all days

   	var h: HTMLHeadingElement = document.createElement('h1');
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

    	/* ==============
	   	P 1 - 7 - 12 - 18 (- 23)
		E 1 - 8 - 15 - 22 (- 28)
		I 1 - 9 - 17 - 26 (- 33)
		================= */

    	/* var cdt = cd.getTime() / 1000;
	   	var bdt = bd.getTime() / 1000;*/
		var cdt = Date.UTC(cd.getFullYear(), cd.getMonth(), cd.getDate()) / 1000;
		var bdt = Date.UTC(bd.getFullYear(), bd.getMonth(), bd.getDate()) / 1000;
		var dif = Math.floor((cdt - bdt) / 86400); // days count from birthday to current date

		if (dif >= 0) {

			var cp = dif % 23;
			var ce = dif % 28;
			var ci = dif % 33;

			if ((cp == 0) || (cp == 6) || (cp == 11) || (cp == 17)) {
				p = document.createElement('p');
				//p.appendChild(document.createTextNode(i18n.long_form + ' (' + (cp+1) + ')'));
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
				//p.appendChild(document.createTextNode(i18n.long_mood + '(' + (ce+1) + ')'));
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
				//p.appendChild(document.createTextNode(i18n.long_int + ' (' + (ci+1) + ')'));
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
		//cd.setTime(cd.getTime() + 86400000);
   	}
   	return card;
}

var getMonthName = function (d: Date): string {

	var options: Intl.DateTimeFormatOptions = {
		month: "long"
	};

	// TODO (1) : browser auto lang or force wanted lang ?
	return d.toLocaleDateString([], options);
}