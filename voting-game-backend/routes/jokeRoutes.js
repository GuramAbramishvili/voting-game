const express = require('express');
const Joke = require('../models/Joke');

const router = express.Router();

// GET a random joke
router.get('/random', async (req, res) => {
  try {
    const count = await Joke.countDocuments();
    const random = Math.floor(Math.random() * count);
    const joke = await Joke.findOne().skip(random);
    res.json(joke);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a vote for a joke
router.post('/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { label } = req.body;

  try {
    const joke = await Joke.findById(id);
    if (!joke) return res.status(404).json({ message: 'Joke not found' });

    const voteIndex = joke.votes.findIndex(vote => vote.label === label);
    if (voteIndex === -1) {
      joke.votes.push({ label, value: 1 });
    } else {
      joke.votes[voteIndex].value += 1;
    }

    await joke.save();
    res.json(joke);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;