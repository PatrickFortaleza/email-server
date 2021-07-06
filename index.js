const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/email", require("./routes/api/email"));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
