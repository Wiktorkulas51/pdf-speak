const express = require("express");
const app = express();
const path = require("path");
const upload = require("express-fileupload");
const http = require("http");

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "root")));

app.use(upload());

app.post("/", (req, res) => {
  const file = req.files.inpFile;
  const fileName = file.name;
  console.log(file);
  file.mv(`./root/${fileName}`, (err) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.redirect(`/`);
      res.status(200);
      //send properly respons
    }
  });
});

const server = app.listen(port, () => {
  console.log(`server is running ${port}`);
});

module.exports = app;
