module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    var router = require("express").Router();
  

   
    router.get("/", pollution.get);
  
    app.use('/api/pollution', router);
  };
