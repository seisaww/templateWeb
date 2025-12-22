const { checkJwt } = require("./jwtMiddleware");
module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    const router = require("express").Router();
  
    router.get("/", checkJwt, utilisateur.get);
    router.get("/:id", checkJwt, utilisateur.findOne);
    router.post("/", utilisateur.create);
  
    app.use('/api/utilisateur', router);
};
