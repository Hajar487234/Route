// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc,
    doc,
    updateDoc
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

let utenteLoggato=null;

onAuthStateChanged(auth, function(user){
    if(user){
        utenteLoggato=user;
    }else{
        utenteLoggato=null;
    }
});


// PAGINE

let pagina_competenza=document.getElementById("pagina_competenza");
let pagina_task=document.getElementById("pagina_task");
let pagina_task_01=document.getElementById("pagina_task_01");

nascondiPagine();
pagina_competenza.style.display="block";

let indietro_Home=document.getElementById("indietro_Home");
let CercaCompetenza=document.getElementById("CercaCompetenza");
let messaggio=document.getElementById("messaggio"); 
messaggio.style.display="none";

function nascondiPagine(){
    pagina_competenza.style.display="none";
    pagina_task.style.display="none";
    pagina_task_01.style.display="none";
}


// SCHERMATA SCELTA COMPETENZA

indietro_Home.addEventListener("click", function(){
    nascondiPagine();
    window.location.href='Schermata_Home.html';
});

const items=document.querySelectorAll("div[id^='item']");

CercaCompetenza.addEventListener("input", function(){
    const ricerca = this.value.toLowerCase();
    let cont=0;

    if(ricerca==""){
        items.forEach(item =>{
            item.style.display="block";
        });
        messaggio.style.display="none";
        return;
    }

    items.forEach(item =>{
        const text=item.textContent.toLowerCase().trim();

        if(text.startsWith(ricerca)){
            item.style.display="block";
            cont++;
        }else{
            item.style.display="none";
        }
    });

    if(cont==0){
        messaggio.style.display="block";
    }else{
        messaggio.style.display="none";
    }

});


// SCHERMATA AGGIUNZIONE TASK

let indietro_competenza=document.getElementById("indietro_competenza");
let nome_titolo=document.getElementById("nome_titolo");
let nome_titolo_01=document.getElementById("nome_titolo_01");

let text_Obiettivo=document.getElementById("Obiettivo");
let button_Genera=document.getElementById("Genera");
let lista=document.getElementById("lista");

let idCompetenzaSalvata="";

indietro_competenza.addEventListener("click", function(){
    nascondiPagine();
    pagina_competenza.style.display="block";
});

items.forEach(item =>{
    item.addEventListener("click", function(){
        nascondiPagine();
        pagina_task.style.display="block";

        let colore=getComputedStyle(item).backgroundColor;
        nome_titolo.style.backgroundColor=colore;
        nome_titolo_01.style.backgroundColor=colore;

        let text=item.textContent.trim();
        nome_titolo.querySelector("p").textContent=text;
        nome_titolo_01.querySelector("p").textContent=text;

        text_Obiettivo.value="";
        lista.innerHTML="";
        idCompetenzaSalvata="";

        pulisciGiorniOrari();
    });
});


// INTEGRAZIONE INTELLIGENZA ARTIFICIALE

// let TOKEN_HF = "METTER QUI TOKEN RELATIVO A HUGGING FACE";

button_Genera.addEventListener("click", async function(){

    let obiettivo=text_Obiettivo.value.trim();
    let competenza=nome_titolo.querySelector("p").textContent.trim();

    if(obiettivo==""){
        lista.innerHTML="<p>Inserisci prima un obiettivo</p>";
        return;
    }

    lista.innerHTML="<p>Generazione task in corso...</p>";

    let prompt=`
    Sei un assistente che crea piani step-by-step.

    Competenza: ${competenza}
    Obiettivo utente: ${obiettivo}

    Rispondi SOLO con una lista numerata.
    Crea una lista di task molto specifici e pratici.

    Regole:
    - ogni task deve essere corto
    - massimo 1 azione per task
    - dividi tutto in piccoli step
    - niente spiegazioni lunghe
    - crea almeno 15 task
    - usa linguaggio semplice

    `;

    try{
        let risposta=await fetch("https://router.huggingface.co/v1/chat/completions", {
            method:"POST",
            headers:{
                "Authorization":"Bearer " + TOKEN_HF,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                model:"meta-llama/Llama-3.1-8B-Instruct",
                messages:[
                    {
                        role:"user",
                        content:prompt
                    }
                ],
                max_tokens:400
            })
        });

        let dati=await risposta.json();

        if(!risposta.ok){
            lista.innerHTML="<p>Errore API</p>";
            console.log(dati);
            return;
        }

        let testo=dati.choices[0].message.content;

        let righe=testo.split("\n");

        lista.innerHTML="";

        let ol=document.createElement("ol");

        righe.forEach(riga =>{
            if(riga.trim()!=""){
                let li=document.createElement("li");

                li.textContent=riga
                    .replace(/^\d+\.\s*/, "")
                    .replace(/^-\s*/, "");

                ol.appendChild(li);
            }
        });

        lista.appendChild(ol);

    }catch(errore){
        console.log(errore);
        lista.innerHTML="<p>Errore durante la generazione dei task</p>";
    }

});


// SALVARE LISTA NEL DATABASE

let button_Successivo=document.getElementById("Successivo");

button_Successivo.addEventListener("click", async function(){

    let utente=utenteLoggato;

    if(!utente){
        alert("Utente non autenticato");
        return;
    }

    let competenza=nome_titolo.querySelector("p").textContent.trim();
    let obiettivo=text_Obiettivo.value.trim();

    let task=[];

    document.querySelectorAll("#lista li").forEach(item =>{
        task.push(item.textContent);
    });

    if(task.length==0){
        alert("Genera prima una lista task");
        return;
    }

    try{

        let documento=await addDoc(collection(db, "competenze"), {

            uid: utente.uid,
            competenza: competenza,
            obiettivo: obiettivo,
            listaTask: task,
            dataCreazione: new Date()

        });

        idCompetenzaSalvata=documento.id;

        alert("Competenza salvata!");

        nascondiPagine();
        pagina_task_01.style.display="block";

    }catch(errore){

        console.log(errore);
        alert("Errore salvataggio database");

    }

});


// SCHERMATA GIORNI E ORARI

let indietro_task=document.getElementById("indietro_task");

indietro_task.addEventListener("click", function(){
    nascondiPagine();
    pagina_task.style.display="block";
});

let giorni=document.querySelectorAll(".Casella_Giorno");
let giorniScelti=[];

let input_Orario=document.getElementById("input_Orario");
let button_Aggiungi_Orario=document.getElementById("Aggiungi_Orario");
let lista_Orari=document.getElementById("lista_Orari");

let orariScelti=[];

function pulisciGiorniOrari(){

    giorniScelti=[];
    orariScelti=[];
    lista_Orari.innerHTML="";
    input_Orario.value="";

    giorni.forEach(giorno =>{
        giorno.style.backgroundColor="";
        giorno.style.color="";
    });

}

giorni.forEach(giorno =>{
    giorno.addEventListener("click", function(){

        let nomeGiorno=giorno.textContent.trim();

        if(giorniScelti.includes(nomeGiorno)){

            giorniScelti=giorniScelti.filter(g => g!==nomeGiorno);

            giorno.style.backgroundColor="";
            giorno.style.color="";

        }else{

            giorniScelti.push(nomeGiorno);

            giorno.style.backgroundColor="#cfd8ff";
            giorno.style.color="black";

        }

    });
});


button_Aggiungi_Orario.addEventListener("click", function(){

    let orario=input_Orario.value;

    if(orario==""){
        alert("Scegli prima un orario");
        return;
    }

    if(orariScelti.includes(orario)){
        alert("Questo orario esiste già");
        return;
    }

    orariScelti.push(orario);

    let div=document.createElement("div");
    div.className="Orario_Item";

    div.innerHTML=`
        <div class="text_Lista">${orario}</div>
        <div class="Delete_Orario">x</div>
    `;

    div.querySelector(".Delete_Orario").addEventListener("click", function(){

        orariScelti=orariScelti.filter(o => o!==orario);

        div.remove();

    });

    lista_Orari.appendChild(div);

    input_Orario.value="";

});


// CONFERMA GIORNI E ORARI

let button_Conferma_Calendario=document.getElementById("Conferma_Calendario");

button_Conferma_Calendario.addEventListener("click", async function(){

    if(giorniScelti.length==0){
        alert("Scegli almeno un giorno");
        return;
    }

    if(orariScelti.length==0){
        alert("Aggiungi almeno un orario");
        return;
    }

    if(idCompetenzaSalvata==""){
        alert("Errore: competenza non salvata");
        return;
    }

    try{

        await updateDoc(doc(db, "competenze", idCompetenzaSalvata), {

            giorni: giorniScelti,
            orari: orariScelti

        });

        alert("Organizzazione salvata!");

        window.location.href="Schermata_Home.html";

    }catch(errore){

        console.log(errore);
        alert("Errore nel salvataggio giorni e orari");

    }

});