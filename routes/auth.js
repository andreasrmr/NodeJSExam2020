const router = require('express').Router();

router.post("/login", (req, res) => {
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);
    res.send("Your logged in");
});


module.exports = router;