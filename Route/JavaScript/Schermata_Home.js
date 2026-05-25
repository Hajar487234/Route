// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { 
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmypjFy3K3ZuXnD4O5n9w02Q9t2n0-rwA",
    authDomain: "route-ed64e.firebaseapp.com",
    projectId: "route-ed64e",
    storageBucket: "route-ed64e.firebasestorage.app",
    messagingSenderId: "947727045352",
    appId: "1:947727045352:web:3f0abcb29861df440faf5d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


// PAGINA

let Schermata_Home=document.getElementById("Schermata_Home");

let pagina_Add=document.getElementById("Add");
let pagina_Garden=document.getElementById("Garden");
let pagina_Profile=document.getElementById("Profile");

let slider_competenze=document.getElementById("slider_competenze");

let Titolo_Comp=document.getElementById("Titolo_Comp");

let lista_task_home=document.getElementById("lista_task_home");

function nascondi_Pagine(){
    Schermata_Home.style.display="none";
}


// BOTTONI

pagina_Add.addEventListener("click", function(){
    nascondi_Pagine();
    window.location.href='Schermata_Add.html';
});


// CARICARE COMPETENZE

onAuthStateChanged(auth, async function(user){

    if(!user){
        window.location.href="Schermata_Iniziale.html";
        return;
    }

    let dati=await getDocs(collection(db, "competenze"));

    let competenzeUtente=[];

    dati.forEach(doc =>{

        let dato=doc.data();

        if(dato.uid==user.uid){
            competenzeUtente.push(dato);
        }

    });

    slider_competenze.innerHTML="";

    competenzeUtente.forEach((comp, index)=>{

        let p=document.createElement("p");

        p.className="text_COMP";

        p.textContent=comp.competenza;

        p.addEventListener("click", function(){

            mostraCompetenza(comp);

        });

        slider_competenze.appendChild(p);

        if(index==0){
            mostraCompetenza(comp);
        }

    });

});


// MOSTRARE TASK

function mostraCompetenza(comp){

    Titolo_Comp.textContent=comp.competenza;

    lista_task_home.innerHTML="";

    let ol=document.createElement("ol");

    comp.listaTask.forEach(task =>{

        let li=document.createElement("li");

        li.textContent=task;

        ol.appendChild(li);

    });

    lista_task_home.appendChild(ol);

}