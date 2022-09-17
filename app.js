const express = require('express')
const https = require('https')
const dotenv = require('dotenv')
const path = require('path')
const session = require('express-session')
const fs = require('fs')
const helmet = require('helmet')
const app = express()
const mobileServer = express()


dotenv.config({ path: './.env'})  // bezpiecznie przechowywanie wrażliwych informacji np. nazwa hosta,haslo etc

//tls
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'SSL_Certificate', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'SSL_Certificate', 'cert.pem'))
}, app)

// nasłuchiwane serwera ssl, ustawienie portu
sslServer.listen(3000, () => {
    console.log("HTTPS Server is running on PORT 3000...")
})

//ustawienie portu serwera dla aplikacji mobilnej
mobileServer.listen(4000, () => {
    console.log("Server for mobile app is online")
});


// Middleware
app.set('view engine', 'hbs')  // view engine do pokazywania html
const publicDirectory = path.join(__dirname,'./public')  // scieżka do folderu z podstronami
app.use(express.static(publicDirectory))


// parse url wyslane przez html (aby byla mozliwosc odczytania danych z formularza)
app.use(express.urlencoded({ extended:false }))
mobileServer.use(express.urlencoded({ extended:false }))

// skonfigurowanie json
app.use(express.json())
mobileServer.use(express.json())

app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
          "frame-src": ["'self'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
        },
    },
}));

// sesja danego uzytkownika
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
}))

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Zdefiniowanie gdzie znajdują się route's (zapytania przez aplikacje do serwera)
app.use('/', require('./routes/pages.js'))
app.use('/auth', require('./routes/auth'))
mobileServer.use('/auth', require('./routes/auth'))