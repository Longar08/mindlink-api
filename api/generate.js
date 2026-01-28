module.exports = (req, res) => {
  try {
    res.status(200).send("MindLink API is alive");
  } catch (err) {
    res.status(500).send("Function crashed");
  }
};
