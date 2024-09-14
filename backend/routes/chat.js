var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  const { message } = req?.query;

  const response = await cohere.chat({
    message: message ?? "hello world",
  });

  res.status(200).json(response);
});

module.exports = router;
