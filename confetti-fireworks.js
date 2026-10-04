/* ==========================================================
   ULTRA CANVAS FIREWORKS & CONFETTI ENGINE
   Multi-layer particles, emoji cannons, rocket physics
   ========================================================== */

class PartyParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.fireworks = [];
    this.running = false;
    this.colors = ['#ff007f', '#00f0ff', '#ffe600', '#00ff88', '#9d00ff', '#ff5500', '#ffffff'];
    this.emojis = ['🎈', '🎂', '🎉', '🍕', '🚀', '💖', '👑', '✨', '⭐', '🔥'];
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  loop() {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & Draw Fireworks Rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.update();
      fw.draw(this.ctx);
      if (fw.exploded) {
        this.createExplosion(fw.x, fw.y, fw.color);
        this.fireworks.splice(i, 1);
      }
    }

    // Update & Draw Particles / Confetti
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw(this.ctx);
      if (p.life <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  // Shoot a single rocket
  launchRocket(startX = Math.random() * this.canvas.width, targetY = 100 + Math.random() * (this.canvas.height * 0.4)) {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.fireworks.push(new FireworkRocket(startX, this.canvas.height, targetY, color));
    if (window.birthdayAudio) window.birthdayAudio.playLaser();
  }

  // Create explosion particles
  createExplosion(x, y, color) {
    const count = 45;
    if (window.birthdayAudio) window.birthdayAudio.playPop();

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.2);
      const speed = 2 + Math.random() * 6;
      this.particles.push(new SparkParticle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
    }
  }

  // Confetti Blast (from origin or center)
  confettiCannon(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 75) {
    if (window.birthdayAudio) window.birthdayAudio.playPop();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const isEmoji = Math.random() > 0.75;
      const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
      
      this.particles.push(new ConfettiPiece(
        originX, originY,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - (Math.random() * 4), // give slight upward boost
        color, isEmoji, emoji
      ));
    }
  }

  // Mega Party Nuke (Multi-wave cannons + rockets)
  partyNuke() {
    this.confettiCannon(window.innerWidth * 0.2, window.innerHeight * 0.5, 80);
    this.confettiCannon(window.innerWidth * 0.8, window.innerHeight * 0.5, 80);
    this.confettiCannon(window.innerWidth * 0.5, window.innerHeight * 0.3, 120);

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.launchRocket(window.innerWidth * (0.2 + 0.12 * i), 100 + Math.random() * 200);
      }, i * 180);
    }
  }
}

// Spark Particle Class
class SparkParticle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.015 + Math.random() * 0.015;
    this.gravity = 0.08;
    this.size = 3 + Math.random() * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Confetti Piece Class
class ConfettiPiece {
  constructor(x, y, vx, vy, color, isEmoji = false, emoji = '🎉') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.isEmoji = isEmoji;
    this.emoji = emoji;
    this.size = isEmoji ? 22 : 8 + Math.random() * 6;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 12;
    this.life = 1.0;
    this.decay = 0.005 + Math.random() * 0.005;
    this.gravity = 0.15;
    this.drag = 0.97;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.life);

    if (this.isEmoji) {
      ctx.font = `${this.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
    }

    ctx.restore();
  }
}

// Firework Rocket Class
class FireworkRocket {
  constructor(x, startY, targetY, color) {
    this.x = x;
    this.y = startY;
    this.targetY = targetY;
    this.color = color;
    this.speed = 9 + Math.random() * 4;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.exploded = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + 16);
    ctx.stroke();
    ctx.restore();
  }
}

// Initialize on load
window.partyCanvas = new PartyParticleEngine('partyCanvas');
window.partyCanvas.start();
