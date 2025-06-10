const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

const usersFile = path.join(__dirname, "users.json")

app.post("/register", (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Всі поля обов'язкові" })
  }

  let users = []

  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile)
    users = JSON.parse(data)
  }

  const userExists = users.find((u) => u.email === email)
  if (userExists) {
    return res.status(409).json({ error: "Користувач з таким email вже існує" })
  }

  users.push({ name, email, password })
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))

  res.status(200).json({ message: "Реєстрація успішна" })
});

app.listen(PORT, () => {
  console.log(`✅ Сервер працює на http://localhost:${PORT}`)
});
