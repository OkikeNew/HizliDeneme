const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/quizApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully");
});


const answerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  correct: Boolean,
  attemptNumber: Number,
  date: { type: Date, default: Date.now },
});

const Answer = mongoose.model("Answer", answerSchema);


app.post("/save-answer", async (req, res) => {
  const { question, answer, correct, attemptNumber } = req.body;

  const newAnswer = new Answer({
    question,
    answer,
    correct,
    attemptNumber,
  });

  try {
    await newAnswer.save();
    res.status(200).json({ message: "Answer saved!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving answer" });
  }
});

app.get("/get-answers", async (req, res) => {
  try {
    const answers = await Answer.find().sort({ date: -1 });
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching answers" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
