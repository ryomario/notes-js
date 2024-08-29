import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translations: await import('./locales/en/translations.json')
        },
        id: {
            translations: await import('./locales/id/translations.json')
        }
    },
    ns: ['translations'],
    defaultNS: 'translations'
})

i18n.languages = ['en','id']

export default i18n