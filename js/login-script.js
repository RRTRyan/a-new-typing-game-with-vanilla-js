const button=document.querySelector(".button");
const email=document.querySelector("#login--email");
const pwd=document.querySelector("#login--password");
const error=document.querySelector(".error");
const toLoad=document.querySelector(".button");


button.addEventListener("click",(e)=>{
    button.style.width="10ch";
    toLoad.textContent=".....";
    
    if(email.value!="antsa@gmail.com" || pwd.value!="1234"){
        e.preventDefault();
        setTimeout(()=>{
            button.style.width="15ch";
            toLoad.textContent="Login"
            error.style.display="flex";
            email.value="";
            pwd.value="";
        },1000)
        setTimeout(()=>{
            error.style.display="none";
            button.style.width="15ch";
        },3000)
    }

    if(email.value=="antsa@gmail.com" && pwd.value=="1234"){
        setTimeout((e)=>{
            e.preventDefault();
            button.style.width="10ch";
            toLoad.textContent=".....";
        },2000);
        setTimeout(()=>{
            window.location.href="../index.html"
        },1000) 
    }
})