
import crudModule from "./crud.module.js";
import utils from "./utils.module.js";

class DataControllerModule {
  constructor(){}

  async listCodersByClan() {
    await crudModule.getClans()
  }
  async setPointsInCard(id){
    let validation = !document.getElementById("totalPtsPositive") ? 0 : true
    if(validation){
      let {positivePoints,negativePoints,total} = await crudModule.getOnlyRiwiPointsByUserid(id);
      document.getElementById("totalPtsPositive").innerText = positivePoints
      document.getElementById("totalPtsNegative").innerText = negativePoints
      document.getElementById("totalPtsAvailable").innerText = total
    }
  }
  
  // Listar Coders
  async  setCodersInList() {
    let tBody = document.getElementById("historyCoders");
    let coders = await crudModule.getCoders();
    let contador = 1;

    let newCoders = [];

    for (let element of coders) {
        let dataEmail = await crudModule.getUserById(element.id);
        let { total } = await crudModule.getOnlyRiwiPointsByUserid(element.id);
        let clans = await crudModule.getClansById(element.id_clan);
        let newInfo = {
            contador,
            document: element.document,
            name: element.name,
            otracosa: clans[0].name,
            email: dataEmail[0].email,
            total,
            id: element.id
        };
        newCoders.push(newInfo);
        contador++;
    }
    console.log(newCoders.length)
    tBody.innerHTML = "";
    await Promise.all(newCoders.map(async (element) => {
        tBody.innerHTML += `
        <tr>
            <th scope="row" class="text-center">${element.contador}</th>
            <td class="text-center">${element.document}</td>
            <td>${element.name}</td>
            <td>${element.email}</td>
            <td class="text-center">${element.otracosa}</td>
            <td class="fw-bold text-center">${element.total}</td>
            <td class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 20 20"><g><path d="M11.937 4.5H8.062A2.003 2.003 0 0 1 10 2a2.003 2.003 0 0 1 1.937 2.5Z"/><path d="M4.5 5.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2h-11Z"/><path fill-rule="evenodd" d="M14.5 18.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9Zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM10 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 10 8Zm-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7Z" clip-rule="evenodd"/></g></svg>                                
                <button type="button" class="editBtn" data-id="${element.id}" id="unapruebamas""><svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg></button>
            </td>
        </tr>
        `;

        document.querySelectorAll('.editBtn').forEach(button => {
          button.addEventListener('click', (event) => {
              let id = event.currentTarget.getAttribute('data-id');
              console.log('mi pai el id ', id,"cargoo");
          });
      });
      
    }));

    console.log('todo allriigt como dicen por ahi');
}


  // Listar Trainers
async setTrainerInList() {
  let tBody = document.getElementById("historyTrainers")
  let trainers = await crudModule.getTrainers()
  let contador = 1;
  
  for (let element of trainers) {
    let dataArea = await crudModule.getAreaById(element.id); 
    //let areaName = dataArea[0].name;

    tBody.innerHTML += `
    <tr>
      <th scope="row" class="text-center">${contador}</th>
      <td class="text-center">${element.document}</td>
      <td>${element.name}</td>
      <td>${areaName}</td>
      <td class="fw-bold text-center">${element.points_available}</td>
      <td class="text-center">
        <!-- Aquí va tu SVG -->
      </td>
    </tr>
    `;
    contador++;
  }
}
  // Editar Coders
  // Se envia la información al formulario
  async editCoders (id=8){
    let dataCoder = await crudModule.getCodersById(id)
    let dataUser = await crudModule.getUserById(dataCoder[0].id_user)
    let dataClan = await crudModule.getClansById(dataCoder[0].id_clan)
    let dataPermits = await crudModule.getPermitsByIdUSer(dataCoder[0].id)
    
    document.getElementById("documentId").value = (dataCoder[0].document)
    document.getElementById("name").value = dataCoder[0].name
    document.getElementById("email").value = dataUser.email
    document.getElementById("password").value = dataUser.password
    document.getElementById("imgUser").value = dataUser.img
    document.getElementById("idSelectClan").value = dataClan[0].id
    document.getElementById("idSelectRol").value = dataPermits[0].id_rol
  }
  // Se envia la información al la base de datos
  async updateCoders(){
    let documentId = document.getElementById("documentId").value
    let idUser = await crudModule.getCodersByDocument(documentId)
    let user = idUser[0].id_user
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let imgUser = document.getElementById("imgUser").value
    let clan = document.getElementById("idSelectClan").value
    let rol = document.getElementById("idSelectRol").value
    
    let dataCoder = { 
      id: idUser.id, 
      id_user:  user,
      id_clan: clan, 
      name: name, 
      document: documentId,
      date_created: idUser.date_created,
      date_retirement: idUser.date_retirement,
      status: idUser.status
    };

    let dataUser = {  
      id: idUser.id,
      email: email, 
      password: password, 
      img: imgUser 
    };

    let dataPermit = { 
      id: idUser.id,
      id_user: idUser.id,
      id_rol: rol,
      date_created: idUser.date_created,
      status: idUser.status
    };

    await crudModule.updateCodersById(dataCoder,idUser[0].id);
    await crudModule.updateUsersById(dataUser,idUser[0].id_user)
    await crudModule.updatePermitById(dataPermit,idUser);


    document.getElementById("documentId").value = ""
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("imgUser").value = ""
    document.getElementById("idSelectClan").value = ""
    document.getElementById("idSelectRol").value = ""
  }
  
  // Editar Trainers
  // Se envia la información al formulario
  async editTrainer (id=222){
    let dataTrainer = await crudModule.getTrainersById(id)
    let dataUser = await crudModule.getUserById(dataTrainer[0].id_user)
    let dataArea = await crudModule.getAreaById(dataTrainer[0].id_area)
    let dataPermits = await crudModule.getPermitsByIdUSer(dataTrainer[0].id_user)
    console.log(dataTrainer)
    
    document.getElementById("documentId").value = (dataTrainer[0].document)
    document.getElementById("name").value = dataTrainer[0].name
    document.getElementById("email").value = dataUser.email
    document.getElementById("password").value = dataUser.password
    document.getElementById("imgUser").value = dataUser.img
    document.getElementById("idSelectArea").value = dataArea.id
    document.getElementById("idSelectRol").value = dataPermits[0].id_rol
  }
  // Se envia la información al la base de datos
  async updateTrainers(){
    let documentId = document.getElementById("documentId").value
    let idTrainer = await crudModule.getTrainerByDocument(documentId)
    let user = idTrainer[0].id_user
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let imgUser = document.getElementById("imgUser").value
    let area = document.getElementById("idSelectArea").value
    let rol = document.getElementById("idSelectRol").value
    
    let datatrainer = { 
      id: idTrainer.id, 
      id_user:  user,
      id_area: area, 
      document: documentId,
      name: name, 
      date_created: idTrainer.date_created,
      date_retirement: idTrainer.date_retirement,
      points_available: idTrainer.points_available,
      status: idTrainer.status
    };

    let dataUser = {  
      id: idTrainer.id,
      email: email, 
      password: password, 
      img: imgUser 
    };

    let dataPermit = { 
      id: idTrainer.id,
      id_user: idTrainer.id,
      id_rol: rol,
      date_created: idTrainer.date_created,
      status: idTrainer.status
    };

    await crudModule.updateTrainersById(datatrainer,idTrainer[0].id);
    await crudModule.updateUsersById(dataUser,idTrainer[0].id_user)
    await crudModule.updatePermitById(dataPermit,idTrainer);


    document.getElementById("documentId").value = ""
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("imgUser").value = ""
    document.getElementById("idSelectArea").value = ""
    document.getElementById("idSelectRol").value = ""
  }


  // Profile coders
  // El idUserLogin se debe traer del session storage 
  async setInformationCoder(idUserLogin) {
    
    let tBody = document.getElementById("codersHistoryPoints")
    let contador = 1;
    let puntosPositivos = 0;
    let puntosNegativos = 0;

    let dataUser = await crudModule.getUserById(idUserLogin)
    let dataPermits  = await crudModule.getPermitsByIdUSer(dataUser.id) // Revisar
    let dataRol = await crudModule.getRolByIdUSer(dataPermits[0].id_rol) // Revisar
    let dataUsersProfile = await crudModule.getCodersById(idUserLogin)
    let dataPoints = await crudModule.getRiwiPointsByUserid(dataUsersProfile[0].id)
    let dataClans = await crudModule.getClansById(dataUsersProfile[0].id_clan)
    this.setPointsInCard(dataUsersProfile[0].id)
    // Se completan los datos en la card del perfil
    document.getElementById("emailUser").placeholder  = dataUser.email
    document.getElementById("imgUser").setAttribute ("src", dataUser.img)
    document.getElementById("rolUser").innerText = dataRol[0].name
    document.getElementById("nameUser").innerText = dataUsersProfile[0].name
    document.getElementById("documentId").placeholder  = dataUsersProfile[0].document
    document.getElementById("clanUser").placeholder = dataClans[0].name
    
    // Se completan los datos en la el historico de puntos
    for (let element of dataPoints){
      let dataTrainer = await crudModule.getTrainersById(element.id_trainers)
      console.log(element.id_trainers)
      console.log(dataTrainer)
      puntosPositivos = parseInt(element.positive_point) || 0;
      puntosNegativos = parseInt(element.negative_point) || 0;
      
      tBody.innerHTML +=`
      <tr>
        <th scope="row" class="text-center">${contador}</th>
        <td class="fw-bold text-center">${element.date_created}</td>
        <td>${element.specific_reason}</td>
        <td>${element.observation}</td>
        <td>${dataTrainer[0].name}</td>
        <td class="fw-bold text-center">${puntosPositivos + puntosNegativos}</td>
      </tr>
      `
      contador ++;
    }
  }
  
  // Profile Trainer
  // El idUserLogin se debe traer del session storage 
  async setInformationTrainer(user) {   
    let idUserLogin = user.rol
    this.setPointsInCard(idUserLogin) 
    let tBody = document.getElementById("informationTrainer")
    let contador = 1;
    let puntosPositivos = 0;
    let puntosNegativos = 0;

    let dataUser = await crudModule.getUserById(idUserLogin)
    console.log(dataUser)
    let dataPermits  = await crudModule.getPermitsByIdUSer(dataUser.id) //Revisar
    let dataRol = await crudModule.getRolByIdUSer(dataPermits[0].id_rol) // Revisar
    let dataUsersProfile = await crudModule.getTrainersById(idUserLogin)
    console.log(dataUsersProfile)
    let dataArea = await crudModule.getAreaById(dataUsersProfile[0].id_areas)
    let dataPoint = await crudModule.getRiwiPointsByTrainer(dataUsersProfile[0].id)
    
    // Se completan los datos en la card del perfil
    document.getElementById("emailUser").placeholder  = dataUser.email
    document.getElementById("imgUser").setAttribute ("src", dataUser.img)
    document.getElementById("rolUser").innerText = dataRol[0].name
    document.getElementById("nameUser").innerText = dataUsersProfile[0].name
    document.getElementById("documentId").placeholder  = dataUsersProfile[0].document
    document.getElementById("materiaUser").placeholder = dataArea.name
    
    // Se completan los datos en la el historico de puntos
    for (let element of dataPoint){
      let dataCoder = await crudModule.getCodersById(element.id_coders);
      puntosPositivos = parseInt(element.positive_point) || 0;
      puntosNegativos = parseInt(element.negative_point) || 0;
      
      tBody.innerHTML +=`
      <tr>
        <th scope="row" class="text-center">${contador}</th>
        <td class="fw-bold text-center">${element.date_created}</td>
        <td>${element.specific_reason}</td>
        <td>${element.observation}</td>
        <td>${dataCoder[0].name}</td> <!-- Asumiendo que dataCoder es un arreglo y quieres el nombre del primer objeto -->
        <td class="fw-bold text-center">${puntosPositivos - puntosNegativos}</td>
      </tr>
    `
      contador ++;
    }
  }
  async setInformationAdmin(idUserLogin) {   
    //let idUserLogin = user.rol
    let tBody = document.getElementById("informationTrainer")
    
    let dataUsersProfile = await crudModule.getTrainersById(idUserLogin)
    document.getElementById("emailUser").placeholder  = "admin@riwi.io.com"
    document.getElementById("imgUser").setAttribute ("src", "http://www.marketingtool.online/en/face-generator/img/faces/avatar-11275282410ba32d3bac1efbf87b208b.jpg")
    document.getElementById("nameUser").innerText = "Admin"
    document.getElementById("documentId").placeholder  = "3333335"
    document.getElementById("materiaUser").placeholder = "Admin"

  }
  //===============================================================================================================//
  //Lista Clanes
  // Funcion para listar clanes
  async setClansInList(){
    let tBody = document.getElementById("pointsHistoryClans")
    let contador = 1
    let clan1 =0
    let clan2 =0
    let clan3=0
    let clan4=0
    let coders = await crudModule.getCoders()
    console.log(coders)
    coders.forEach(async (resultado) =>{
        if (resultado.id_clan == 1){ clan1++} 
        else if(resultado.id_clan == 2){clan2++}
        else if(resultado.id_clan == 3){clan3++}
        else if(resultado.id_clan == 4){clan4++}
    })
    let clans = await crudModule.getClans()
    console.log(clans)
    clans.forEach(async (element) =>{ 
        if (element.id == 1){
            tBody.innerHTML += `
              <tr>
                <th scope="row">${contador}</th>
                <td>${element.name}</td>
                <td>${clan1}</td>
                <td>${0}</td>
                <td>
                  <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 20 20"><g><path d="M11.937 4.5H8.062A2.003 2.003 0 0 1 10 2a2.003 2.003 0 0 1 1.937 2.5Z"/><path d="M4.5 5.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2h-11Z"/><path fill-rule="evenodd" d="M14.5 18.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9Zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM10 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 10 8Zm-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7Z" clip-rule="evenodd"/></g></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>                          </td>
              </tr>`
            contador ++
        }else if (element.id == 2){
          tBody.innerHTML += `
          <tr>
            <th scope="row">${contador}</th>
            <td>${element.name}</td>
            <td>${clan2}</td>
            <td>${0}</td>
            <td>
              <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 20 20"><g><path d="M11.937 4.5H8.062A2.003 2.003 0 0 1 10 2a2.003 2.003 0 0 1 1.937 2.5Z"/><path d="M4.5 5.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2h-11Z"/><path fill-rule="evenodd" d="M14.5 18.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9Zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM10 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 10 8Zm-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7Z" clip-rule="evenodd"/></g></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>                          </td>
          </tr>`
          contador ++

        }else if (element.id == 3){
          tBody.innerHTML += `
          <tr>
            <th scope="row">${contador}</th>
            <td>${element.name}</td>
            <td>${clan3}</td>
            <td>${0}</td>
            <td>
              <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 20 20"><g><path d="M11.937 4.5H8.062A2.003 2.003 0 0 1 10 2a2.003 2.003 0 0 1 1.937 2.5Z"/><path d="M4.5 5.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2h-11Z"/><path fill-rule="evenodd" d="M14.5 18.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9Zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM10 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 10 8Zm-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7Z" clip-rule="evenodd"/></g></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>                          </td>
          </tr> `
          contador ++
         }else if (element.id == 4){
            tBody.innerHTML += `
              <tr>
                <th scope="row">${contador}</th>
                <td>${element.name}</td>
                <td>${clan4}</td>
                <td>${0}</td>
                <td>
                  <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 20 20"><g><path d="M11.937 4.5H8.062A2.003 2.003 0 0 1 10 2a2.003 2.003 0 0 1 1.937 2.5Z"/><path d="M4.5 5.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2h-11Z"/><path fill-rule="evenodd" d="M14.5 18.5a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h9Zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7ZM10 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 10 8Zm-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7Z" clip-rule="evenodd"/></g></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="daIconTable" viewBox="0 0 24 24"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>                          </td>
              </tr>`
          contador ++
        }
      });
    }
  //===============================================================================================================//
  //Crear Coders
  async crearCoders(){   
    let newDocumento=document.getElementById('documentId')
    let newName =document.getElementById('name')
    let newCorreo = document.getElementById('email')
    let newPassword =document.getElementById('password')
    let newImg = document.getElementById('imgUser')
    let newClan=document.getElementById('idSelectClan')   
    let newRol = document.getElementById('idSelectRol')
    console.log("aqui va el programa")
    
    
        
    let dataSend = { 

      correo: newCorreo.value,
      password: newPassword.value,
      img: newImg.value,

    };
    console.log(dataSend)
    let usuario = await crudModule.setUsuario(dataSend)  
    console.log(usuario.id)
    let datasend2 ={
      
      id_user:usuario.id,
      id_rol:newRol.value,
      fecha_creacion:utils.obtenerFecha(),
      estado:true,
    }
    console.log(datasend2)

    let coder = await crudModule.setCoders(datasend2)
    let datasend3={
      documento:newDocumento.value,
      id_user:coder.id_user,
      id_clan:newClan.value,
      nombre:newName.value,
      fecha_creacion:coder.fecha_creacion,
      fecha_retiro:undefined,
      estado:coder.estado
    
    }
    console.log(datasend3)
    }
  //===============================================================================================================//
  //Crear Clanes
  async crearClans(){
    let nameClan=document.getElementById('name')
    let imgClan=document.getElementById('imgUser')

    let dataSend ={
      name:nameClan.value,
      date_created:utils.obtenerFecha(),
      date_retirement: null,
      status:true
    }
    console.log(dataSend)
  //
    let clans= await crudModule.setClanes(dataSend)
    console.log(clans)
  }
  //===============================================================================================================//
  //Crear trainers
  async crearTrainers(){
      
      let newDocumento=document.getElementById('documentId')
      let newName =document.getElementById('name')
      let newCorreo = document.getElementById('email')
      let newPassword =document.getElementById('password')
      let newImg = document.getElementById('imgUser')
      let newArea=document.getElementById('idSelectArea')   
      let newRol = document.getElementById('idSelectRol')
      console.log("aqui va el programa")
      
      
          
      let dataSend = { 
  
        correo: newCorreo.value,
        password: newPassword.value,
        img: newImg.value,
  
      };
      console.log(dataSend)
      let usuario = await crudModule.setUsuario(dataSend)  
      console.log(usuario.id)
      let datasend2 ={
        
        id_user:usuario.id,
        id_rol:newRol.value,
        fecha_creacion:utils.obtenerFecha(),
        estado:true,
      }
      console.log(datasend2)
  
      let trainer = await crudModule.setTrainers(datasend2)
      let datasend3={
        documento:newDocumento.value,
        id_user:trainer.id_user,
        id_clan:newArea.value,
        nombre:newName.value,
        fecha_creacion:trainer.fecha_creacion,
        fecha_retiro:undefined,
        estado:trainer.estado
      
      }
      console.log(datasend3)
      alert("Trainer Se Registro Correctamente")
  }


    //Inicio de list porpierty
    listInSelectPropierty(level,language){
      let propiertys = document.getElementById("containerDropdownItemForCategory")
      if(level == 1 && language == "es"){
        //clan
      }else if(level == 1 && language == "en"){

      }
      if(level == 2 && language == "es"){
        propiertys.innerHtml = `
        <li><a class="dropdown-item" href="#">Mayor</a></li>
        <li><a class="dropdown-item" href="#">Menor</a></li>
        `
      }else if(level == 2 && language == "en"){
        
      }
      if(level == 3 && language == "es"){
        propiertys.innerHtml = `
        <li><a class="dropdown-item" href="#">A-Z</a></li>
        <li><a class="dropdown-item" href="#">Z-A</a></li>
        `
      }  
      if(level == 4 && language == "es"){
        //materia
        propiertys.innerHtml = `
        <li><a class="dropdown-item" href="#"></a></li>
        `
      }else if(level == 4 && language == "en"){
      }
    }
    //fin de list propierty
    //``
  async searchAndlistCoder(){
      let tbodyList = document.getElementById("idlistRateCoders");
      let contador = 1;
      let coders = await this.filterCoderBynameOrDocument();
      tbodyList.innerHTML = "";

    document.getElementById("idSearchRate")?.addEventListener("keypress", e => {
        if(document.getElementById("idSearchRate")){
          addEventListener("keyup",e=>{
              document.getElementById("idlistRateCoders").innerHTML = ""
              this.searchAndlistCoder()
          })
        }
      })
    for (let element of coders) {
        
        tbodyList.innerHTML +=  `
          <tr>
            <th scope="row">${contador}</th>
            <td>${element.name}</td>
            <td>${element.document}</td>
            <td><button class="btn btn-info m-2 rateBtn" data-id="${element.id}" id="buttonRateCoderId" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#ffffff" fill-opacity="0" stroke="#ffffff" stroke-dasharray="32" stroke-dashoffset="32" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3L9.65 8.76L3.44 9.22L8.2 13.24L6.71 19.28L12 16M12 3L14.35 8.76L20.56 9.22L15.8 13.24L17.29 19.28L12 16"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="32;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.5s" dur="0.5s" values="0;1"/><animate attributeName="d" dur="1.5s" repeatCount="indefinite" values="M12 3L9.65 8.76L3.44 9.22L8.2 13.24L6.71 19.28L12 16M12 3L14.35 8.76L20.56 9.22L15.8 13.24L17.29 19.28L12 16;M12 7L10.82 10.38L7.24 10.45L10.1 12.62L9.06 16.05L12 14M12 7L13.18 10.38L16.76 10.45L13.9 12.62L14.94 16.05L12 14;M12 3L9.65 8.76L3.44 9.22L8.2 13.24L6.71 19.28L12 16M12 3L14.35 8.76L20.56 9.22L15.8 13.24L17.29 19.28L12 16"/></path></svg>Puntuar</a></td>
          </tr>
        `;
        contador++;
    }
        document.querySelectorAll('.rateBtn').forEach(button => {
          button.addEventListener('click', (event) => {
              let id = event.currentTarget.getAttribute('data-id');
              this.loadModalPoints(id)
            });
        });

  }

  async filterCoderBynameOrDocument() {
    if(document.getElementById("idSearchRate")){
    let usuario = (document.getElementById("idSearchRate").value).toLowerCase()
      let buscarCoder = await crudModule.getCoders();
      return buscarCoder.filter(user => {
        return user.name.toLowerCase().startsWith(usuario) || user.document.startsWith(usuario) 
      })
    }
  }


  async listClansInselect(){
    let clans =  await crudModule.getClans()
    let listClans = document.getElementById("idSelectClan")
    listClans.innerHTML = `<option select>Clan</option>`
    clans.forEach(element => {
      listClans.innerHTML += `<option value="${element.id}">${element.name}</option>`
    });
  }



  loadModalList(){
    let modal = document.getElementById("idmodalBody")
    let title = document.getElementById("idModalTitle")
    title.innerText = "Buscar Coder" 
    modal.innerHTML = `
    <div class="card-body">
    <div class="flex-fill">
      <nav class="navbar">
        <div class="row overflow-hidden flex-fill">
          <div class="col d-flex col-sm-12">
            <input class="form-control m-2 " type="search" placeholder="Buscar"  id="idSearchRate" aria-label="Buscar">
            <button id="idSearchRateButton" class="btn btn-primary my-2" type="button"  >Buscar</button>
          </div>
        </div>
      </nav>
      <div class="col g-2 flex-fill">
      </div>
      <div class="table-responsive my-3 height-table-profile">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Documento</th>
              <th scope="col">Opciones</th>
            </tr>
          </thead>
          <tbody id="idlistRateCoders">
          </tbody>
        </table>
      </div>
    </div>
  </div>`
    document.getElementById("idSearchRate")?.addEventListener("keypress", e=>{
          addEventListener("keyup",e=>{
              this.searchAndlistCoder()
          })
      })
  }

  loadModalPoints(theId){
    let modal = document.getElementById("idmodalBody")
    modal.innerHTML = `        
      <div class="modal-body" id="idmodalBody">
        <div class="container-fluid">
          <!-- Cantidad -->
          <div class="row d-flex justify-content-around p-3">
            <div class="modal-footer justify-content-center">
              <p class="fs-4 fw-bold">Cantidad</p>
            </div>
            <input id="idCantPoints" class="col-sm-4 card form-control form-control-lg" type="number" placeholder="Cantidad de Pts." aria-label="Cantidad de Pts."></input>
          <!-- Concepto -->
          <div class="modal-footer justify-content-center">
            <p class="fs-4 fw-bold">Concepto</p>
          </div>            
          <div class="mb-3">
              <div class="form-floating mb-3">
                <div class="form-floating">
                  <select class="form-select" id="idSelectConcept">
                    <option selected>Seleciona una opción</option>
                    <option value="Uso celular en clase">Uso celular en clase</option>
                    <option value="Llegada Tarde">Llegada Tarde</option>
                    <option value="Irrespeto">Irrespeto</option>
                    <option value="Participacion en clase">Participacion en clase</option>
                    <option value="Buen comportamiento">Buen comportamiento</option>
                    <option value="porque si">Porque si</option>
                    <option value="Hacer trampa durante exámenes o evaluaciones.">Hacer trampa durante exámenes o evaluaciones.</option>
                  </select>
                </div>
              </div>
              <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Leave a comment here" id="idinputTextarea" style="height: 100px" ></textarea>
                <label for="floatingTextarea2Disabled">Escríbe una observación</label>
              </div>
            </div>
          <!-- Tipo punto-->
          <div class="modal-footer justify-content-center">
              <p class="fs-4 fw-bold ">Tipo de punto</p>
            </div>
              <div class="row justify-content-center">
                <button class="col-sm-4 pt-2 card d-flex flex-column justify-content-center align-items-center" data-id="${theId}" data-point="1" id="buttonPointPostive">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 256 256">
                      <path fill="#5ACCA4" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32"/>
                    </svg>
                  </span>
                  <p class="fs-4 fw-bold">Positivo</p>
                </button>
                <button class="col-sm-4 p-2 card d-flex flex-column justify-content-center align-items-center"data-id="${theId}" data-point="0"  id="buttonPointNegative">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 256 256">
                      <path fill="#FE654F" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m37.66 130.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                    </svg>
                  </span>
                  <p class="fs-4 fw-bold">Negativos</p>
                </button>
              </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-secondary col-6" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
        `
        document.getElementById("buttonPointPostive")?.addEventListener("click", e =>{
             let point = e.currentTarget.getAttribute('data-point');
             let id = e.currentTarget.getAttribute('data-id');
            this.addPointToCoder(id,point)
        })
        document.getElementById("buttonPointNegative")?.addEventListener("click", e=>{
             let point = e.currentTarget.getAttribute('data-point');
             let id = e.currentTarget.getAttribute('data-id');
            this.addPointToCoder(id,point)
        })
    
  }

  addPointToCoder(id, type) {
    let point = document.getElementById("idCantPoints").value 
    let concept = document.getElementById("idSelectConcept").value
    let observation = document.getElementById("idinputTextarea").valu
    let messaje =  type != 0 ? `Se asignaran ${point} positivos al coder`:`Se asignaran -${point} negativos al coder`
  console.log("entro aki")
    Swal.fire({
      title:messaje,
      showDenyButton: true,
      confirmButtonText: "Agregar",
      denyButtonText: `Cancelar`
    }).then((result) => {
  /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      
        Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      
      Swal.fire("Los cambios no se han guardado", "", "info");
    }
});
  }

}



export default new DataControllerModule();

