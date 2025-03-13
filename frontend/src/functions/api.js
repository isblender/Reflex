import React from 'react';

const startMode = async (mode) => {
    console.log(JSON.stringify({ mode }));
    try {
      const response = await fetch("http://localhost:5001/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }), // "1" for Reels, "2" for Dino
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error starting mode:", error);
    }
  };

export {startMode}