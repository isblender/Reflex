import React, { useRef, useEffect } from 'react';

const FlappyBird = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    
    // Bird properties
    const bird = {
      x: 50,
      y: 150,
      radius: 10,
      velocity: 0,
    };
    const gravity = 0.5;
    const jumpStrength = -10;
    
    // Obstacle properties
    let obstacles = [];
    const obstacleWidth = 40;
    const gapHeight = 120;
    let obstacleTimer = 0;
    const obstacleInterval = 1500; // in milliseconds

    let gameOver = false;
    let lastTime = Date.now();

    // Function to add a new obstacle (pipe)
    const addObstacle = () => {
      const minHeight = 50;
      const maxHeight = canvas.height - gapHeight - minHeight;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      obstacles.push({
        x: canvas.width,
        topHeight,
        bottomY: topHeight + gapHeight,
      });
    };

    // Update game objects
    const update = (deltaTime) => {
      // Update bird's physics
      bird.velocity += gravity;
      bird.y += bird.velocity;

      // Update obstacles (move them to the left)
      obstacles.forEach(obstacle => {
        obstacle.x -= 2;
      });
      // Remove obstacles that have left the canvas
      obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);

      // Add new obstacles based on timer
      obstacleTimer += deltaTime;
      if (obstacleTimer > obstacleInterval) {
        addObstacle();
        obstacleTimer = 0;
      }
    };

    // Draw game objects
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the bird
      context.fillStyle = 'black';
      context.beginPath();
      context.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      context.fill();

      // Draw obstacles (pipes)
      context.fillStyle = 'green';
      obstacles.forEach(obstacle => {
        // Top pipe
        context.fillRect(obstacle.x, 0, obstacleWidth, obstacle.topHeight);
        // Bottom pipe
        context.fillRect(obstacle.x, obstacle.bottomY, obstacleWidth, canvas.height - obstacle.bottomY);
      });
    };

    // Check for collisions with boundaries or obstacles
    const checkCollision = () => {
      // Bird hits top or bottom of canvas
      if (bird.y - bird.radius < 0 || bird.y + bird.radius > canvas.height) {
        return true;
      }
      // Check each obstacle for collision
      for (let obstacle of obstacles) {
        if (
          bird.x + bird.radius > obstacle.x &&
          bird.x - bird.radius < obstacle.x + obstacleWidth
        ) {
          // Bird is not in the gap region
          if (bird.y - bird.radius < obstacle.topHeight || bird.y + bird.radius > obstacle.bottomY) {
            return true;
          }
        }
      }
      return false;
    };

    // Main game loop
    const render = () => {
      if (gameOver) {
        context.fillStyle = 'red';
        context.font = '48px system-ui';
        context.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
      }
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      update(deltaTime);
      draw();

      if (checkCollision()) {
        gameOver = true;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Handle space bar input for jump
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        bird.velocity = jumpStrength;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Start the game
    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' , fontFamily:'system-ui'}}>
      <h2>Flappy Bird Game</h2>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default FlappyBird;