const { checkJwt}  = require('./jwtMiddleware');

module.exports = app => {
    const catalogue = require("../controllers/catalogue.controllers.js");
  
    var router = require("express").Router();
  

   
    router.get("/", checkJwt,catalogue.get);
  
    app.use('/api/catalogue', router);
  };
