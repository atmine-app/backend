const router = require("express").Router();

router.post("/", async (req, res) => {
  console.log("Received request:", req.body);
  res.status(200).json({ message: "Block route works" });
});

module.exports = router;
