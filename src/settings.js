import lang from "./langs";

export default {
    version: '@@VERSION@@',
    appname: 'NoteBookJS',
    lang,

    options: {
        isFullPage: true,
        lang: 'en',
        langInfo: lang['en'],

        callbacks: {
            onLoadNotes: null,
        },
    },
};