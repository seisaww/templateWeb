module.exports = app => {  
  require("./catalogue.routes")(app);
  require("./utilisateur.routes")(app);
}
