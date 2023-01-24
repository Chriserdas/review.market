const router = require("express").Router();
const { User } = require("../models/Schemas");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

router.post("/", async(req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, async(err, user) => {
        if(user){
            const isPasswordValid = await bcrypt.compare(
				req.body.password,
				user.password
			)
		
			if (isPasswordValid) {
				const token = jwt.sign(
					{
						name: user.name,
						email: user.email,
					},
					'secret123'
				)
				res.send({message: "Login Successfull", user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}})
			} else {
				res.send({ message: "Password didn't match"})
			}
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

router.patch("/updateProfile", async(req, res)=> {
    const { userId, newUsername, oldPassword, newPassword} = req.body

    if(newUsername !== "" ){
        User.findOne({_id: userId}, async(err, user) => {
            if (err) {
              res.status(500).send(err);
            }
            user.username = newUsername;
            user.save((err, updatedUser) => {
              if (err) {
                res.status(500).send(err)
              }
              res.send({ message: 'Username updated successfully!' });
            });
          });
    } 
    if(newPassword !== "" && oldPassword !== ""){
        User.findOne({_id: userId}, async(err, user) => {
            if (err) {
              res.status(500).send(err);
            }
            const isPasswordValid = await bcrypt.compare(oldPassword,user.oldPassword)
            if(isPasswordValid){
              const salt = await bcrypt.genSalt(10)
              user.password = await bcrypt.hash(req.body.newPassword, salt)
              user.save((err, updatedUser) => {
                if (err) {
                  res.status(500).send(err)
                }
              res.send({ message: 'Password updated successfully!' });
            });
            }
            else{
              res.send({ message: 'Incorrect old password!' });
            }
        });
    }
}) 



module.exports = router;