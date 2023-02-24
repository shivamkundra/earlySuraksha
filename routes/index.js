const express = require("express");

const router = express.Router();

// router.use("/user", require("./user"));
router.use("/es", require("./es"));

module.exports = router;
