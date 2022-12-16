const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async(req, res)=> {
	const { name, email, password} = req.body
    User.findOne({email: email}, async(err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const newPassword = await bcrypt.hash(req.body.password, 10)
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