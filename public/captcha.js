document.getElementById('loginForm').onsubmit = function submitForm(e){

    e.preventDefault();
    
    // var form = (document.getElementById('loginForm'))

    // const username = document.querySelector('#username').value;
    // const password = document.querySelector('#password').value;
     const captcha = document.querySelector('#g-recaptcha-response').value;

    // var addCaptcha = document.createElement('addCaptcha')

    // addCaptcha.setAttribute('name', 'captcha');
    // addCaptcha.setAttribute('value', captcha);
    // form.appendChild(addCaptcha)

    // form.submit()

    var myin = document.createElement("input");
    myin.type='hidden';
    myin.name='captcha';
    myin.value=captcha;
    document.getElementById('loginForm').appendChild(myin);
    document.getElementById('loginForm').submit();

    // await fetch('/auth/verification',{
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json, text/plain, */*',
    //         'Content-type': 'application/json'
    //     },
    //     body:JSON.stringify({username:username,password:password,captcha:captcha})
    // })
    //(document.getElementById('loginForm').submit());
    

}
//6LcTf04eAAAAADvBL0c1AZdKzrMUH1-RvNgcgfFC