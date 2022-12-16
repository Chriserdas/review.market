const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

router.post("/", async(req, res)=> {
    const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		res.send({message: "User not found"})
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				username: user.username,
				email: user.email,
			},
			'secret123'
		)

		res.send({message: "Login Successfull", user: token})
	} else {
		res.send({ message: "Password didn't match"})
	}
}) 



module.exports = router;