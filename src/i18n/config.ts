import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from './locales/en/translations.json';
import translationID from './locales/id/translations.json';
import Preferences from "../store/Preferences";

export const supportedLngs = {
    'en': 'English',
    'id': 'Indonesian',
}

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: Object.keys(supportedLngs),
    resources: {
        en: {
            translations: translationEN
        },
        id: {
            translations: translationID
        }
    },
    ns: ['translations'],
    defaultNS: 'translations'
})

Preferences.get('lang',lang => {
    if(lang)i18n.changeLanguage(lang)
})
i18n.on('languageChanged',lng => {
    Preferences.set('lang',lng,() => {
        // console.log('language changed',lng)
    })
})

export default i18n