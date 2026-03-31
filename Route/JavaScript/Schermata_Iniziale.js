let pagina_01=document.getElementById("pagina_01");
let pagina_02=document.getElementById("pagina_02");
let pagina_03=document.getElementById("pagina_03");

let ritornoAccedi=document.getElementById("pagina_02_Ritorno");
let ritornoRegistrati=document.getElementById("pagina_03_Ritorno");

let BottoneAccedi=document.getElementById("BottoneAccedi");
let BottoneRegistrati=document.getElementById("BottoneRegistrati");

pagina_01.style.display="block";
pagina_02.style.display="none";
pagina_03.style.display="none";

function nascondiPagine(){
    pagina_01.style.display="none";
    pagina_02.style.display="none";
    pagina_03.style.display="none";
}

BottoneAccedi.addEventListener("click", function(){
    nascondiPagine();
    pagina_02.style.display="block";
});

BottoneRegistrati.addEventListener("click", function(){
    nascondiPagine();
    pagina_03.style.display="block";
});

ritornoAccedi.addEventListener("click", function(){
    nascondiPagine();
    pagina_02.style.display="block";
});

ritornoRegistrati.addEventListener("click", function(){
    nascondiPagine();
    pagina_03.style.display="block";
});

//FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyDmypjFy3K3ZuXnD4O5n9w02Q9t2n0-rwA",
    authDomain: "route-ed64e.firebaseapp.com",
    projectId: "route-ed64e",
    storageBucket: "route-ed64e.firebasestorage.app",
    messagingSenderId: "947727045352",
    appId: "1:947727045352:web:3f0abcb29861df440faf5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


document.getElementById("accedi").addEventListener("click", function(){
    let email=document.getElementById("logEmail").value;
    let pass=document.getElementById("logPass").value;
    let messaggio=document.getElementById("logAlerta");
    if(email==="" || pass===""){
    messaggio.innerText = "Compila tutti i campi!";
    return;
    }
    else{
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                messaggio.innerText = "";
                nascondiPagine();
                window.location.href = 'Schermata_Home.html';
            })
            .catch((error) => {
                messaggio.innerText = "Errore"+error.message;
            });
    }
});


document.getElementById("registrati").addEventListener("click", function(){
    let email=document.getElementById("regEmail").value;
    let pass=document.getElementById("regPass").value;
    let confPass=document.getElementById("confPass").value;
    let messaggio=document.getElementById("regAlerta");
    if(email==="" || pass==="" || confPass===""){
        messaggio.innerText = "Compila tutti i campi!";
        return;
    }

    if(pass!==confPass){
        messaggio.innerText = "Le password non coincidono";
        return;
    }

    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            messaggio.innerText = "";
            nascondiPagine();
            window.location.href = 'Schermata_Home.html';
        })
        .catch((error) => {
            messaggio.innerText = "Errore"+error.message;
        });

});

document.getElementById("passDimenticata").addEventListener("click", function(){
    let email=document.getElementById("logEmail").value;
    let messaggio=document.getElementById("logAlerta");
    if(email===""){
        messaggio.innerText="Inserisci prima la tua email";
        return;
    }
    sendPasswordResetEmail(auth, email)
        .then(function(){
            messaggio.innerText="Email di recupero inviata";
        })
        .catch(function(error){
            messaggio.innerText = "Errore"+error.message;
        });
});
