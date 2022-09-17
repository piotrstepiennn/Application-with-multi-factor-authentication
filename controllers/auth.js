const mysql = require('mysql2')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const bcrypt = require('bcrypt')
const request = require('request')
// definicja danych do połączenia z MySQL
const db = mysql.createConnection({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// połączenie z bazą
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL Connected...")
    }
})

// metoda obsługująca rejestracje
exports.register = async (req, res) => {
    console.log(req.body)

    // dane które zostaną pobrane z przeglądarki - podane przez użytkownika
    const { username, password, password_confirm, email, mobilepassword, pin, question, answer } = req.body

    // sprawdzenie czy dane rejestracji są poprawne i nie istnieja w bazie
    db.query('SELECT email FROM users WHERE email = ?', [email], (error, result) => {
        if (error) {
            console.log(error)
        }

        // jesli zapytanie zwróci odpowiedź to znaczy że taki email już istnieje
        if (result.length > 0) {
            return res.render('register', {
                message: 'Ten email jest już w użyciu'
            })
        }
        // jeśli użytkownik źle potwierdzi hasło to wyswietlanie komunikatu 
        else if (password !== password_confirm) {
            return res.render('register', {
                message: 'Hasła różnią się'
            })
        }

    })

    // zapytanie sql sprawdzające czy nazwa uzytkownika którą chce poslugiwac się uzytkownik juz istnieje
    db.query('SELECT username FROM users WHERE username=?', [username], (error, result) => {
        if (error) {
            console.log(error)
        }

        // jesli zapytanie zwroci odpowiedz to znaczy że nazwa jest zajęta
        if (result.length > 0) {
            return res.render('register', {
                message: 'Ta nazwa użytkownika jest już w użyciu'
            })
        }

    })

    // szyfrowanie hasła
    const hash = await bcrypt.hash(password, 10)

    // utworzenie konta

    db.query('INSERT INTO users SET ?', { username: username, password: hash, email: email, mobilepassword: mobilepassword, pin: pin, question: question, answer: answer }, (error, result) => {
        if (error) {
            console.log(error)
        } else {

            return res.render('index', {
                message: 'Konto zostało utworzone'
            })
        }
    })
}

const captchaFunction = async function(captcha,remoteAddress){
    let captchaResult=true
    if (
        captcha === undefined ||
        captcha === '' ||
        captcha === null
    ) {
        console.log("blad captcha",captcha)
        captchaResult=false
        return captchaResult
    }

    const captchaSecretKey = '6LcTf04eAAAAAJh1IXwkPSnL1eFw3SqnKw_Iin72'

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${captchaSecretKey}&response=${captcha}&remoteip=${remoteAddress}`

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body)
        console.log("wynik captchy: ",body.success)
        if(body.success !== undefined && !body.success){
            console.log('nieudana captcha')
            captchaResult=false
            return captchaResult
        }
    })
    return captchaResult
}

// metoda obsługująca logowanie i wysłanie emaila z kodem uwierzytelnienia
exports.login = async (req, res) => {

    // dane które zostaną pobrane z przeglądarki - podane przez użytkownika
    const { username, password, captcha } = req.body

    
    console.log(password)
    console.log(captcha)
    console.log(username)
    
    let captchaResult = await captchaFunction(captcha,req.connection.remoteAddress)
    console.log("result captchy: ", captchaResult)
    if(captchaResult!==true){
        
        res.render('index', {
            message: "Niepoprawna captcha"
        })
    } else {
        console.log('captcha poprawna')

        // sprawdzenie czy konto z podanym loginem istnieje
        db.query("SELECT * FROM users WHERE username = ?", [username], (error, result, fields) => {

            if (result.length <= 0) {
                return res.render('index', {
                    message: 'Wprowadzone dane są niepoprawne'
                })
            }



            // odkodowanie i porównanie hasła
            bcrypt.compare(password, result[0].password, function (err, result2) {

                if ((result.length > 0) && (result2 == true)) {
                    console.log('proba logowania')

                    req.session.username = username
                    req.session.email = result[0].email
                    req.session.password = result[0].password

                    req.session.expires = new Date(Date.now() + 3 * 24 * 3600 * 1000)

                    question = result[0].question

                    console.log('uruchomienie weryfikacji')

                    // generowanie liczby losowej która będzie kodem uwierzytelniającym
                    authcode = Math.floor(Math.random() * 90000) + 10000;

                    //zapis kodu uwierzytelniającego dla danego uzytkownika do bazy
                    db.query("UPDATE users SET authcode =? WHERE username = ?", [authcode, req.session.username], (error, resul, field) => {
                        if (error) {
                            console.log(error)
                        }
                    })

                    console.log(authcode)

                    db.query("SELECT authcode, pin, question FROM users WHERE username = ?", [req.session.username], (error, result, fields) => {

                        //odczytany kod weryfikacyjny do wysłania
                        loginAuthCode = result[0].authcode
                        loginPin = result[0].pin
                        loginQuestion = result[0].question

                        if (error) {
                            console.log(error)
                        }
                        else {

                            emailVerification(loginAuthCode,req.session.username,req.session.email)

                            // po wyslaniu maila renderujemy okno w ktorym nalezy wpisac kod

                            let max = loginPin.length - 1
                            let num1 = randomInteger(1, max)
                            let num2 = randomInteger(1, max)
                            let num3 = randomInteger(1, max)
                            let num4 = randomInteger(1, max)

                            finalPin = loginPin.charAt(num1) + loginPin.charAt(num2) + loginPin.charAt(num3) + loginPin.charAt(num4)

                            console.log(finalPin)

                            if (error) {
                                console.log(error)
                            }

                            let sendQuestion = ''
                            switch (loginQuestion) {
                                case 'car':
                                    sendQuestion = 'Ulubiona marka samochodów?'
                                    break;
                                case 'game':
                                    sendQuestion = 'Ulubiona gra komputerowa?'
                                    break;
                                default:
                                    sendQuestion = 'Wpisz odpowiedź na pytanie weryfikacyjne'
                                    break;
                            }
                            
                            res.render('verification', {
                                num1: num1 + 1,
                                num2: num2 + 1,
                                num3: num3 + 1,
                                num4: num4 + 1,
                                Question: sendQuestion
                            })
                        
                        }
                    })

                }
                else {
                    return res.render('index', {
                        message: 'Wprowadzone dane są niepoprawne'
                    })
                }
            });

        })
    }
}

async function emailVerification(loginAuthCode, username, email) {
    // Dane potrzebne do wysłania emaila (serwis, login haslo etc)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    // Definicja templatów emaila - np. html, czy handlebars; ścieżki do template etc.
    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.handlebars',
            layoutsDir: path.resolve(__dirname, "../views/"),
            defaultLayout: 'emailTemplate',
        },
        viewEngine: 'express-handlebars',
        viewPath: path.resolve(__dirname, "../views/"),
        extName: '.handlebars'
    }))

    // Definicja odbiorcy wiadomosc, okreslenie tematu etc
    const options = {
        from: "process.env.EMAIL,",
        to: email,
        subject: "Potwierdzenie tożsamości",
        template: 'emailTemplate',
        context: {
            username: username,
            kod: loginAuthCode
        }
    }

    // wysłanie maila z zdefiniowanymi wczesniej parametrami
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log("Błąd wysłania emaila")
            console.log(error)
        } else {
            console.log("Mail wysłany")
            console.log("Wysłano: " + info.response)
        }
    })
}

function randomInteger(min, max) {
    setTimeout(randomInteger, 200)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// metoda weryfikująca uzytkownika - sprawdza czy podany kod z maila jest prawidlowy
exports.verification = (req, res) => {

    const { kod, pin, answer } = req.body

    // wczytanie kodu do uwierzytelnienia
    db.query("SELECT authcode, pin, question, answer FROM users WHERE email = ?", [req.session.email], (error, result2, fields) => {
        loginAuthCode = result2[0].authcode
        loginPin = result2[0].pin
        loginAnswer = result2[0].answer
        loginQuestion = result2[0].question

        if (error) {
            console.log(error)
        }

        // jesli kod wpisane w przeglądarke zgadza się z tym wysłanym w mailu i aplikacji to następuje logowanie
        if ((kod == loginAuthCode) && (pin == finalPin) && (answer == loginAnswer)) {
            console.log("Weryfikacja udana, logowanie...")
            res.render('userPanel', {
                userName: req.session.username,
                email: req.session.email
            })
        }
        // jesli podano zły kod to przekazanie informacji o błędnym kodzie
        else {
            res.render('index', {
                message: "Niepoprawny kod, hasło uwierzytelniające lub odpowiedź"
            })
        }
    })

}

// metoda odpowiadająca za wylogowanie
exports.logout = (req, res) => {

    // niszczenie sesji uzytkownika
    req.session.destroy()

    // renderowanie strony z logowaniem
    res.render('/', {
        message: ''
    })
}

// Metoda odpowiadająca za zmianę nazwy użytkownika
exports.changeUsername = (req, res) => {
    console.log('proba zmiany nazwy uzytkownika')

    // dane które zostaną pobrane z przeglądarki - podane przez użytkownika
    const { old_username, new_username, new_username_confirm } = req.body

    // sprawdzenie czy obecna nazwa użytkownika zgadza się z tą podaną przez użytkownika
    if (req.session.username === old_username) {

        //sprawdzenie czy nowa nazwa użytkownika jest taka sama jak w oknie potwierdzenia
        if (new_username === new_username_confirm) {
            console.log(req.session.username)

            //sprawdzenie czy nowa nazwa uzytkownika nie istnieje juz w bazie
            db.query("SELECT * FROM users WHERE  username = ?", [new_username], (err, results, fds) => {

                // jeśli nowa nazwa użytkownika nie jest zajęta to następuje wywołanie zapytania sql
                if (!(results.length > 0)) {

                    db.query("UPDATE users SET username = ? WHERE username = ?", [new_username, old_username], (error, result, fields) => {

                        // jeśli wywołanie zapytania sql nie powiodło się to wyświetlenie komunikatu o błędzie
                        if (error) {
                            console.log(error)
                            res.render('userPanel', {
                                userName: req.session.username,
                                email: req.session.email,
                                message: 'Błąd zmiany nazwy użytkownika'
                            })

                        }

                        // jeśli pomyślnie zmieniono nazwe uzytkownika - komunikat
                        else {
                            res.render('userPanel', {
                                userName: req.session.username,
                                email: req.session.email,
                                message: 'Pomyślnie zmieniono username'
                            })
                        }
                    })

                }
                // komunikat gdy nazwa uzytkownika na która uzytkownik chce zmienic jest juz zajeta
                else {
                    console.log(err)
                    res.render('userPanel', {
                        userName: req.session.username,
                        email: req.session.email,
                        message: 'Podana nazwa użytkownika jest zajęta'
                    })
                }

            })

        } else {

            // komunikat gdy uzytkownik zle potwierdził nowa nazwe uzytkownika
            res.render('userPanel', {
                userName: req.session.username,
                email: req.session.email,
                message: 'Podane nazwy użytkownika różnią się'
            })
        }

    }
    // komunikat gdy uzytkownik podał złą starą(obecną) nazwe uzytkownika
    else {
        console.log("nieudana zmiana username")
        res.render('userPanel', {
            userName: req.session.username,
            email: req.session.email,
            message: 'Podano nie swoją nazwe użytkownika'
        })
    }

}

// Metoda odpowiadająca za zmianę hasła
exports.changePassword = async (req, res) => {
    console.log('proba zmiany hasla')
    console.log(req.session.password)
    console.log(req.session.username)

    // dane które zostaną pobrane z przeglądarki - podane przez użytkownika
    const { old_password, new_password, new_password_confirm } = req.body

    const check = await bcrypt.compare(old_password, req.session.password)

    // sprawdzenie czy uzytkownik zna swoje obecne hasło
    if (check) {

        // sprawdzenie czy poprawnie wpisano nowe haslo i jego potwierdzenie
        if (new_password == new_password_confirm) {

            const hash = await bcrypt.hash(new_password, 10)


            // wywołanie zapytania sql zmieniające hasło
            db.query("UPDATE users SET password = ? WHERE username = ?", [hash, req.session.username], (error, result2, fields) => {

                // jesli zapytanie sql nie powiodło się to napisanie komunikatu o błędzie
                if (error) {
                    console.log(error)
                    res.render('userPanel', {
                        userName: req.session.username,
                        email: req.session.email,
                        message: 'Błąd zmiany hasła'
                    })

                }
                // Jesli zapytanie sql nie zwroci błędu to wyslanie komunikatu o poprawnym zmianie hasła
                else {
                    res.render('userPanel', {
                        userName: req.session.username,
                        email: req.session.email,
                        message: 'Pomyślnie zmieniono hasło'
                    })
                }
            })

        }
        // Komunikat gdy użytkownik źle potwierdzi nowe hasło
        else {
            res.render('userPanel', {
                userName: req.session.username,
                email: req.session.email,
                message: 'Nowe hasła różnią się'
            })
        }


    }
    // Komunikat gdy użytkownik źle wpisze obecne hasło
    else {
        console.log("nieudana zmiana hasla")
        res.render('userPanel', {
            userName: req.session.username,
            email: req.session.email,
            message: 'Obecne haslo błędne'
        })
    }

}

// Metoda odpowiadająca za zmianę emaila do konta użytkownika
exports.changeEmail = (req, res) => {
    console.log('proba zmiany email')

    const { old_email, new_email, new_email_confirm } = req.body

    if (req.session.email === old_email) {
        if (new_email === new_email_confirm) {
            console.log(req.session.username)

            //sprawdzenie czy nowy email nie istnieje juz w bazie
            db.query("SELECT * FROM users WHERE email = ?", [new_email], (err, results, fds) => {

                // Jeśli zapytanie sql nie zwróci danych to znaczy że takiego emaila nie ma
                if (!(results.length > 0)) {

                    // Wywołanie zapytania sql zmieniającego stary email na nowy
                    db.query("UPDATE users SET email = ? WHERE email = ?", [new_email, old_email], (error, result, fields) => {

                        // Jeśli zapytanie zwróci błąd to wyświetlam komunikat o błędzie
                        if (error) {
                            console.log(error)
                            res.render('userPanel', {
                                userName: req.session.username,
                                email: req.session.email,
                                message: 'Błąd zmiany emaila'
                            })

                        }

                        // jesli wszystko dobrze to wyswietlenie komunikatu o pomyslnym zmienieniu maila
                        else {

                            res.render('userPanel', {
                                userName: req.session.username,
                                email: req.session.email,
                                message: 'Pomyślnie zmieniono Email'
                            })
                        }
                    })

                }
                // Jesli email na ktory uzytkownik chce zmienic jest już w bazie to wyswietlenie komunikatu że jest już zajęty
                else {
                    console.log(err)
                    res.render('userPanel', {
                        userName: req.session.username,
                        email: req.session.email,
                        message: 'Podany Email jest zajęty'
                    })
                }

            })

        }
        // komunikat gdy użytkownik źle potwierdził emaile
        else {
            res.render('userPanel', {
                userName: req.session.username,
                email: req.session.email,
                message: 'Podane emaile różnią się'
            })
        }

    }
    // komunikat gdy użytkownik nie zna swojego obecnego emaila
    else {
        console.log("nieudana zmiana emaila")
        res.render('userPanel', {
            userName: req.session.username,
            email: req.session.email,
            message: 'Podano nie swój email'
        })
    }

}

