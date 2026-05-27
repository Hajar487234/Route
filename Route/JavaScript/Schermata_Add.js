// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc
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

let utenteLoggato = null;

onAuthStateChanged(auth, function(user){
    if(user){
        utenteLoggato = user;
    }else{
        utenteLoggato = null;
    }
});


// PAGINE

let pagina_competenza = document.getElementById("pagina_competenza");
let pagina_task = document.getElementById("pagina_task");
let pagina_task_01 = document.getElementById("pagina_task_01");

nascondiPagine();
pagina_competenza.style.display = "flex";

let indietro_Home = document.getElementById("indietro_Home");
let CercaCompetenza = document.getElementById("CercaCompetenza");
let messaggio = document.getElementById("messaggio"); 
messaggio.style.display = "none";

function nascondiPagine(){
    pagina_competenza.style.display = "none";
    pagina_task.style.display = "none";
    pagina_task_01.style.display = "none";
}


// SCHERMATA SCELTA COMPETENZA

indietro_Home.addEventListener("click", function(){
    window.location.href = "Schermata_Home.html";
});

const items = document.querySelectorAll("div[id^='item']");

CercaCompetenza.addEventListener("input", function(){
    const ricerca = this.value.toLowerCase();
    let cont = 0;

    if(ricerca == ""){
        items.forEach(item =>{
            item.style.display = "block";
        });
        messaggio.style.display = "none";
        return;
    }

    items.forEach(item =>{
        const text = item.textContent.toLowerCase().trim();

        if(text.startsWith(ricerca)){
            item.style.display = "block";
            cont++;
        }else{
            item.style.display = "none";
        }
    });

    messaggio.style.display = cont == 0 ? "block" : "none";
});


// SCHERMATA AGGIUNZIONE TASK

let indietro_competenza = document.getElementById("indietro_competenza");
let nome_titolo = document.getElementById("nome_titolo");
let nome_titolo_01 = document.getElementById("nome_titolo_01");

let text_Obiettivo = document.getElementById("Obiettivo");
let button_Genera = document.getElementById("Genera");
let lista = document.getElementById("lista");

let taskDaSalvare = [];
let competenzaDaSalvare = "";
let obiettivoDaSalvare = "";

indietro_competenza.addEventListener("click", function(){
    nascondiPagine();
    pagina_competenza.style.display = "flex";
});

items.forEach(item =>{
    item.addEventListener("click", function(){
        nascondiPagine();
        pagina_task.style.display = "flex";

        let colore = getComputedStyle(item).backgroundColor;
        nome_titolo.style.backgroundColor = colore;
        nome_titolo_01.style.backgroundColor = colore;

        let text = item.textContent.trim();
        nome_titolo.querySelector("p").textContent = text;
        nome_titolo_01.querySelector("p").textContent = text;

        text_Obiettivo.value = "";
        lista.innerHTML = "";

        taskDaSalvare = [];
        competenzaDaSalvare = "";
        obiettivoDaSalvare = "";

        pulisciGiorniOrari();
    });
});


// INTEGRAZIONE INTELLIGENZA ARTIFICIALE

let TOKEN_HF = "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";

button_Genera.addEventListener("click", async function(){

    let obiettivo = text_Obiettivo.value.trim();
    let competenza = nome_titolo.querySelector("p").textContent.trim();

    if(obiettivo == ""){
        lista.innerHTML = "<p>Inserisci prima un obiettivo</p>";
        return;
    }

    lista.innerHTML = "<p>Generazione task in corso...</p>";

    let prompt = `
Sei un assistente che crea task pratici per aiutare una persona a raggiungere un obiettivo.

Competenza: ${competenza}
Obiettivo: ${obiettivo}

Crea una lista di task semplici, realistici e ordinati.

Regole obbligatorie:
- Scrivi SOLO task, niente titolo e niente introduzione.
- Non usare numeri.
- Ogni riga deve iniziare con "- ".
- Crea esattamente 15 task.
- Ogni task deve essere breve, chiaro e pratico.
- Ogni task deve contenere una sola azione.
- Non usare grassetti, markdown avanzato o frasi decorative.
- Non scrivere spiegazioni lunghe.
- Non interrompere la lista.
`;

    try{
        let risposta = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + TOKEN_HF,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.1-8B-Instruct",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 900,
                temperature: 0.4
            })
        });

        let dati = await risposta.json();

        if(!risposta.ok){
            lista.innerHTML = "<p>Errore API</p>";
            console.log(dati);
            return;
        }

        let testo = dati.choices[0].message.content;

        let righe = testo
            .split("\n")
            .map(riga => riga.trim())
            .filter(riga => riga !== "")
            .map(riga => riga
                .replace(/^\d+[\.\)]\s*/, "")
                .replace(/^-\s*/, "")
                .replace(/^•\s*/, "")
                .replace(/\*\*/g, "")
                .trim()
            )
            .filter(riga => riga !== "")
            .slice(0, 15);

        lista.innerHTML = "";

        let ul = document.createElement("ul");

        righe.forEach(riga =>{
            let li = document.createElement("li");
            li.textContent = riga;
            ul.appendChild(li);
        });

        lista.appendChild(ul);

    }catch(errore){
        console.log(errore);
        lista.innerHTML = "<p>Errore durante la generazione dei task</p>";
    }

});


// SUCCESSIVO: NON SALVA NEL DATABASE

let button_Successivo = document.getElementById("Successivo");

button_Successivo.addEventListener("click", function(){

    competenzaDaSalvare = nome_titolo.querySelector("p").textContent.trim();
    obiettivoDaSalvare = text_Obiettivo.value.trim();

    taskDaSalvare = [];

    document.querySelectorAll("#lista li").forEach(item =>{
        taskDaSalvare.push(item.textContent);
    });

    if(taskDaSalvare.length == 0){
        alert("Genera prima una lista task");
        return;
    }

    nascondiPagine();
    pagina_task_01.style.display = "flex";
});


// SCHERMATA GIORNI E ORARI

let indietro_task = document.getElementById("indietro_task");

indietro_task.addEventListener("click", function(){
    nascondiPagine();
    pagina_task.style.display = "flex";
});

let giorni = document.querySelectorAll(".Casella_Giorno");
let giorniScelti = [];

let input_Orario = document.getElementById("input_Orario");
let button_Aggiungi_Orario = document.getElementById("Aggiungi_Orario");
let lista_Orari = document.getElementById("lista_Orari");

let orariScelti = [];

function pulisciGiorniOrari(){

    giorniScelti = [];
    orariScelti = [];
    lista_Orari.innerHTML = "";
    input_Orario.value = "";

    giorni.forEach(giorno =>{
        giorno.style.backgroundColor = "";
        giorno.style.color = "";
    });

}

giorni.forEach(giorno =>{
    giorno.addEventListener("click", function(){

        let nomeGiorno = giorno.textContent.trim();

        if(giorniScelti.includes(nomeGiorno)){
            giorniScelti = giorniScelti.filter(g => g !== nomeGiorno);
            giorno.style.backgroundColor = "";
            giorno.style.color = "";
        }else{
            giorniScelti.push(nomeGiorno);
            giorno.style.backgroundColor = "#cfd8ff";
            giorno.style.color = "black";
        }

    });
});


button_Aggiungi_Orario.addEventListener("click", function(){

    let orario = input_Orario.value;

    if(orario == ""){
        alert("Scegli prima un orario");
        return;
    }

    if(orariScelti.includes(orario)){
        alert("Questo orario esiste già");
        return;
    }

    orariScelti.push(orario);

    let div = document.createElement("div");
    div.className = "Orario_Item";

    div.innerHTML = `
        <div class="text_Lista">${orario}</div>
        <div class="Delete_Orario">x</div>
    `;

    div.querySelector(".Delete_Orario").addEventListener("click", function(){
        orariScelti = orariScelti.filter(o => o !== orario);
        div.remove();
    });

    lista_Orari.appendChild(div);

    input_Orario.value = "";

});


// CONFERMA: SALVA TUTTO NEL DATABASE

let button_Conferma_Calendario = document.getElementById("Conferma_Calendario");

button_Conferma_Calendario.addEventListener("click", async function(){

    let utente = utenteLoggato;

    if(!utente){
        alert("Utente non autenticato");
        return;
    }

    if(taskDaSalvare.length == 0){
        alert("Errore: lista task vuota");
        return;
    }

    if(giorniScelti.length == 0){
        alert("Scegli almeno un giorno");
        return;
    }

    if(orariScelti.length == 0){
        alert("Aggiungi almeno un orario");
        return;
    }

    try{

        await addDoc(collection(db, "competenze"), {
            uid: utente.uid,
            competenza: competenzaDaSalvare,
            obiettivo: obiettivoDaSalvare,
            listaTask: taskDaSalvare,
            giorni: giorniScelti,
            orari: orariScelti,
            dataCreazione: new Date()
        });

        alert("Competenza salvata!");
        window.location.href = "Schermata_Home.html";

    }catch(errore){
        console.log(errore);
        alert("Errore nel salvataggio");
    }

});