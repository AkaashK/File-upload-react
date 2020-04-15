const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  //defined file upload size as max 10MB
  if (file.size > 10000000) {
    return res.status(400).json({
      error: "File size exceeds 10MB",
    });
  }

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

//Get all files endpoint
app.get("/getallfiles", (req, res) => {
  fs.readdir(`${__dirname}/client/public/uploads/`, (err, file) => {
    if (err) {
      return res.status(400).json({
        error: "Could not read files",
      });
    }
    res.json(file);
  });
});

app.listen(5000, () => console.log("Server Started..."));
