let getHam = document.getElementById("ham");
let getBody =document.querySelector("body");
getHam.addEventListener("click",addMenu);
function addMenu() {
    getBody.classList.toggle("menu-show");
}
