        // Canvas setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Game state
        let gameRunning = true;
        let score = 0;
        let lives = 3;
        let gameSpeed = 1;
        
        // Player object
        const player = {
            x: canvas.width / 2 - 15,
            y: canvas.height - 40,
            width: 30,
            height: 20,
            speed: 5,
            color: '#00ff00'
        };
        
        // Arrays for game objects
        let playerBullets = [];
        let alienBullets = [];
        let aliens = [];
        
        // Bullet constructor
        function Bullet(x, y, speed, color) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.width = 3;
            this.height = 8;
            this.color = color;
        }
        
        // Alien constructor
        function Alien(x, y) {
            this.x = x;
            this.y = y;
            this.width = 25;
            this.height = 20;
            this.speed = 0.5;
            this.color = '#ff0000';
            this.shootTimer = Math.random() * 1000;
        }
        
        // Initialize aliens in formation
        function createAliens() {
            aliens = [];
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 10; col++) {
                    aliens.push(new Alien(
                        50 + col * 40,
                        50 + row * 35
                    ));
                }
            }
        }
        
        // Input handling
        const keys = {};
        
        document.addEventListener('keydown', (e) => {
            keys[e.code] = true;
            
            // Prevent default for game keys
            if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
        
        // Shooting
        let canShoot = true;
        function handleShooting() {
            if ((keys['Space']) && canShoot) {
                playerBullets.push(new Bullet(
                    player.x + player.width / 2 - 1.5,
                    player.y,
                    -7,
                    '#ffff00'
                ));
                canShoot = false;
                setTimeout(() => canShoot = true, 250); // Rate limit
            }
        }
        
        // Player movement
        function updatePlayer() {
            if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 0) {
                player.x -= player.speed;
            }
            if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width - player.width) {
                player.x += player.speed;
            }
        }
        
        // Update bullets
        function updateBullets() {
            // Update player bullets
            for (let i = playerBullets.length - 1; i >= 0; i--) {
                const bullet = playerBullets[i];
                bullet.y += bullet.speed;
                
                if (bullet.y < 0) {
                    playerBullets.splice(i, 1);
                }
            }
            
            // Update alien bullets
            for (let i = alienBullets.length - 1; i >= 0; i--) {
                const bullet = alienBullets[i];
                bullet.y += bullet.speed;
                
                if (bullet.y > canvas.height) {
                    alienBullets.splice(i, 1);
                }
            }
        }
        
        // Update aliens
        let alienDirection = 1;
        let alienMoveTimer = 0;
        
        function updateAliens() {
            alienMoveTimer += gameSpeed;
            
            if (alienMoveTimer >= 60) {
                alienMoveTimer = 0;
                
                // Check if aliens need to move down
                let shouldMoveDown = false;
                for (let alien of aliens) {
                    if ((alien.x <= 0 && alienDirection === -1) || 
                        (alien.x >= canvas.width - alien.width && alienDirection === 1)) {
                        shouldMoveDown = true;
                        break;
                    }
                }
                
                if (shouldMoveDown) {
                    alienDirection *= -1;
                    for (let alien of aliens) {
                        alien.y += 20;
                    }
                } else {
                    for (let alien of aliens) {
                        alien.x += alienDirection * 20;
                    }
                }
            }
            
            // Alien shooting
            for (let alien of aliens) {
                alien.shootTimer -= gameSpeed;
                if (alien.shootTimer <= 0 && Math.random() < 0.0005) {
                    alienBullets.push(new Bullet(
                        alien.x + alien.width / 2 - 1.5,
                        alien.y + alien.height,
                        3,
                        '#ff0000'
                    ));
                    alien.shootTimer = 500 + Math.random() * 1000;
                }
            }
        }
        
        // Collision detection
        function checkCollisions() {
            // Player bullets vs aliens
            for (let i = playerBullets.length - 1; i >= 0; i--) {
                const bullet = playerBullets[i];
                
                for (let j = aliens.length - 1; j >= 0; j--) {
                    const alien = aliens[j];
                    
                    if (bullet.x < alien.x + alien.width &&
                        bullet.x + bullet.width > alien.x &&
                        bullet.y < alien.y + alien.height &&
                        bullet.y + bullet.height > alien.y) {
                        
                        // Hit!
                        playerBullets.splice(i, 1);
                        aliens.splice(j, 1);
                        score += 10;
                        updateUI();
                        break;
                    }
                }
            }
            
            // Alien bullets vs player
            for (let i = alienBullets.length - 1; i >= 0; i--) {
                const bullet = alienBullets[i];
                
                if (bullet.x < player.x + player.width &&
                    bullet.x + bullet.width > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + bullet.height > player.y) {
                    
                    // Player hit!
                    alienBullets.splice(i, 1);
                    lives--;
                    updateUI();
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
            
            // Check if aliens reached bottom
            for (let alien of aliens) {
                if (alien.y + alien.height >= player.y) {
                    gameOver();
                    break;
                }
            }
        }
        
        // Drawing functions
        function drawRect(obj) {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
        
        function drawPlayer() {
            drawRect(player);
            
            // Draw cannon detail
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x + 13, player.y - 5, 4, 5);
        }
        
        function drawAlien(alien) {
            drawRect(alien);
            
            // Draw alien details
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(alien.x + 5, alien.y + 3, 3, 3);
            ctx.fillRect(alien.x + 17, alien.y + 3, 3, 3);
            ctx.fillRect(alien.x + 8, alien.y + 12, 9, 2);
        }
        
        function render() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw game objects
            drawPlayer();
            
            // Draw bullets
            for (let bullet of playerBullets) {
                drawRect(bullet);
            }
            for (let bullet of alienBullets) {
                drawRect(bullet);
            }
            
            // Draw aliens
            for (let alien of aliens) {
                drawAlien(alien);
            }
        }
        
        // Game loop
        function gameLoop() {
            if (!gameRunning) return;
            
            handleShooting();
            updatePlayer();
            updateBullets();
            updateAliens();
            checkCollisions();
            render();
            
            // Check win condition
            if (aliens.length === 0) {
                nextWave();
            }
            
            requestAnimationFrame(gameLoop);
        }
        
        // Next wave
        function nextWave() {
            createAliens();
            gameSpeed += 0.2;
            score += 100; // Bonus for clearing wave
            updateUI();
        }
        
        // UI updates
        function updateUI() {
            document.getElementById('score').textContent = score;
            document.getElementById('lives').textContent = lives;
        }
        
        // Game over
        function gameOver() {
            gameRunning = false;
            document.getElementById('finalScore').textContent = score;
            document.getElementById('gameOver').style.display = 'block';
        }
        
        // Restart game
        function restartGame() {
            gameRunning = true;
            score = 0;
            lives = 3;
            gameSpeed = 1;
            playerBullets = [];
            alienBullets = [];
            player.x = canvas.width / 2 - 15;
            alienDirection = 1;
            alienMoveTimer = 0;
            canShoot = true;
            
            createAliens();
            updateUI();
            document.getElementById('gameOver').style.display = 'none';
            gameLoop();
        }
        
        // Initialize game
        createAliens();
        updateUI();
        gameLoop();
