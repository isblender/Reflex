import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RocketGame = () => {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const navigate = useNavigate();

  // Create image objects for the ship and asteroid
  const shipImage = new Image();
  shipImage.src = process.env.PUBLIC_URL + '/images/rocket.png';
  const asteroidImage = new Image();
  asteroidImage.src = process.env.PUBLIC_URL + '/images/asteroid.png';
  const backgroundImage = new Image();
  backgroundImage.src = process.env.PUBLIC_URL + '/images/spacebackground.png';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Rocket (ship) properties
    const rocket = {
      x: 50,
      y: canvas.height / 2 - 20,
      width: 80,
      height: 80,
      speed: 5,
    };

    let meteors = [];
    let meteorTimer = 0;
    const meteorInterval = 2000; // spawn a meteor every 2000ms

    let lastTime = Date.now();

    // Key state management
    const keys = {};
    const handleKeyDown = (e) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Function to spawn an asteroid at a random vertical position with variable size
    const spawnMeteor = () => {
      const scale = Math.random() * 70;
      // Generate random width between 70 and 100
      const meteorWidth = 70 + scale;
      // Generate random height between 50 and 70
      const meteorHeight = 50 + scale;
      // Ensure the meteor fits vertically within the canvas
      const meteorY = Math.random() * (canvas.height - meteorHeight);
      meteors.push({
        x: canvas.width,
        y: meteorY,
        width: meteorWidth,
        height: meteorHeight,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.004 // random rotation speed in radians per ms
      });
    };

    // Update positions of the ship and meteors
    const update = (deltaTime) => {
      // Move ship based on arrow keys
      if (keys["ArrowUp"]) {
        rocket.y -= rocket.speed;
        if (rocket.y < 0) rocket.y = 0;
      }
      if (keys["ArrowDown"]) {
        rocket.y += rocket.speed;
        if (rocket.y + rocket.height > canvas.height) {
          rocket.y = canvas.height - rocket.height;
        }
      }

      // Update meteor positions
      meteors.forEach(meteor => {
        meteor.x -= 3; // meteorSpeed
        meteor.rotation += meteor.rotationSpeed * deltaTime;
      });
      meteors = meteors.filter(meteor => meteor.x + meteor.width > 0);

      // Spawn new meteors based on timer
      meteorTimer += deltaTime;
      if (meteorTimer > meteorInterval) {
        spawnMeteor();
        meteorTimer = 0;
      }
    };
    
    // Draw ship and meteors using images
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw background image as the canvas background
      if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback: fill with a black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw ship using the loaded image if available and valid
      if (shipImage.complete && shipImage.naturalWidth !== 0) {
        ctx.drawImage(shipImage, rocket.x, rocket.y, rocket.width, rocket.height);
      } else {
        // Fallback: draw a rectangle
        ctx.fillStyle = '#333';
        ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
      }

      // Draw each asteroid using the loaded image if available and valid
      meteors.forEach(meteor => {
        if (asteroidImage.complete && asteroidImage.naturalWidth !== 0) {
          ctx.save();
          // Translate to the center of the meteor
          const centerX = meteor.x + meteor.width / 2;
          const centerY = meteor.y + meteor.height / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(meteor.rotation);
          // Draw the image centered at the origin
          ctx.drawImage(asteroidImage, -meteor.width / 2, -meteor.height / 2, meteor.width, meteor.height);
          ctx.restore();
        } else {
          // Fallback: draw a circle (rotation doesn't affect a circle)
          ctx.fillStyle = '#b71c1c';
          ctx.beginPath();
          ctx.arc(
            meteor.x + meteor.width / 2,
            meteor.y + meteor.height / 2,
            Math.min(meteor.width, meteor.height) / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    };

    // Check for collision between the ship and any asteroid
    const checkCollision = () => {
      const shrinkFactor = 0.4;
      for (let meteor of meteors) {
        const meteorCollisionX = meteor.x + (meteor.width * (1 - shrinkFactor)) / 2;
        const meteorCollisionY = meteor.y + (meteor.height * (1 - shrinkFactor)) / 2;
        const meteorCollisionWidth = meteor.width * shrinkFactor;
        const meteorCollisionHeight = meteor.height * shrinkFactor;
        if (
          rocket.x < meteorCollisionX + meteorCollisionWidth &&
          rocket.x + rocket.width > meteorCollisionX &&
          rocket.y < meteorCollisionY + meteorCollisionHeight &&
          rocket.y + rocket.height > meteorCollisionY
        ) {
          return true;
        }
      }
      return false;
    };

    // Main game loop
    const render = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      update(deltaTime);
      draw();

      if (checkCollision()) {
        setIsGameOver(true);
        ctx.fillStyle = 'red';
        ctx.font = '48px system-ui';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shipImage, asteroidImage]);

  // Handlers to restart the game or return to dashboard
  const handlePlayAgain = () => {
    window.location.reload();
  };
  const handleReturnDashboard = () => {
    navigate('/dashboard'); // Update path as needed
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h2>Rocket Game</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      />
      {isGameOver && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handlePlayAgain} style={{ marginRight: '10px' }}>
            Play Again
          </button>
          <button onClick={handleReturnDashboard}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default RocketGame;