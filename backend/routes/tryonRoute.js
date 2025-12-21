const express = require("express");
const router = express.Router();

router.post("/virtual", async (req, res) => {
  try {
    const { personImage, clothImage } = req.body;

    if (!personImage || !clothImage) {
      return res.status(400).json({ message: "Images are required" });
    }

    console.log("Received images lengths:", personImage.length, clothImage.length);

    // Dummy response for testing
    return res.json({ result: { output_url: "http://localhost:3000/sample.jpg" } });
  } catch (error) {
    console.error("Try-on route error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
