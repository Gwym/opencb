"use strict"

var version = 1;
// use an interface to be warned on missing translations

module I18n {
  export interface Corpus {
    not_implemented: string,
    short_form: string,
    short_mood: string,
    short_int: string
  }
}

var i18n_en: I18n.Corpus = {
  not_implemented: 'Not implemented :',
  short_form: 'F',
  short_mood: 'M',
  short_int: 'I'
}

var i18n_fr: I18n.Corpus = {
  not_implemented: 'Non implementé :',
  short_form: 'P',
  short_mood: 'E',
  short_int: 'I'
}

var language = window.navigator.userLanguage || window.navigator.language;

var i18n: I18n.Corpus;

if (language.indexOf('fr') > -1) {
  i18n = i18n_fr;
}
else {
  i18n = i18n_en; // default language 
}

console.log('Setting language to ' + language)


