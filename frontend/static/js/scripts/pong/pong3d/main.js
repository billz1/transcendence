import * as THREE from 'three';
import { setupScene } from './setupScene.js';
import { loadFonts, setupGameObjects } from './setupAsset.js';  // Remove loadModels from import
import { setupBallMovement } from './ballMove.js';
import { setupLighting } from './setupLight.js';
import { createTextGeometry } from './textGeometry.js';
import { Timer }  from "./timer.js";
import { BASE_URL } from '../../../index.js';
import { updateTextForElem } from "../../../utils/languages.js";

export let eventListeners = { }

export class pongThree {  // Changed from PongGame to pongThree
    constructor() {
        this.canvasRef = document.getElementById('canvas');
        this.setup();
        this.bindEvents();
    }

    setup() {
        const { scene, camera, renderer, controls } = setupScene(this.canvasRef);
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;

        setupLighting(this.scene);
        this.gameObjects = setupGameObjects(this.scene); // Store gameObjects
        this.objects = this.gameObjects; // Make objects available for other methods
    }

    bindEvents() {
        this.startButton= document.getElementById('btnStart');
		this.leftPaddleNameLabel = document.getElementById('leftPaddleName');
		this.rightPaddleNameLabel = document.getElementById('rightPaddleName');
		this.objectiveLabel = document.getElementById('objectiveLabel');
		this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
		this.endgameModalWinner = document.getElementById('endgameModalWinner');
		this.endgameModalScore = document.getElementById('endgameModalScore');
		this.endgameModalTime = document.getElementById('endgameModalTime');
		this.endgameModalPlayAgain = document.getElementById('playAgainButton');
		this.endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));
		this.matchEndLabel = document.getElementById('matchEndLabel');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

        this.scoreLeftValue = 0;
        this.scoreRightValue = 0;
        this.objects;
        this.scores;
        this.gameStop = false;
		this.gamePaused = false;
		this.gameStart = false;
		this.timer = new Timer();
		
		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};
		this.leftPaddleNameLabel.textContent = this.usernames.p1;
		this.rightPaddleNameLabel.textContent = this.usernames.p2;

		const keybindsString = localStorage.getItem('pongKeybinds');
        // Debug the actual key codes
        // console.log('Keybinds before:', this.keybinds);
        this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
            lUp: 'KeyW',
            lDown: 'KeyS',
            lForward: 'KeyD',
            lBackward: 'KeyA',
            rUp: 'ArrowUp',
            rDown: 'ArrowDown',
            rForward: 'ArrowRight',
            rBackward: 'ArrowLeft'
        };
        // console.log('Keybinds after:', this.keybinds);
        
        // Define valid game keys
        this.validGameKeys = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        
        // Create mapping between key codes and actions
        this.keybinds = {
            lUp: 'KeyW',
            lDown: 'KeyS',
            lBackward: 'KeyA',    // Changed order to match logical direction
            lForward: 'KeyD',     // Changed order to match logical direction
            rUp: 'ArrowUp',
            rDown: 'ArrowDown',
            rBackward: 'ArrowLeft',  // Changed order to match logical direction
            rForward: 'ArrowRight'   // Changed order to match logical direction
        };
        
        // Create reverse mapping for easier lookup
        this.keyToAction = {};
        Object.entries(this.keybinds).forEach(([action, key]) => {
            this.keyToAction[key] = action;
            // console.log(`Mapping ${key} to ${action}`); // Debug mapping
        });

        // Initialize key states
        this.keyStates = {
            lUp: false,
            lDown: false,
            lForward: false,
            lBackward: false,
            rUp: false,
            rDown: false,
            rForward: false,
            rBackward: false
        };

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
		this.objectiveLabel.textContent = this.objective;

		this.boundKeyDownHandler = this.keyDownHandler.bind(this);
		this.boundKeyUpHandler = this.keyUpHandler.bind(this);

		this.startButton.addEventListener("click", () => this.startGame());
		this.endgameModalPlayAgain.addEventListener("click", () => this.resetGame());
		document.addEventListener("keydown", this.boundKeyDownHandler);
		document.addEventListener("keyup", this.boundKeyUpHandler);
		eventListeners["keydown"] = this.boundKeyDownHandler;
		eventListeners["keyup"] = this.boundKeyUpHandler;
		this.loadObjects();
    }

	async startGame() {
		this.startButton.disabled = true;
		this.startButton.style.display = "none";
		this.gameStart = true;

		this.timer.start();
		this.startGameLoop();
	}

    async loadObjects() {
        this.scores = await loadFonts(this.scene);
        this.moveBall = setupBallMovement(
            this.gameObjects.ball, 
            this.gameObjects.paddleLeft, 
            this.gameObjects.paddleRight, 
            this.gameObjects.dimensions,
            (side) => this.updateScore(side)
        );
    }

    updateScore(side) {
        if (side === 'left') {
            this.scoreLeftValue++;
            this.updateTextGeometry(this.scores.scoreLeft, this.scoreLeftValue);
			if (this.scoreLeftValue >= this.objective) {
				this.endGame(this.usernames.p1)
			}
        } else if (side === 'right') {
            this.scoreRightValue++;
            this.updateTextGeometry(this.scores.scoreRight, this.scoreRightValue);
			if (this.scoreRightValue >= this.objective) {
				this.endGame(this.usernames.p2)
			}
        }
    }

    updateTextGeometry(scoreMesh, scoreValue) {
        if (scoreMesh.geometry) {
            scoreMesh.geometry.dispose(); // Dispose of old geometry
        }
        scoreMesh.geometry = createTextGeometry(scoreValue, this.scores.font);
    }

	movePaddles() {
		const paddleSpeed = 0.05;
        const yBound = 1.5;
        const zBound = 4;

        // Left paddle movement using keyStates instead of keys
        if (this.keyStates.lUp) this.objects.paddleLeft.position.y += paddleSpeed;
        if (this.keyStates.lDown) this.objects.paddleLeft.position.y -= paddleSpeed;
        if (this.keyStates.lForward) this.objects.paddleLeft.position.z += paddleSpeed;
        if (this.keyStates.lBackward) this.objects.paddleLeft.position.z -= paddleSpeed;

        // Right paddle movement
        if (this.keyStates.rUp) this.objects.paddleRight.position.y += paddleSpeed;
        if (this.keyStates.rDown) this.objects.paddleRight.position.y -= paddleSpeed;
        if (this.keyStates.rForward) this.objects.paddleRight.position.z += paddleSpeed;
        if (this.keyStates.rBackward) this.objects.paddleRight.position.z -= paddleSpeed;

        // Constrain paddle positions within bounds
        this.objects.paddleLeft.position.y = Math.max(-yBound, Math.min(yBound, this.objects.paddleLeft.position.y));
        this.objects.paddleRight.position.y = Math.max(-yBound, Math.min(yBound, this.objects.paddleRight.position.y));
        this.objects.paddleLeft.position.z = Math.max(-zBound, Math.min(zBound, this.objects.paddleLeft.position.z));
        this.objects.paddleRight.position.z = Math.max(-zBound, Math.min(zBound, this.objects.paddleRight.position.z));

        // Keep paddles at their fixed x positions
        this.objects.paddleLeft.position.x = -this.gameObjects.dimensions.x_plane;
        this.objects.paddleRight.position.x = this.gameObjects.dimensions.x_plane;
	}

	endGame(winner) {
		this.stopGameLoop();
		this.gameOver = true;
		this.gameStart = false;

		this.sendMatchData(winner);

		updateTextForElem(this.matchEndLabel, "won-the-game");
		this.endgameModalWinner.textContent = winner;
		this.endgameModalScore.textContent = this.scoreLeftValue + "-" + this.scoreRightValue;
		this.endgameModalTime.textContent = this.timer.getTime();

		this.endgameModal.show();
	}

	resetGame() {
		this.startButton.disabled = false;
		this.startButton.style.display = "block";
		this.gameStop = false;

		this.objects.paddleLeft.position.set(-this.gameObjects.dimensions.x_plane, 0, 0);
        this.objects.paddleRight.position.set(this.gameObjects.dimensions.x_plane, 0, 0);

		this.scoreLeftValue = 0;
		this.scoreRightValue = 0;
		this.updateTextGeometry(this.scores.scoreLeft, this.scoreLeftValue);
		this.updateTextGeometry(this.scores.scoreRight, this.scoreRightValue);

		this.renderer.clear();
	}

    startGameLoop() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.update();
            }, 5);
        }
        this.animate();
    }

    stopInterval() {
        clearInterval(this.interval);
		this.interval = null;
	}

    update() {
        this.movePaddles();
        this.moveBall();
    }

    animate() {
        if (!this.gameStop) {
            requestAnimationFrame(this.animate.bind(this));
            
            if (this.controls) this.controls.update();
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }

	pauseGame() {
		if (this.gameStart) {
			if (!this.gamePaused) {
				this.stopInterval();
				this.pauseModal.show();
				this.timer.stop();
				this.gamePaused = true;
			}
			else {
				this.startGameLoop();
				this.timer.start();
				this.gamePaused = false;
			}
		}
	}

    stopGameLoop() {
        this.gameStop = true;
        this.timer.stop();
		this.stopInterval();
    }

	async sendMatchData(winner) {
		const date = new Date();
		let matchData = {
			"player_one": this.usernames.p1,
			"player_two": this.usernames.p2,
			"winner": winner,
			"match_score": this.scoreLeftValue + "-" + this.scoreRightValue,
			"match_duration": ((this.timer.min * 60) + this.timer.sec),
			"match_date": date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay(),
			"user": localStorage.getItem('user_id')
		};
		let response = await fetch(`${BASE_URL}/api/record_PvPong_match/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(matchData)
		})
		if (response.status > 300) {
			console.log("Could not save game in user history. Is user logged ?")
		} else if (response.status < 300) {
			updateTextForElem(this.toastBody, "game-saved");
			this.toastBootstrap.show();
		}
	}

	// HANDLERS

	keyDownHandler(event) {
        // Prevent default for all game keys
        if (this.validGameKeys.includes(event.code)) {
            event.preventDefault();
            console.log('Preventing default for:', event.code); // Debug prevention
        }

        if (this.gameStart) {
            if (event.code === 'Escape') {
                this.pauseGame();
            }
            const action = this.keyToAction[event.code];
            if (action) {
                // console.log('Key pressed:', event.code, 'maps to action:', action); // Debug mapping
                if (!this.keyStates[action]) {
                    this.keyStates[action] = true;
                    // console.log('Key state updated:', this.keyStates); // Debug state
                }
            }
        }       
    }

	keyUpHandler(event) {
		if (this.gameStart) {
            const action = this.keyToAction[event.code];
            if (action) {
                // console.log('Key released:', event.code, 'maps to action:', action); // Debug mapping
                if (this.keyStates[action]) {
                    this.keyStates[action] = false;
                    // console.log('Key state updated:', this.keyStates); // Debug state
                }
            }
        }
	}
}