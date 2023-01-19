const router = require("express").Router();
const { User } = require("../models/Schemas");
const bcrypt = require("bcrypt");

router.post("/", async(req, res)=> {
    const { username, email, password} = req.body
    if (!/(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/.test(password)) {
        res.send( { message: "The password must be at least 8 characters and contain at least one capital letter on number and some symbol (eg #$*&@).", color:"#dd3b39" })
    }
    User.findOne({email: email}, async(err, user) => {
        if(user){
            res.send({message: "User is already registered", color:"#dd3b39"})
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
                    res.send( { message: "Successfully Registered, Please login now." , color:"green"});
                }
            })
        }
    })
    
}) 

router.patch("/updateProfile", async(req, res)=> {
    const { currentUsername, newUsername, newPassword} = req.body
    User.findOne({username: currentUsername}, async(err, user) => {
        if (err) {
          res.status(500).send(err);
        }
        user.username = newUsername;
        user.password = await bcrypt.hash(req.body.newPassword, salt)
        user.save((err, updatedUser) => {
          if (err) {
            res.status(500).send(err)
          }
          res.send({ message: 'Username and password updated successfully!' });
        });
      });
    
}) 
module.exports = router;