module.exports = app => {
    const auth = require("../controllers/auth.controllers.js"); 
    const router = require("express").Router();

    // console.log('auth.routes loaded'); 

    router.get('/ping', (req, res) => res.json({ ok: true, route: '/api/auth/ping' }));
    router.post('/login', auth.login);
    app.use('/api/auth', router); 
};