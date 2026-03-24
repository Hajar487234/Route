let pagina_competenza=document.getElementById("Scelta_Competenza");
let indietro_Home=document.getElementById("indietro_Home");
let CercaCompetenza=document.getElementById("CercaCompetenza");
let messaggio=document.getElementById("messaggio"); messaggio.style.display="none";

function nascondiPagine(){
    pagina_competenza.style.display="none";
}

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