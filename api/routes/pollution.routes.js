const authJwt = require("./jwtMiddleware.js"); 
const pollution = require("../controllers/pollution.controllers.js");

module.exports = app => {
    const router = require("express").Router();

    router.get("/", pollution.get);
    router.get("/:id", pollution.findOne);
    
    router.post("/", [authJwt.checkJwt], pollution.create);
    router.put("/:id", [authJwt.checkJwt], pollution.update);
    router.delete("/:id", [authJwt.checkJwt], pollution.delete);

    app.use('/api/pollution', router);
};
