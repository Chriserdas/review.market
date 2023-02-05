const router = require("express").Router();
const { User } = require("../models/Schemas");
const bcrypt = require("bcrypt");
const  ObjectId  = require("mongodb").ObjectId;
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
    const salt = await bcrypt.genSalt(10);

    console.log(req.body);
    if(oldPassword !=='' || newPassword!==''){

        validatePassword(oldPassword,userId).then(async (response) => {
            if(response){
                if (!/(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/.test(newPassword)) {
                    res.send( { message: "Password doesn't meet the credentials", color:"#dd3b39" });
                }
                else{
                    if(updateUsername){
                        User.findOneAndUpdate(
                            { _id: new ObjectId(userId) },
                            { $set: { username: newUsername, password: await bcrypt.hash(newPassword, salt)} },
                            { returnOriginal: false },
                           (err,user) =>{
                                if(err){
                                    res.status(500).send(err);
                                }
                                res.send({ message: "Username and Password Updated",color:'green',user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
                            }
                        );
                        
                    }
                    else{
                        User.findOneAndUpdate(
                            { _id: new ObjectId(userId) },
                            { $set: {password:await bcrypt.hash(newPassword, salt)} },
                            { returnOriginal: false },
                            (err,user) =>{
                                if(err){
                                    res.status(500).send(err)
                                }
                                console.log(user);
                                res.send({ message: "Password Updated",color:'green',user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
                            }
                        );
                        
                    }
                    
                }
            }
            else{
                res.send({ message: "Old Password didnt match",color:"#dd3b39",})
            }
        });
    }
    else if(updateUsername){
        User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { username: newUsername} },
            { returnOriginal: false },
            (err, user) => {
                if(err){
                    console.log(err);
                }
                res.send({ message: "Username Updated", color:'green', user: {username: user.username, isAdmin: user.isAdmin, _id: user._id,email: user.email}});
            }
        );
    }
    
}) 

async function validatePassword (password,userId){
    return new Promise((resolve, reject) => {
        (async () => {
            const result = await User.find({ _id: new ObjectId(userId) });
            if(result.length>0){
                bcrypt.compare(password, result[0].password, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                });
            }
            
        })();
    });
}

module.exports = router;