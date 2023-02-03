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
    const { userId, newUsername, oldPassword, newPassword,updateUsername} = req.body

    if(oldPassword !=='' || newPassword!==''){

        if(validatePassword(oldPassword)){
            if (!/(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/.test(newPassword)) {
                res.send( { message: "Password doesnt meet the credentials", color:"#dd3b39" })
            }
            else{
                if(updateUsername){
                    const user = User.findOneAndUpdate(
                        { _id: userId },
                        { $set: { username: newUsername, password:newPassword} }
                    ,async(err) =>{
                        if(err){
                            res.status(500).send(err);
                        }
                    });
                    res.send({ message: "Username and Password Updated",color:'green',user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
                }
                else{
                    const user = User.findOneAndUpdate(
                        { _id: userId },
                        { $set: {password:newPassword} }
                    );
                    res.send({ message: "Password Updated",user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
                }
                
            }
        }
        
    }
    else if(updateUsername){
        const user = User.findOneAndUpdate(
            { _id: userId },
            { $set: { username: newUsername} }
        ,async(err,user) =>{
            if(err){
                res.status(500).send(err);
            }  
        });
        res.send({ message: "Username Updated", color:'green', user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
    }
    
    /*if(newUsername !== ""  || newPassword !== "" && oldPassword !== ""){
        User.findOne({_id: userId}, async(err, user) => {
            if (err) {
              res.status(500).send(err);
            }
            user.username = newUsername;
            user.save((err, updatedUser) => {
              if (err) {
                res.status(500).send(err)
              }
              res.send({ message: 'Username updated successfully!', user: {username: updatedUser.username, isAdmin: updatedUser.isAdmin, _id: updatedUser._id,email: updatedUser.email} });
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
              res.send({ message: 'Password updated successfully!', user: {username: updatedUser.username, isAdmin: updatedUser.isAdmin, _id: updatedUser._id,email: updatedUser.email} });
            });
            }
            else{
              res.send({ message: 'Incorrect old password!' });
            }
        });
    }*/
}) 

const validatePassword = (password)=>{
    const isMatch = bcrypt.compare(password);
    return isMatch;
}



module.exports = router;