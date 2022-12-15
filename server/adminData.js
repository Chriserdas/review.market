import bcrypt from "bcrypt";

const adminData = {
  users: [
    {
      username: "Dionusia",
      email: "dionusia@gmail.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
    {
      username: "Chris",
      email: "chris@gmail.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
  ],
};
export default adminData;