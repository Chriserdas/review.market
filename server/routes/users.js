const router = require("express").Router();
const { User } = require("../models/Schemas");
const bcrypt = require("bcrypt");

router.post("/", async(req, res)=> {
    const { name, email, password} = req.body
    if (!/(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/.test(password)) {
        res.send( { message: "The password must be at least 8 characters and contain at least one capital letter on number and some symbol (eg #$*&@)." })
    }
    User.findOne({email: email}, async(err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(req.body.password, salt)
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: newPassword,
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 
module.exports = router;