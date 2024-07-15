const express = require('express')
const userController = require('./controller/user.js')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.post('/register', userController.register)
app.post('/login', userController.login)


app.listen(5000, (err) => {
    if(err){
        return console.log(err)
    }

})