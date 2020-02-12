// Variables
const formRevisit = document.getElementById("newRevisit");
const containerRevisit = document.getElementById("revisitasContainer");
const alertContent = document.getElementById("alertContent");

// Eventos
formRevisit.addEventListener("submit", setRevisit);
document.addEventListener("click", removeRevisit);
document.addEventListener("DOMContentLoaded", setItemsFromLocalStorage);

// Funciones

// Agregando la nueva revisita
// ===================================================================================================
function setRevisit(e){
    e.preventDefault();

    // Validando si el campo nombre y direccion están vacíos
    if( e.target[1].value.length == 0 || e.target[2].value.length == 0 ){
        alertContent.innerHTML = `
        <div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p>El campo "Nombre" y "Dirrección" no pueden estar vacíos</p>
        </div>
        `;
        return false;
    }

    // Validando si el campo nombre tienen un valor numerico
    let haveNumber = stringValidation(e.target[1].value);

    if( haveNumber == 1 ){
        alertContent.innerHTML = `
        <div class="uk-alert-danger" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p>El campo "Nombre" no puede inlcuir valores numericos ni caracteres especiales</p>
        </div>
        `;
        return false;
    }

    // Validando si el item ya se encuentra guardado en el local storage
    let key = convertToKey(e.target[1].value);

    for(let i = 0; i < localStorage.length; i++){

        if( localStorage.key(i) === key ){
            alertContent.innerHTML = `
            <div class="uk-alert-danger" uk-alert>
                <a class="uk-alert-close" uk-close></a>
                <p>Este item ya está guardado en la memoria del navegador. Por favor, elija otro nombre para guardar su revisita</p>
                <p><strong>Un tip: Si por casualidad quiere guardar otra revisita con un nombre que ya esta guardado en el sistema, coloque otro dato en el nombre como distintivo: ej. barrio o localidad</strong></p>
            </div>
            `;
            return false;
        }

    }

    // Capturando los valores del formulario
    const dataItem = {
        name: e.target[1].value,
        publication: e.target[3].value,
        address: e.target[2].value,
        annotations: e.target[4].value
    }

    setItemToContainer(dataItem);
    setItemToLocalStorage(dataItem);
    UIkit.modal(e.target.parentElement.parentElement).hide();
    formRevisit.reset();
    removeBackgroundToContainer();
}

function bakcgroundToContainer(){

    if( localStorage.length === 0 ){
        setBackgroundToContainer();
    }else{
        return false;
    }

}

// Recorriendo los items guardados en el local storage
function setItemsFromLocalStorage(){

    if( localStorage.length === 0 ){
        setBackgroundToContainer();
    }else{

        for(let i = 0; i < localStorage.length; i++){

            key = localStorage.key(i);
            object = JSON.parse(localStorage.getItem(key));

            setItemToContainer(object);

            console.log(object);

        }

    }

}

// Añadir el background en la app
function setBackgroundToContainer(){
    let container = document.getElementById("container");
    container.classList.add("bg-not-content");
}

// Set the background on the app
function removeBackgroundToContainer(){
    let container = document.getElementById("container");
    container.classList.remove("bg-not-content");
}

// Creando el item card del contenedor para guardar los datos
function setItemToContainer(object){
    const div = document.createElement("div");
    div.innerHTML = `<div class="uk-card uk-card-default item-revisit">
                        <div class="uk-card-header uk-padding-small uk-flex uk-flex-between uk-flex-top">
                            <div>
                                <h3 class="uk-card-title uk-margin-remove">${object.name}</h3>
                            </div>
                            <div>
                                <img src="icons/icon-close.svg" id="removeButton"/>
                                <!-- <button id="removeButton" class="uk-button uk-button-danger" type="button">X</button> -->
                            </div>
                        </div>

                        <div class="uk-card-body uk-padding-small">
                            <div>
                                <p><span class="bold-word">Publicación:</span> ${object.publication}</p>
                                <p><span class="bold-word">Dirección:</span> ${object.address}</p>
                                <p><span class="bold-word">Anotaciones:</span> ${object.annotations}</p>
                            </div>
                        </div>
                    </div>
                    `;
    containerRevisit.appendChild(div);
    const removeButton = document.querySelector("#removeButton");
    removeButton.addEventListener("click", removeRevisit);
}

// Guardando el item en el local storage
function setItemToLocalStorage(object){

    let key = convertToKey(object.name);

    const data = {
        name: object.name,
        publication: object.publication,
        address: object.address,
        annotations: object.annotations 
    }

    localStorage.setItem(key, JSON.stringify(data));
}

// Borrar la revisita
function removeRevisit(e){
    if(e.target.id === "removeButton"){
        e.target.parentElement.parentElement.parentElement.parentElement.remove();
        
        let key = convertToKey(e.target.parentElement.previousSibling.previousSibling.children[0].textContent);

        localStorage.removeItem(key);
        bakcgroundToContainer();
    }
}

// Quitar los acentos al nombre recibido
function removeAccent(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}

// Funcion que convierte nombre de persona a key para localStorage
function convertToKey(string){
    let word = string.toLowerCase();
    let wordLowerCase = word.replace(" ", "-");
    let key = removeAccent(wordLowerCase);
    return key;
}

// Funcion que valida si la cadena recibida tiene un numero
function stringValidation(string){
    var characters = "0123456789{}~`|/*+-#$%^\"&@";
    for(i=0; i<string.length; i++){
        if (characters.indexOf(string.charAt(i),0)!=-1){
            return 1;
        }
    }
   return 0;
}