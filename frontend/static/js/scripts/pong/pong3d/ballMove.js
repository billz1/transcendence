import * as THREE from 'three';

export function setupBallMovement(ball, player1, player2, dimensions, updateScore) {
    const { x_plane, y_plane, z_plane, x_cube, y_cube, z_cube, ball_radius } = dimensions;
    let ball_speed = 0.025;  // Reduced initial speed
    let ball_angle = Math.PI;
    let lock = 0;

    function get_random_angle(minimum, maximum) {
        return Math.random() * (maximum - minimum) + minimum;
    }

    function moveBall() {
        // Reduce vertical and depth movement compared to horizontal
        ball.position.x += ball_speed * Math.cos(ball_angle);
        ball.position.y += ball_speed * 0.5 * Math.sin(ball_angle); // Reduced vertical movement
        ball.position.z += ball_speed * 0.5 * Math.sin(ball_angle); // Reduced depth movement

        handleCollisions();
        handleScoring();
    }

    function handleCollisions() {
        // Y-axis wall collisions (top/bottom)
        if (ball.position.y + ball_radius >= (y_plane / 2) || 
            ball.position.y - ball_radius <= -(y_plane / 2)) {
            ball_angle = -ball_angle;
        }

        // Z-axis wall collisions (front/back)
        if (ball.position.z + ball_radius >= (z_plane / 2) || 
            ball.position.z - ball_radius <= -(z_plane / 2)) {
            ball_angle = -ball_angle;
        }

        // Left paddle collision
        if (collisionDetect(player1, ball)) {

            if (lock === 0) {
                ball.position.x = player1.position.x + (x_cube / 2) + ball_radius;
                ball_speed = Math.abs(ball_speed); // Ensure ball moves right
                // Narrower angle range for more predictable bounces
                ball_angle = get_random_angle(-Math.PI / 6, Math.PI / 6); // Changed from PI/4 to PI/6
                increaseBallSpeed();
            }
        }

        // Right paddle collision
        if (collisionDetect(player2, ball)){

            if (lock === 0) {
                ball.position.x = player2.position.x - (x_cube / 2) - ball_radius;
                ball_speed = -Math.abs(ball_speed); // Ensure ball moves left
                // Narrower angle range for more predictable bounces
                ball_angle = get_random_angle(-Math.PI / 6, Math.PI / 6); // Changed from PI/4 to PI/6
                increaseBallSpeed();
            }
        }
    }

    function handleScoring() {
        // X-axis scoring (left/right walls)
        if (ball.position.x + ball_radius > x_plane) {
            if (lock === 0) {
                updateScore('left');
                lock = 1;
                ball_speed = 0;
                setTimeout(() => {
                    resetBall();
                    lock = 0;
                }, 1000);
            }
        } else if (ball.position.x - ball_radius < -x_plane) {
            if (lock === 0) {
                updateScore('right');
                lock = 1;
                ball_speed = 0;
                setTimeout(() => {
                    resetBall();
                    lock = 0;
                }, 1000);
            }
        }
    }

    function collisionDetect(paddle, ball) {
        const paddleBox = new THREE.Box3().setFromObject(paddle);
        const ballBox = new THREE.Box3().setFromObject(ball);
        return paddleBox.intersectsBox(ballBox);
    }

    function increaseBallSpeed() {
        const speedMultiplier = 0.004; // Reduced speed increase
        const maxSpeed = 0.03;         // Reduced maximum speed
        if (Math.abs(ball_speed) < maxSpeed) {
            ball_speed += (ball_speed > 0 ? speedMultiplier : -speedMultiplier);
        }
    }

    function resetBall() {
        ball.position.set(0, 0, 0);
        ball_speed = 0.015;  // Reset to initial slower speed
        ball_angle = Math.random() > 0.5 ? 0 : Math.PI; // Start either left or right
    }

    return moveBall;
}
