const bcrypt = require("bcrypt");

const users = [
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
    {
      username: "George",
      email: "george@gmail.com",
      password: bcrypt.hashSync("1234ds@vbA", 8),
    },
    {
      username: "Maria",
      email: "mariapap@gmail.com",
      password: bcrypt.hashSync("1234A@rtg", 8),
    },
    {
      username: "Xristina",
      email: "xristinapapad@gmail.com",
      password: bcrypt.hashSync("1234ds@Q", 8),
    },
    {
      username: "Pantelis",
      email: "pantelisxrist@gmail.com",
      password: bcrypt.hashSync("1234ds@P", 8),
    },
  ];

module.exports = users;