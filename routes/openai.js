const router = require('express').Router();
const { summarizeText } = require('../OpenAIconfig');

router.post("/summarize", async (req, res) => {
  try {
    const summary = await summarizeText(req.body.description);
    res.status(200).json({ result: summary });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "An error occurred during your request." });
  }
});



module.exports = router;