const express = require('express')
const router = express.Router();
var scripts = [{ script: '../views/validateForm.js' }];
// definicja stron/podstron który będą renderowane w zależności od 
//      metody GET wysłanej przez przeglądarke

router.get('/',(req, res) => {
    res.render('index')
})

router.get('/register',(req, res) => {
    res.render('register')
})

router.get('/auth/register',(req, res) => {
    res.render('register', {scripts: scripts})
})

router.get('/verification',(req, res) => {  
    res.render('verification')
})

router.get('/userPanel',(req, res) => {   
    res.render('userPanel')
})

router.get('/logout',(req, res) => {
    res.render('index')
})



module.exports = router;