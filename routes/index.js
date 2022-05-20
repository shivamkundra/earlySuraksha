const express = require("express");

const router = express.Router();

router.use("/user", require("./user"));
router.use("/custom", require("./custom"));

module.exports = router;
