document.getElementById("buttonChangeUsername").addEventListener("click", OpenForm);
document.getElementById("buttonChangePassword").addEventListener("click", OpenForm1);
document.getElementById("buttonChangeEmail").addEventListener("click", OpenForm2);
document.getElementById("buttonSubmit1").addEventListener("click", OpenForm3);
document.getElementById("buttonSubmit2").addEventListener("click", OpenForm3);
document.getElementById("buttonSubmit3").addEventListener("click", OpenForm3);

function OpenForm() {
        document.getElementById('form').style.display = 'block';
        document.getElementById('form2').style.display = 'none';
        document.getElementById('form3').style.display = 'none';
}    
function OpenForm1() {    
        document.getElementById('form3').style.display = 'none';
        document.getElementById('form').style.display = 'none';
        document.getElementById('form2').style.display = 'block';
}
function OpenForm2() {         
        document.getElementById('form2').style.display = 'none';
        document.getElementById('form').style.display = 'none';
        document.getElementById('form3').style.display = 'block';
}

function OpenForm3() { 
    setTimeout(function(){
    document.getElementById('form2').style.display = 'none';
    document.getElementById('form').style.display = 'none';
    document.getElementById('form3').style.display = 'none';
}, 2000); 
}
        
