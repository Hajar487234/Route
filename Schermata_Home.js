let Schermata_Home=document.getElementById("Schermata_Home");
let pagina_Add=document.getElementById("Add");
let pagina_Garden=document.getElementById("Garden");
let pagina_Profile=document.getElementById("Profile");

function nascondi_Pagine(){
    Schermata_Home.style.display="none";
}

pagina_Add.addEventListener("click", function(){
    nascondi_Pagine();
    window.location.href='Schermata_Add.html';
});



