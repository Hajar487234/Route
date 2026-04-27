let pagina_competenza=document.getElementById("pagina_competenza");
let pagina_task=document.getElementById("pagina_task");
let pagina_task_01=document.getElementById("pagina_task_01");

nascondiPagine();
pagina_competenza.style.display="block";

let indietro_Home=document.getElementById("indietro_Home");
let CercaCompetenza=document.getElementById("CercaCompetenza");
let messaggio=document.getElementById("messaggio"); messaggio.style.display="none";

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





// SCHERMATA AGGIUNZIONE TASK 1

let indietro_competenza=document.getElementById("indietro_competenza");
let nome_titolo=document.getElementById("nome_titolo");

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

        let text=item.textContent.trim();
        nome_titolo.querySelector("p").textContent=text;
    });
});




