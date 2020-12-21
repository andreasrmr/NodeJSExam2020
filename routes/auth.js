const router = require('express').Router();

router.post("/login", (req, res) => {
    res.send("you logged in");
});


module.exports = router;