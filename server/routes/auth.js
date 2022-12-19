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
		
				res.send({message: "Login Successfull", user: user})
			} else {
				res.send({ message: "Password didn't match"})
			}
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 



module.exports = router;