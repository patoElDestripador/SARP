import utils from './modules/utils.module.js'
import login from './modules/login.module.js'
import dataController from './modules/dataController.module.js'

let actualPage = document.querySelector("title").text
let actualPageId = document.getElementById("pagName")
//let { value } = document.getElementById("pagName").attributes.getNamedItem("value")

//Section to addEnventListeners

//dataController.setPointsInCard(40)
//dataController.setCodersInList()

if(actualPage == "login"){


}

//dataController.listCodersByClan()
//Globales


document.getElementById("buttonIdLogin")?.addEventListener("click",()=>{
    login.validateLogin()
});

document.getElementById("redirectbuttonidToLogin")?.addEventListener("click",()=>{
    let { value } = actualPageId.attributes.getNamedItem("value")

    if (value != "01") {
        location.href = "./login.html";
    } else {
        location.href = "./html/login.html";
    }
})

document.getElementById("redirectbuttonidToIndex")?.addEventListener("click",()=>{
    location.href ="../index.html";
})


//button cambiar idioma
document.getElementById("buttonIdChangeLangEng")?.addEventListener("click",()=>{
    //funcion para cambiar lenguaje a ingles
});
document.getElementById("buttonIdChangeLangEs")?.addEventListener("click",()=>{
    //funcion para cambiar lenguaje a spanish
});
document.getElementById("idCorazon")?.addEventListener("click",()=>{
    //funcion secreta
});


