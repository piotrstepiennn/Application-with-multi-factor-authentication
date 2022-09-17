const mysql = require('mysql2')

// definicja danych do połączenia z MySQL
const db = mysql.createConnection({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// połączenie z bazą
db.connect( (error)=>{
    if(error){
        console.log("MySQL Error:")
        console.log(error)
    } 

})

exports.mobileLogin =  (req, res) =>{
    console.log("funkcja logowania mobilnego")
    
    const {email, mobilepassword} = req.body

    console.log(email)
    console.log(mobilepassword)

    db.query("SELECT * FROM users WHERE  email = ?  and mobilepassword = ?", [email, mobilepassword],(error, result, fields) => {
        if(result.length > 0){
            console.log("logowanie mobilne")

            db.query("SELECT authcode from users where email = ?",[email],(error,result2,fields) => {
                loginAutoCode = result2[0].authcode
                if(error){
                    console.log(error)
                }

                userToSend = {
                    username: result[0].username,
                    code: loginAutoCode
                }
                
                res.status(200).send(JSON.stringify(userToSend))

            })
     
        }
        else{
            console.log(error)
                res.status(404).send({error})
            }
    })
        
}