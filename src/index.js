import Notebook from "./notebook";

document.addEventListener('DOMContentLoaded', function(e) {
    const notebook = Notebook.initialize(this.getElementById('notebook'),{
        lang: 'id'
    });
    // console.log(notebook._settings.lang);
    // console.log(notebook._settings.langInfo);

    // setTimeout(() => {
    //     notebook.Destroy();
    // },10000);
});