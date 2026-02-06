function openLogin(){
  document.getElementById("home").style.display = "none";

  const login = document.getElementById("login");
  const register = document.getElementById("register");

  register.classList.remove("show");
  register.style.display = "none";

  login.style.display = "block";

  setTimeout(() => {
    login.classList.add("show");
  }, 10);
}


function openRegister(){
  document.getElementById("home").style.display = "none";

  const login = document.getElementById("login");
  const register = document.getElementById("register");

  login.classList.remove("show");
  login.style.display = "none";

  register.style.display = "block";

  setTimeout(() => {
    register.classList.add("show");
  }, 10);
}


function goHome(){
  const login = document.getElementById("login");
  const register = document.getElementById("register");
  const loading = document.getElementById("loading");
  const home = document.getElementById("home");

  // chiusura card attuale
  login.classList.remove("show");
  register.classList.remove("show");

  if(login.style.display === "block"){
    login.classList.add("hide");
  }
  if(register.style.display === "block"){
    register.classList.add("hide");
  }

  // dopo animazione uscita → mostra loading
  setTimeout(() => {

    login.style.display = "none";
    register.style.display = "none";
    login.classList.remove("hide");
    register.classList.remove("hide");

    loading.style.display = "flex";
    loading.classList.add("show");

    // 🔊 SUONO INIZIO LOADING
    const loadInSound = document.getElementById("loadInSound");
    loadInSound.currentTime = 0;
    loadInSound.play();

    // durata loading (1.5s)
    setTimeout(() => {

      // 🔊 SUONO COMPLETAMENTO
      const doneSound = document.getElementById("loadDoneSound");
      doneSound.currentTime = 0;
      // 🔊 SUONO COMPLETAMENTO
      doneSound.play();

      // 💥 POP VISIVO
      loading.classList.add("pop");
      loading.classList.add("shine-anim");


      // aspetta che finisca il pop
      setTimeout(() => {

        loading.style.display = "none";
        loading.classList.remove("show");
        loading.classList.remove("pop");
        loading.classList.remove("pop");
        loading.classList.remove("shine-anim");


        home.style.display = "flex";
        home.classList.add("show");

        setTimeout(() => {
          home.classList.remove("show");
        }, 280);

      }, 400); // ⬅ durata pop


    }, 1500);

  }, 300);
}




function playClick(){
  const sound = document.getElementById("clickSound");
  sound.currentTime = 0;
  sound.play();
}

document.addEventListener("keydown", () => {
  const sound = document.getElementById("keySound");
  sound.currentTime = 0;
  sound.play();
});


console.log("🔥 Firebase collegato");

