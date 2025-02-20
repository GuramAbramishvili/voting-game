const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Voting Game Backend is running!");
});

// Joke Endpoints
const Joke = require("./models/Joke");

app.get("/api/joke", async (req, res) => {
  try {
    // Fetch joke from TeeHee API
    const response = await fetch("https://teehee.dev/api/joke");
    if (!response.ok) {
      throw new Error(`Failed to fetch joke: ${response.statusText}`);
    }
    const jokeData = await response.json();

    // Check if the joke already exists in the database
    let joke = await Joke.findOne({ id: jokeData.id });

    if (!joke) {
      // Save the joke to the database
      joke = new Joke({
        id: jokeData.id,
        question: jokeData.question,
        answer: jokeData.answer,
        votes: [],
      });
      await joke.save();
    }

    res.json(joke);
  } catch (err) {
    console.error("Error in /api/joke:", err);
    res.status(500).json({ error: "Failed to fetch joke", details: err.message });
  }
});

app.get("/api/joke", async (req, res) => {
  try {
    console.log("Fetching joke from TeeHee API...");
    const response = await fetch("https://teehee.dev/api/joke");
    if (!response.ok) {
      throw new Error(`Failed to fetch joke: ${response.statusText}`);
    }
    const jokeData = await response.json();
    console.log("Joke data from TeeHee API:", jokeData);

    console.log("Checking if joke exists in MongoDB...");
    let joke = await Joke.findOne({ id: jokeData.id });
    console.log("Joke from MongoDB:", joke);

    if (!joke) {
      console.log("Saving new joke to MongoDB...");
      joke = new Joke({
        id: jokeData.id,
        question: jokeData.question,
        answer: jokeData.answer,
        votes: [],
      });
      await joke.save();
      console.log("Joke saved to MongoDB:", joke);
    }

    res.json(joke);
  } catch (err) {
    console.error("Error in /api/joke:", err);

    // Fallback: Return a default joke
    const defaultJoke = {
      id: "default-joke",
      question: "Why did the developer go broke?",
      answer: "Because he used up all his cache!",
      votes: [],
      availableVotes: ["😂", "👍", "❤️"],
    };

    res.json(defaultJoke);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});