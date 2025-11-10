module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    const router = require("express").Router();
  
    router.get("/", pollution.get);
    // router.get("/", pollution.findAll);
    router.post("/", pollution.create);
    router.delete("/:id", pollution.delete);
    router.get("/:id", pollution.findOne);
    router.put("/:id", pollution.update);
  
    app.use('/api/pollution', router);
  };
