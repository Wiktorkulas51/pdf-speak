const express = require("express");
const app = express();
const path = require("path");
const upload = require("express-fileupload");

const port = 3000;

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
      res.redirect(`http://127.0.0.1:3000`);
      res.status(200);
      //send properly respons
    }
  });
});

const server = app.listen(3000, () => {
  console.log(`lis on http://127.0.0.1:${port}`);
});
