// Snowflake Particle Animation System
(function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let clickSnowflakes = [];
  let mouse = { x: 0, y: 0 };
  let animationId;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Draw a snowflake shape
  function drawSnowflake(x, y, size, opacity, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Draw 6 main branches
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((Math.PI / 3) * i);
      
      // Main branch
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size);
      
      // Side branches
      ctx.moveTo(0, -size * 0.3);
      ctx.lineTo(-size * 0.2, -size * 0.4);
      ctx.moveTo(0, -size * 0.3);
      ctx.lineTo(size * 0.2, -size * 0.4);
      
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(-size * 0.15, -size * 0.7);
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(size * 0.15, -size * 0.7);
      
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.restore();
  }

  // Particle class (snowflake)
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.x = Math.random() * canvas.width;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.4 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      // Mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        this.x -= (dx / distance) * force * 2;
        this.y -= (dy / distance) * force * 2;
      }

      // Boundary check - wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      drawSnowflake(this.x, this.y, this.size, this.opacity, this.rotation);
    }
  }

  // Click snowflake class (transparent, animated)
  class ClickSnowflake {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 15;
      this.opacity = 0.6;
      this.rotation = 0;
      this.rotationSpeed = 0.05;
      this.scale = 1;
      this.life = 1.0;
      this.decay = 0.02;
    }

    update() {
      this.rotation += this.rotationSpeed;
      this.scale += 0.02;
      this.life -= this.decay;
      this.opacity = this.life * 0.6;
      
      if (this.life <= 0) {
        return false; // Remove this snowflake
      }
      return true;
    }

    draw() {
      drawSnowflake(this.x, this.y, this.size * this.scale, this.opacity, this.rotation);
    }
  }

  // Create particles
  function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // Draw connections between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Update and draw click snowflakes
    clickSnowflakes = clickSnowflakes.filter(snowflake => {
      const alive = snowflake.update();
      if (alive) {
        snowflake.draw();
      }
      return alive;
    });

    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Click event - create transparent snowflake
  document.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create multiple snowflakes at click position
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      clickSnowflakes.push(new ClickSnowflake(x + offsetX, y + offsetY));
    }
  });

  // Start animation
  animate();
})();
