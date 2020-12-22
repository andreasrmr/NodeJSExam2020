const router = require('express').Router();

router.post("/login", (req, res) => {
    res.send("Your logged in");
});


module.exports = router;