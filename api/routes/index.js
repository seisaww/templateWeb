module.exports = app => {  
  require("./pollution.routes")(app);
  require("./utilisateur.routes")(app);
  require("./auth.routes")(app);
}
