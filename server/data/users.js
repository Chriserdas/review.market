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
      entryDate: "2023-01-01"
    },
    {
      username: "Maria",
      email: "mariapap@gmail.com",
      password: bcrypt.hashSync("1234A@rtg", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Xristina",
      email: "xristinapapad@gmail.com",
      password: bcrypt.hashSync("1234ds@Q", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Pantelis",
      email: "pantelisxrist@gmail.com",
      password: bcrypt.hashSync("1234ds@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Stauros",
      email: "staurosxrist@gmail.com",
      password: bcrypt.hashSync("1234dt@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Pinelopi",
      email: "pinelopi@gmail.com",
      password: bcrypt.hashSync("1234As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Nefeli",
      email: "nefeli@gmail.com",
      password: bcrypt.hashSync("1234Os@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Giannis",
      email: "giannis@gmail.com",
      password: bcrypt.hashSync("1254As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Thalis",
      email: "thalis@gmail.com",
      password: bcrypt.hashSync("1234Ts@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Baggelis",
      email: "baggelis@gmail.com",
      password: bcrypt.hashSync("124324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Natasa",
      email: "natassa@gmail.com",
      password: bcrypt.hashSync("124324ATs@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Athina",
      email: "athina@gmail.com",
      password: bcrypt.hashSync("124324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Evaggelia",
      email: "evaggelia@gmail.com",
      password: bcrypt.hashSync("154324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Stavroula",
      email: "stavroula@gmail.com",
      password: bcrypt.hashSync("127324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Nikos",
      email: "nikos@gmail.com",
      password: bcrypt.hashSync("124384As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Odysseas",
      email: "odysseas@gmail.com",
      password: bcrypt.hashSync("124304As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Kostas",
      email: "kostas@gmail.com",
      password: bcrypt.hashSync("114324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Kuriakos",
      email: "kuriakos@gmail.com",
      password: bcrypt.hashSync("124124As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Aristotelis",
      email: "aristotelis@gmail.com",
      password: bcrypt.hashSync("124324Qs@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Apostolis",
      email: "apostolis@gmail.com",
      password: bcrypt.hashSync("120324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Panagiotis",
      email: "panagiotis@gmail.com",
      password: bcrypt.hashSync("124324As@P", 8),
      entryDate: "2023-01-01"
    },
    {
      username: "Sofia",
      email: "sofia@gmail.com",
      password: bcrypt.hashSync("124324As@P", 8),
      entryDate: "2023-01-01"
    }
    
  ];

module.exports = users;