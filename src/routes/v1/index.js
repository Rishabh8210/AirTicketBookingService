const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
    res.status(200).json({
        data: {},
        message: "Hello User, I hope you're doing well",
        status: true,
        err: {}
    });
})

module.exports = router;