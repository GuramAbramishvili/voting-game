import React, { useState, useEffect } from "react";
import axios from "axios";

const JokeDisplay = () => {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState("");

  const fetchJoke = async () => {
    try {
      const response = await axios.get("https://teehee.dev/api/joke");
      setJoke(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Failed to fetch joke:", err);
      setError("Failed to load joke. Please try again later.");
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  const handleVote = async (label) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/joke/${joke.id}`, { label });
      setJoke(response.data);
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!joke) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{joke.question}</h1>
      <p className="text-xl">{joke.answer}</p>
      <div className="mt-4">
        {joke.availableVotes.map((label) => (
          <button
            key={label}
            onClick={() => handleVote(label)}
            className="mr-2 p-2 bg-blue-500 text-white rounded"
          >
            {label} {joke.votes.find((vote) => vote.label === label)?.value || 0}
          </button>
        ))}
      </div>
      <button onClick={fetchJoke} className="mt-4 p-2 bg-green-500 text-white rounded">
        Next Joke
      </button>
    </div>
  );
};

export default JokeDisplay;