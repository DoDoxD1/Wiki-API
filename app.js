const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = 3000;
const app = express();

mongoose.connect(
  "mongodb+srv://arihant:arihant123@cluster0.laxna8i.mongodb.net/wikiDB"
);

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app
  .route("/articles")
  .get(async (req, res) => {
    await Article.find({})
      .then(function (result) {
        res.send(result);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title: title,
      content: content,
    });
    await article
      .save()
      .then(function (result) {
        res.send("Successfuly posted \n" + result);
      })
      .catch(function (err) {
        res.send("There was an error " + err);
      });
  })
  .delete(async (req, res) => {
    await Article.deleteMany({})
      .then(function (result) {
        res.send("Successfuly deleted" + result);
      })
      .catch(function (err) {
        res.send("There was an error " + err);
      });
  });

app
  .route("/articles/:articleName")
  .get(async (req, res) => {
    const articleName = req.params.articleName;
    const result = await Article.findOne({ title: articleName });
    if (result) res.send(result);
    else res.send("Not Found any article!");
  })
  .put(async (req, res) => {
    const articleName = req.params.articleName;
    const result = await Article.updateOne(
      { title: articleName },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    );
    if (result) res.send("Updated");
    else res.send("Error!");
  })
  .patch(async (req, res) => {
    const articleName = req.params.articleName;
    const result = await Article.updateOne(
      { title: articleName },
      { $set: req.body }
    );
    if (result) res.send(result);
    else res.send("Error!");
  })
  .delete(async (req, res) => {
    const result = await Article.deleteOne({ title: req.params.articleName });
    if (result) res.send(result);
    else res.send("Error!");
  });

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
