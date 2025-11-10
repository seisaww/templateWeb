module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    const router = require("express").Router();
  
    router.get("/", utilisateur.get);
    router.get("/:id", utilisateur.findOne);
    router.post("/", utilisateur.create);
  
    app.use('/api/utilisateur', router);
};