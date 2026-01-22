const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
  exposedHeaders: 'Authorization'
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

const db = require("./models");

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée (ALTER) !");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
