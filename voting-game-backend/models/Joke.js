const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  votes: [
    {
      label: { type: String, required: true },
      value: { type: Number, default: 0 },
    },
  ],
  availableVotes: { type: [String], default: ["😂", "👍", "❤️"] },
});

module.exports = mongoose.model("Joke", jokeSchema);