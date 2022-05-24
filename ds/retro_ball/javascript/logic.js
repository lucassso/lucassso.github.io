/**
 * runs once a second and ticks down the timer by 1, checking if the game is over
 * @time O(1)
 */
function onTimer() {
  team_tackle_countdown--;
  checkDribbling();

  //if the timer hits zero
  if (time == 0) {
    crIsPlaying = false;
    time = TIMER;
    half++;
    //checks if the second half or first half just ended
    if (half == 3) {
      alert("Game Over");
      canvasShown = false;
      location.reload();
    }
    else if (half == 2) {
      reset();

      //reset the graphics and run the timer again
      updateGraphics();
      if (modalOpen !== true) {
        setTimeout(onTimer, 1000);
      }
    }
  }
  else {
    if (modalOpen !== true) {
      setTimeout(onTimer, 1000);
    }
  }

  if (!doCountdown) {
    time--;
  } else {
    if (countdownLabel == 3 && showAudio) {
      rlIsPlaying = true;
    }
    document.getElementById("score").innerHTML = countdownLabel;
    if (countdownLabel == 0) {
      document.getElementById("score").innerHTML = "GO!";
    }
    if (countdownLabel < 0) {
      doCountdown = false;
      rlIsPlaying = false;
    }
    countdownLabel--;
  }
  updateGraphics();

  //play the funny clash royale sound when theres 12s left (12s audio clip)
  if (time == 12 && showAudio) {
    crIsPlaying = true;
    cr_audio.play();
  }
}

/**
 * updates the html to display correct half and time
 * @time O(1)
 */
function updateGraphics() {
  //cool math that translates seconds to minutes:seconds
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  document.getElementById('mins').innerHTML = minutes + ":";
  if (seconds < 10) {
    document.getElementById('secs').innerHTML = "0" + seconds;
  } else {
    document.getElementById('secs').innerHTML = seconds;
  }

  let halfstr;
  if (half == 1) {
    halfstr = "1st half";
  }
  if (half == 2) {
    halfstr = "2nd half";
  }
  document.getElementById('half').innerHTML = halfstr;
  if (!doCountdown) {
    let score = document.getElementById("score");
    score.innerHTML = blueteam + " - " + redteam;
  }
}

/**
 * handles html showing, game rendering, entity movement and collisions. once this function finishes, it instantly recalls itself
 * @time O(n^2)
 */
quickMatch = () => {
  canvasShown = true;

  document.getElementById("theHead").style.display = "none";
  //document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("newGame").style.display = "none";
  document.getElementById("sliderPlayer").style.display = "none";
  document.getElementById("credits").style.display = "none";
  document.getElementById("howToPlay").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("showTips").style.display = "none";
  document.getElementById("showAudio").style.display = "none";

  document.getElementById('instructions').style.display = "block";
  canvas.style.display = "block";
  if (restart) {
    reset();
  }
  //check the audio
  if (rlIsPlaying) {
    if (modalOpen) {
      rl_audio.pause();
    } else {
      rl_audio.play();
    }
  }

  //Render functions
  clear();
  renderBackground();
  renderPlayers();
  renderBall();

  if (!doCountdown) {
    //Moves functions
    movePlayers();
    moveBall();
    keyboardMoves();
    directions();

    //Bounce functions
    players_Ball_Collision();
    playersCollision();
    playersBounds();
    ballBounds();

    //modal checking questions
    if (checkingDefense) {
      defenseHelper(blueteam, redteam);
    }
    checkPlayerDistance();
  }
  if (modalOpen !== true) {
    requestAnimationFrame(quickMatch);
  }
};


/**
 * resets all variables to their desired values on start-up
 * runs when reset button is used (R)
 * @time O(n^2)
 */
function reset() {

  makeTheTeams();

  ball = new Ball(canvas.width / 2, canvas.height / 2);
  up = false;
  down = false;
  left = false;
  right = false;
  shoot = false;
  run = false;
  restart = false;

  lastTouch = null;
  secondlastTouch = null;
  doCountdown = true;
  countdownLabel = 3;
}

/**
 * switches the user entity with the entity on their team closest to the ball (excluding the goalie)
 * runs when switch button is used (E)
 * @time O(n)
 */
function switchPlayer() {
  //get the current minimum distance, which is the user's current distance
  let player1 = blueplayers.get(1);
  let user_distance =
    getDistance(player1.x, player1.y, ball.x, ball.y) -
    player1.size -
    ball.size;
  let min_distance = user_distance;
  let min_d_idx = 1;
  //loop through each player on blue team excluding goalie and user
  for (let i = 2; i < blueplayers.size; i++) {
    let player = blueplayers.get(i);
    let distance =
      getDistance(player.x, player.y, ball.x, ball.y) -
      player.size -
      ball.size;
    //if they are closer they will be the one to switch places with user entity
    if (distance < min_distance) {
      min_d_idx = i;
      min_distance = distance;
    }
  }
  let user = blueplayers.get(1);
  let player = blueplayers.get(min_d_idx);
  //swap their pos and velo
  let tempx = user.x;
  let tempy = user.y;
  let tempxVel = user.xVel;
  let tempyVel = user.yVel;

  user.setX(player.x);
  user.setY(player.y);
  user.setxVel(player.xVel)
  user.setyVel(player.yVel)

  player.setX(tempx);
  player.setY(tempy);
  player.setxVel(tempxVel)
  player.setyVel(tempyVel)

}
/**
 * adds players onto each team corresponding to how many the user wants
 * @time O(n^2)
 */
function makeTheTeams() {
  let num_field_players = num_players - 1;
  //these are the different spawns for blue players in order starting with player 3 (if its there)

  /**
   * blue team
   * 
   *       [3]
   * [0] [4]  [1]
   *       [2]
   * 
   * 
   * red team
   * 
   *     [2]
   *  [1]  [4] [0]
   *     [3]
   * 
   */
  let blue_x = [
    canvas.width / 4.5 + (canvas.width / 12),
    canvas.width / 4.5 + (canvas.width / 12),
    canvas.width / (900 / 175)
  ];
  let red_x = [
    canvas.width / (canvas.width / 625),
    canvas.width / (canvas.width / 625),
    canvas.width / (canvas.width / 725)
  ];
  let y = [
    (canvas.height / 2) + 100,
    (canvas.height / 2) - 100,
    (canvas.height / 2)
  ];

  blueplayers = new LinkedList();
  redplayers = new LinkedList();

  //add the first two players (minimum 2v2 game)
  blueplayers.add(new Player(30, 300, 0));
  blueplayers.add(new Player(canvas.width / 3 + (canvas.width / 12), canvas.height / 2, 1))
  //set the decel of the user
  blueplayers.get(1).setDecel(2);

  redplayers.add(new Player(canvas.width - 30, 300, 0));
  redplayers.add(new Player(canvas.width / (canvas.width / 525), canvas.height - canvas.height / 2, 1));
  //add excess if necessary from pre-set positions
  for (let i = 2; i <= num_field_players; i++) {
    blueplayers.add(new Player(blue_x[i - 2], y[i - 2], i));
    redplayers.add(new Player(red_x[i - 2], canvas.height - y[i - 2], i))
  }

}
/**
 * checks for collision between player objects and ball objects
 * @time O(n)
 */
function players_Ball_Collision() {

  //blue team
  for (let player of blueplayers) {
    let ball_distance =
      getDistance(player.x, player.y, ball.x, ball.y) -
      player.size -
      ball.size;
    if (ball_distance < 0) {
      collision(ball, player);
    }
  }

  //red team
  for (let player of redplayers) {
    let ball_distance =
      getDistance(player.x, player.y, ball.x, ball.y) -
      player.size -
      ball.size;
    if (ball_distance < 0) {
      collision(ball, player);
    }
  }
}

/**
 * checks for collision between 2 player objects
 * @time O(n^2)
 */
function playersCollision() {
  for (let player of blueplayers) {
    //blue to blue players
    for (let player2 of blueplayers) {

      let player_distance =
        getDistance(player.x, player.y, player2.x, player2.y) -
        player.size -
        player2.size;

      if (player_distance < 0 && player !== player2) {
        collision(player, player2);
        if (player == blueplayers.get(1) || player2 == blueplayers.get(1)) {
          if (team_tackle_countdown < 0) {
            showPopUp(5)
            team_tackle_countdown = 5;
          }
        }
      }
    }
    //blue to red players
    for (let player3 of redplayers) {
      let player_distance =
        getDistance(player.x, player.y, player3.x, player3.y) -
        player.size -
        player3.size;
      if (player_distance < 0) {
        collision(player, player3);
      }
    }
  }

  for (let player of redplayers) {
    //red to red players
    for (let player2 of redplayers) {
      let player_distance =
        getDistance(player.x, player.y, player2.x, player2.y) -
        player.size -
        player2.size;
      if (player_distance < 0 && player !== player2) {
        collision(player, player2);
      }
    }
  }
}

/**
 * swaps velocities of 2 colliding objects
 * @param {object} cir1 first object
 * @param {object} cir2 second object
 * @time O(n)
 */
function collision(cir1, cir2) {
  if (cir1 instanceof Ball) {
    let temp = lastTouch;
    if (cir2 !== lastTouch) {
      lastTouch = cir2;
      lastTouchHappened = time;
    }
    if (cir2 !== temp) secondlastTouch = temp;
  } else if (cir2 instanceof Ball) {
    let temp = lastTouch;
    lastTouch = cir1;
    if (cir1 !== temp) secondlastTouch = temp;
  }
  let dx = (cir1.x - cir2.x) / cir1.size;
  let dy = (cir1.y - cir2.y) / cir1.size;
  cir1.xVel = dx;
  cir1.yVel = dy;
  cir2.xVel = -dx;
  cir2.yVel = -dy;

  let min_distance = getDistance(blueplayers.get(1).x, blueplayers.get(1).y, ball.x, ball.y) - blueplayers.get(1).size - ball.size;
  let redLessDistance = false;
  for (let blue of blueplayers) {
    let distance = getDistance(blue.x, blue.y, ball.x, ball.y) - blue.size - ball.size;
    if (distance < min_distance) {
      min_distance = distance;
    }
  }
  for (let red of redplayers) {
    let distance = getDistance(red.x, red.y, ball.x, ball.y) - red.size - ball.size;
    if (distance < min_distance) {
      min_distance = distance;
      redLessDistance = true;
    }
  }
  blueHasPoss = true;
  if (redLessDistance) {
    blueHasPoss = false;
  }
}

/**
 * applies distance forumla to 2 points
 * @param {number} x1 first x coordinate
 * @param {number} y1 first y coordinate
 * @param {number} x2 second x coordinate
 * @param {number} y2 second y coordinate
 * @returns distance between 2 points
 * @time O(1)
 */
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * checks to make sure all players on the field are within the canvas, bounces them off wall if necessary
 * @time O(n)
 */
function playersBounds() {
  for (let player of blueplayers) {
    if (player.x + player.size > canvas.width) {
      player.x = canvas.width - player.size;
      player.xVel *= -0.2;
    }
    if (player.x - player.size < 0) {
      player.x = 0 + player.size;
      player.xVel *= -0.2;
    }
    if (player.y + player.size > canvas.height) {
      player.y = canvas.height - player.size;
      player.yVel *= -0.2;
    }
    if (player.y - player.size < 0) {
      player.y = 0 + player.size;
      player.yVel *= -0.2;
    }
  }
  for (let player of redplayers) {
    if (player.x + player.size > canvas.width) {
      player.x = canvas.width - player.size;
      player.xVel *= -0.2;
    }
    if (player.x - player.size < 0) {
      player.x = 0 + player.size;
      player.xVel *= -0.2;
    }
    if (player.y + player.size > canvas.height) {
      player.y = canvas.height - player.size;
      player.yVel *= -0.2;
    }
    if (player.y - player.size < 0) {
      player.y = 0 + player.size;
      player.yVel *= -0.2;
    }
  }
}

/**
 * moves the soccer ball object
 * accelerates/decelerates the ball, changes its coordinates based on velocities
 * @time O(1)
 */
function moveBall() {
  if (ball.xVel !== 0) {
    if (ball.xVel > 0) {
      ball.xVel -= ball.decel;
      if (ball.xVel < 0) ball.xVel = 0;
    } else {
      ball.xVel += ball.decel;
      if (ball.xVel > 0) ball.xVel = 0;
    }
  }

  if (ball.yVel !== 0) {
    if (ball.yVel > 0) {
      ball.yVel -= ball.decel;
      if (ball.yVel < 0) ball.yVel = 0;
    } else {
      ball.yVel += ball.decel;
      if (ball.yVel > 0) ball.yVel = 0;
    }
  }
  ball.checkBounds();
  ball.x += ball.xVel;
  ball.y += ball.yVel;
}

/** 
 * moves all of the players, applying deceleration (except for goalies and user cuz theyre special)
 * @time O(n)
 */
function movePlayers() {

  for (let player of blueplayers) {
    if (player !== blueplayers.get(0) && player !== blueplayers.get(1)) {
      if (player.xVel !== 0) {
        if (player.xVel > 0) {
          player.setxVel(player.xVel - player.decel);
          if (player.xVel < 0) player.xVel = 0;
        } else {
          player.setxVel(player.xVel + player.decel);
          if (player.xVel > 0) player.setxVel(0);
        }
      }
      if (player.yVel !== 0) {
        if (player.yVel > 0) {
          player.setyVel(player.yVel - player.decel);
          if (player.yVel < 0) player.yVel = 0;
        } else {
          player.setyVel(player.yVel + player.decel);
          if (player.yVel > 0) player.setyVel(0);
        }
      }
    }
    player.x += player.xVel;
    player.y += player.yVel;
  }
  for (let player of redplayers) {
    if (player !== redplayers.get(0)) {
      if (player.xVel !== 0) {
        if (player.xVel > 0) {
          player.setxVel(player.xVel - player.decel);
          if (player.xVel < 0) player.xVel = 0;
        } else {
          player.setxVel(player.xVel + player.decel);
          if (player.xVel > 0) player.setxVel(0);
        }
      }
      if (player.yVel !== 0) {
        if (player.yVel > 0) {
          player.setyVel(player.yVel - player.decel);
          if (player.yVel < 0) player.yVel = 0;
        } else {
          player.setyVel(player.yVel + player.decel);
          if (player.yVel > 0) player.setyVel(0);
        }
      }
      player.checkBounds()
    }
    player.x += player.xVel;
    player.y += player.yVel;
  }
}

/**
 * handles actions on the user entity based on user inputs
 * @time O(1)
 */
function keyboardMoves() {

  let dx = (blueplayers.get(1).x - ball.x) / blueplayers.get(1).size;
  let dy = (blueplayers.get(1).y - ball.y) / blueplayers.get(1).size;
  /**
   * "shoots" the ball
   * @param what to "shoot"
   * @time O(1)
   */
  function playerShoot(entity) {

    entity.xVel = (7 / 2) * -dx;
    entity.yVel = (7 / 2) * -dy;
    blueplayers.get(1).setxVel(dx);
    blueplayers.get(1).setyVel(dy);
    if (entity instanceof Ball) {
      checkDefense();
    }
  }
  let isAble =
    getDistance(blueplayers.get(1).x, blueplayers.get(1).y, ball.x, ball.y) -
    blueplayers.get(1).size -
    ball.size;
  //if the player is close enough to the ball and Space was pressed, he "shoots"
  if (isAble < 15 && shoot) {
    playerShoot(ball);
  }

  //if Shift is held the user's speed bounds increase
  if (run) {
    blueplayers.get(1).setmaxSpeed(3);
  } else {
    blueplayers.get(1).setmaxSpeed(2);
  }

  //handles W press/hold to up movement
  if (up) {
    if (blueplayers.get(1).yVel > -blueplayers.get(1).maxSpeed) {
      blueplayers.get(1).setyVel(blueplayers.get(1).yVel - blueplayers.get(1).accel);
    } else {
      blueplayers.get(1).setyVel(-blueplayers.get(1).maxSpeed);
    }
  } else {
    if (blueplayers.get(1).yVel < 0) {
      blueplayers.get(1).setyVel(blueplayers.get(1).yVel + blueplayers.get(1).decel);
      if (blueplayers.get(1).yVel > 0) blueplayers.get(1).setyVel(0);
    }
  }

  //handles S press/hold to up movement
  if (down) {
    if (blueplayers.get(1).yVel < blueplayers.get(1).maxSpeed) {
      blueplayers.get(1).setyVel(blueplayers.get(1).yVel + blueplayers.get(1).accel);
    } else {
      blueplayers.get(1).setyVel(blueplayers.get(1).maxSpeed);
    }
  } else {
    if (blueplayers.get(1).yVel > 0) {
      blueplayers.get(1).setyVel(blueplayers.get(1).yVel - blueplayers.get(1).decel);
      if (blueplayers.get(1).yVel < 0) blueplayers.get(1).setyVel(0);
    }
  }
  //handles A press/hold to up movement
  if (left) {
    if (blueplayers.get(1).xVel > -blueplayers.get(1).maxSpeed) {
      blueplayers.get(1).setxVel(blueplayers.get(1).xVel - blueplayers.get(1).accel);
    } else {
      blueplayers.get(1).setxVel(-blueplayers.get(1).maxSpeed);
    }
  } else {
    if (blueplayers.get(1).xVel < 0) {
      blueplayers.get(1).setxVel(blueplayers.get(1).xVel + blueplayers.get(1).decel);
      if (blueplayers.get(1).xVel > 0) blueplayers.get(1).setxVel(0);
    }
  }
  //handles D press/hold to up movement
  if (right) {
    if (blueplayers.get(1).xVel < blueplayers.get(1).maxSpeed) {
      blueplayers.get(1).setxVel(blueplayers.get(1).xVel + blueplayers.get(1).accel);
    } else {
      blueplayers.get(1).setxVel(blueplayers.get(1).maxSpeed);
    }
  } else {
    if (blueplayers.get(1).xVel > 0) {
      blueplayers.get(1).setxVel(blueplayers.get(1).xVel - blueplayers.get(1).decel);
      if (blueplayers.get(1).xVel < 0) {
        blueplayers.get(1).setxVel(0);
      }
    }
  }

}

/**
 * clears everything rendered on the canvas
 * @time O(1)
 */
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  down_theGoal;
}

/**
 * makes the non-user controlled entities move in predicted directions
 * @time O(n^2)
 */
function directions() {
  /**
   * makes goalies move up and down to protect the goal
   * @time O(1)
   */
  function coverPosition() {


    blueplayers.get(0).y--;
    redplayers.get(0).y++;


    if (blueplayers.get(0).y < canvas.height / 2 - 70) {
      let dy = (blueplayers.get(0).y - (blueplayers.get(0).y - 25)) / blueplayers.get(0).size;
      blueplayers.get(0).setyVel(dy);
    }

    if (blueplayers.get(0).y > canvas.height / 2 + 70) {
      let dy = (blueplayers.get(0).y - (blueplayers.get(0).y - 25)) / blueplayers.get(0).size;
      blueplayers.get(0).setyVel(-dy);
    }


    if (redplayers.get(0).y < canvas.height / 2 - 70) {
      let dy = (redplayers.get(0).y - (redplayers.get(0).y - 25)) / redplayers.get(0).size;
      redplayers.get(0).setyVel(dy);
    }

    if (redplayers.get(0).y > canvas.height / 2 + 70) {
      let dy = (redplayers.get(0).y - (redplayers.get(0).y - 25)) / redplayers.get(0).size;
      redplayers.get(0).setyVel(-dy);
    }

    // A limit for the goalkeeper in the x-axis
    if (redplayers.get(0).x < 825) {
      let dx = (redplayers.get(0).x - (redplayers.get(0).x - 25)) / redplayers.get(0).size;
      redplayers.get(0).setxVel(dx);
    }


    if (blueplayers.get(0).x > 75) {
      let dx = (blueplayers.get(0).x - (blueplayers.get(0).x - 25)) / blueplayers.get(0).size;
      blueplayers.get(0).setxVel(-dx);
    }



  }
  /**
   * makes the goalies lunge after the ball if its close enough to the goalie
   * @time O(1)
   */
  function goalkeeperDirections() {
    //red goalie
    let red_dx = (redplayers.get(0).x - ball.x) / redplayers.get(0).size;
    let red_dy = (redplayers.get(0).y - ball.y) / redplayers.get(0).size;

    let red_ball_distance =
      getDistance(redplayers.get(0).x, redplayers.get(0).y, ball.x, ball.y) -
      redplayers.get(0).size -
      ball.size;
    if (red_ball_distance < 75 && ball.x > canvas.width - 132) {
      redplayers.get(0).setxVel((1 / 2) * -red_dx);
      redplayers.get(0).setyVel((1 / 2) * -red_dy);
      if (red_ball_distance < 10) {
        ball.xVel = 5 * -red_dx;
        ball.yVel = 0.15 - red_dy;
        redplayers.get(0).setxVel(3 * red_dx);
      }
      if (redplayers.get(0).x < 750) {
        redplayers.get(0).setxVel(2 * red_dx);
      }
    }

    //blue goalie
    let blue_dx = (blueplayers.get(0).x - ball.x) / blueplayers.get(0).size;
    let blue_dy = (blueplayers.get(0).y - ball.y) / blueplayers.get(0).size;

    let blue_ball_distance =
      getDistance(blueplayers.get(0).x, blueplayers.get(0).y, ball.x, ball.y) -
      blueplayers.get(0).size -
      ball.size;

    if (blue_ball_distance < 75 && ball.x < 132) {
      blueplayers.get(0).setxVel((1 / 2) * -blue_dx);
      blueplayers.get(0).setyVel((1 / 2) * -blue_dy);
      if (blue_ball_distance < 10) {
        ball.xVel = 5 * -blue_dx;
        ball.yVel = 0.15 - blue_dy;
        blueplayers.get(0).setxVel(3 * blue_dx);
      }
      if (blueplayers.get(0).x > 150) {
        blueplayers.get(0).setxVel(2 * blue_dx);
      }
    }
  }
  /**
   * controls movement for non-goalie, non-user blue players who do not have ball possession
   * @param {Player} player the player to move
   * @param {boolean} isExpanding if the blue players have possession, they expand (soccer iq)
   * @time O(n)
   */
  function blueteamMovement(player, isExpanding) {
    let ball_distance =
      (getDistance(player.x, player.y, ball.x, ball.y) -
        player.size -
        ball.size);
    let playersChallenging = 0;
    let goForIt = true;
    for (let blue of blueplayers){
      let distance =
      (getDistance(blue.x, blue.y, ball.x, ball.y) -
        blue.size -
        ball.size);
      if (distance <= 150){
        playersChallenging += 1;
      }
    }
    if (playersChallenging > num_players - 2){
      goForIt = false;
    }
    //they space out the field more depending on how many people on each team
    let distance_away = num_players - 1 * 75;
    //x depending on distance
    if (ball_distance <= 600 && goForIt) {
      if (player.x - ball.x >= distance_away) {
        player.setxVel(player.xVel - player.accel);
      } else if (player.x - ball.x <= -distance_away) {
        player.setxVel(player.xVel + player.accel);
      }
      if (isExpanding) {
        //offense
        if (player.y - ball.y >= -distance_away) {
          player.setyVel(player.yVel - player.accel);
        } else if (player.y - ball.y <= distance_away) {
          player.setyVel(player.yVel + player.accel);
        }
      } else {
        //defense
        if (player.y - ball.y >= distance_away) {
          player.setyVel(player.yVel - player.accel);
        } else if (player.y - ball.y <= -distance_away) {
          player.setyVel(player.yVel + player.accel);
        }
      }
    }
    player.checkBounds();
  }
  /**
   * controls movement for non-goalie red players who do not have possession of the ball
   * @param {Player} player player to move
   * @param {boolean} isExpanding if the red team has possession, they expand
   * @time O(n)
   */
   function redteamMovement(player, isExpanding) {
    let ball_distance =
      (getDistance(player.x, player.y, ball.x, ball.y) -
        player.size -
        ball.size);
    let playersChallenging = 0;
    let goForIt = true;
    for (let red of redplayers){
      let distance =
      (getDistance(red.x, red.y, ball.x, ball.y) -
        red.size -
        ball.size);
      if (distance <= 150){
        playersChallenging += 1;
      }
    }
    if (playersChallenging > num_players - 2){
      goForIt = false;
    }
    //they space out the field more depending on how many people on each team
    let distance_away = num_players - 1 * 75;
    //x depending on distance
    if (ball_distance <= 600 && goForIt) {
      if (player.x - ball.x >= distance_away) {
        player.setxVel(player.xVel - player.accel);
      } else if (player.x - ball.x <= -distance_away) {
        player.setxVel(player.xVel + player.accel);
      }
      if (isExpanding) {
        //offense
        if (player.y - ball.y >= -distance_away) {
          player.setyVel(player.yVel - player.accel);
        } else if (player.y - ball.y <= distance_away) {
          player.setyVel(player.yVel + player.accel);
        }
      } else {
        //defense
        if (player.y - ball.y >= distance_away) {
          player.setyVel(player.yVel - player.accel);
        } else if (player.y - ball.y <= -distance_away) {
          player.setyVel(player.yVel + player.accel);
        }
      }
    }
    player.checkBounds();
  }
  /**
   * makes a red player go after the ball and score a goal
   * @param {number} index LList index of which player should go after the ball
   * @time O(n^2)
   */
  function redDirections(index) {
    let player = redplayers.get(index);
    let dx = (player.x - ball.x) / player.size;
    let dy = (player.y - ball.y) / player.size;

    let ball_distance =
      getDistance(player.x, player.y, ball.x, ball.y) -
      player.size -
      ball.size;



    // if the red player is close to the ball he will go for it
    if (ball_distance < 100) {
      player.xVel = (1 / 2) * -dx;
      player.yVel = (1 / 2) * -dy;

      if (ball.xVel > 1.5 && lastTouch !== player) {
        ball.xVel -= ball.decel;
      }
      if (ball.yVel > 1.5 && lastTouch !== player) {
        ball.yVel -= ball.decel;
      }
      if (ball.xVel < 1.5 && lastTouch !== player) {
        ball.xVel += ball.decel;
      }
      if (ball.yVel < 1.5 && lastTouch !== player) {
        ball.yVel += ball.decel;
      }

      //chose a random number 1-100 (.5% chance)
      let randChance = Math.floor(Math.random() * 999) + 1;
      if (randChance <= 5) {
        for (let player2 of blueplayers) {
          let ball_distance2 =
            getDistance(player2.x, player2.y, ball.x, ball.y) -
            player2.size -
            ball.size;
          //if another player is challenging theres a chance he'll just floor that
          if (ball_distance2 < 100) {
            ball.xVel = (7 / 2) * -dx;
            ball.yVel = (7 / 2) * -dy;
            player.xVel = 3 * dx;
            player.yVel = 3 * dy;
          }
        }
      }

      // if the player is in the right position to shoot and score a goal, the he will do it
      if (
        player.y < down_theGoal &&
        player.y > upon_theGoal &&
        player.x < 132
      ) {
        player.x = player.x++;
        ball.xVel = (7 / 2) * -dx;
        ball.yVel = (7 / 2) * -dy;
        player.xVel = 3 * dx;
        player.yVel = 3 * dy;
      }
      // check if player is going in the right direction, if is not then fix it

      // Here I check if the player goes in the right direction related to axis x

      if (player.x > canvas.width - 132) {
        player.xVel = -dx;
        player.yVel = -dy;
        ball.x--;
        ball.y--;
      }

      // Here I check if the player goes in the right direction related to axis-y
      if (player.y < upon_theGoal || player.y > down_theGoal) {
        if (player.y < upon_theGoal) {
          ball.y++;
        } else if (player.y > down_theGoal) {
          ball.y--;
          player.x--;
        }
      }
    } else {
      if (ball_distance > 300) {
        //make them run if they are pretty far away
        player.setmaxSpeed(3);
      } else {
        player.setmaxSpeed(2);
      }
      moveTo(player, ball.x - ball.size, ball.y - ball.size);
    }
    for (let other of redplayers) {
      if (other !== redplayers.get(index) && other !== redplayers.get(0)) {
        redteamMovement(other, !blueHasPoss);
      }
    }
  }
  /**
   * makes a blue player go after the ball and score a goal
   * @param {number} index LList index of which player should go after the ball
   * @time O(n^2)
   */
  function blueDirections(index) {
    let player = blueplayers.get(index);
    if (player !== blueplayers.get(0) && player !== blueplayers.get(1)) {
      let dx = (player.x - ball.x) / player.size;
      let dy = (player.y - ball.y) / player.size;

      let ball_distance =
        getDistance(player.x, player.y, ball.x, ball.y) -
        player.size -
        ball.size;



      // if the blue player is close to the ball he will go for it
      if (ball_distance < 100) {
        player.xVel = (1 / 2) * -dx;
        player.yVel = (1 / 2) * -dy;
        //chose a random number 1-100 (.5% chance)
        let randChance = Math.floor(Math.random() * 999) + 1;
        if (randChance <= 5) {
          for (let player2 of redplayers) {
            let ball_distance2 =
              getDistance(player2.x, player2.y, ball.x, ball.y) -
              player2.size -
              ball.size;
            //if another player is challenging theres a chance he'll just floor that
            if (ball_distance2 < 100) {
              ball.xVel = (7 / 2) * -dx;
              ball.yVel = (7 / 2) * -dy;
              player.xVel = 3 * dx;
              player.yVel = 3 * dy;
            }
          }
        }
        if (ball.xVel > 1.5 && lastTouch !== player) {
          ball.xVel -= ball.decel;
        }
        if (ball.yVel > 1.5 && lastTouch !== player) {
          ball.yVel -= ball.decel;
        }
        if (ball.xVel < 1.5 && lastTouch !== player) {
          ball.xVel += ball.decel;
        }
        if (ball.yVel < 1.5 && lastTouch !== player) {
          ball.yVel += ball.decel;
        }


        // if the player is in the right position to shoot and score a goal, the he will do it
        if (
          player.y < down_theGoal &&
          player.y > upon_theGoal &&
          player.x > canvas.width - 132
        ) {
          player.x = player.x++;
          ball.xVel = (7 / 2) * -dx;
          ball.yVel = (7 / 2) * -dy;
          player.xVel = 3 * -dx;
          player.yVel = 3 * -dy;
        }
        // check if player is going in the right direction, if is not then fix it

        // Here I check if the player goes in the right direction related to axis x

        if (player.x < 132) {
          player.xVel = dx;
          player.yVel = dy;
          ball.x++;
          ball.y++;
        }

        // Here I check if the player goes in the right direction related to axis-y
        if (player.y < upon_theGoal || player.y > down_theGoal) {
          if (player.y < upon_theGoal) {
            ball.y++;
          } else if (player.y > down_theGoal) {
            ball.y--;
            player.x--;
          }
        }
      } else {
        if (ball_distance > 300) {
          //make them run if they are pretty far away
          player.setmaxSpeed(3);
        } else {
          player.setmaxSpeed(2);
        }
        moveTo(player, ball.x - ball.size, ball.y - ball.size);
      }
    }
    for (let other of blueplayers) {
      if (other !== blueplayers.get(index) && other !== blueplayers.get(0) && other !== blueplayers.get(1)) {
        blueteamMovement(other, blueHasPoss);
      }
    }
  }

  /**
   * checks which red and blue player is closest to the ball, have them get possession and try to score
   * @time O(n^2)
   */
  function checkPos() {
    let rmin_distance = 100;
    let rmin_idx = 1;
    for (let i = 1; i < redplayers.size; i++) {
      let player = redplayers.get(i);
      let distance =
        getDistance(player.x, player.y, ball.x, ball.y) -
        player.size -
        ball.size;
      if (distance < rmin_distance) {
        rmin_distance = distance;
        rmin_idx = i;
      }
    }
    redDirections(rmin_idx);

    let bmin_distance = 100;
    let bmin_idx = 1;
    for (let i = 1; i < blueplayers.size; i++) {
      let player = blueplayers.get(i);
      let distance =
        getDistance(player.x, player.y, ball.x, ball.y) -
        player.size -
        ball.size;
      if (distance < bmin_distance) {
        bmin_distance = distance;
        bmin_idx = i;
      }
    }
    blueDirections(bmin_idx);
  }

  coverPosition();
  checkPos();
  goalkeeperDirections();
}

/**
 * shows the modal given an index for which tip to show, only if the clash royale sound is not playing and 
 * the game is active
 * @param {number} tip_index the index of which soccer tip to show
 * @time O(1)
 */
function showPopUp(tip_index) {
  if (time > 12) {
    if (tip_index !== 6) {
      if (canvasShown && showTips) {
        modalOpen = true;
        modal.style.display = "block";

        document.getElementById("titleOfModal").innerHTML = "Soccer Tip";
        document.getElementById("tip_desc").innerHTML = modal_tip_desc[tip_index];
        document.getElementById("tip_gif").src = "media/images/" + tip_index + ".gif";
      }
    } else {
      modalOpen = true;
      modal.style.display = "block";

      document.getElementById("titleOfModal").innerHTML = "Tutorial";
      document.getElementById("tip_desc").innerHTML = modal_tip_desc[tip_index];
      document.getElementById("tip_gif").src = "media/images/" + tip_index + ".gif";
    }
  }
}
/**
 * removes any active modal
 * @time O(1)
 */
function removePopUp() {
  modal.style.display = "none";
  modalOpen = false;
  if (canvasShown) {
    requestAnimationFrame(quickMatch);
    setTimeout(onTimer(), 0);
  }
}

//ALL OF THE FUNCTIONS BELOW ARE MEANT TO BE CHECKING FOR A MODAL TO APPEAR

/**
 * adds points to whichever team scored and resets the players
 * @param {boolean} isOurTeam true if our team scored, false otherwise
 * @time O(n^2)
 */
function scored(isOurTeam) {
  checkingDefense = false;
  if (isOurTeam) {
    blueteam++;
    reset();
  } else {
    redteam++;
    //MUST BE AFTER RESET()!!!! 
    if (lastTouch == blueplayers.get(1)) {
      showPopUp(2);
    } else {
      showPopUp(1);
    }
    reset();
  }
}

/**
 * checks if the player has been holding onto the ball for too long / dribbling (will show a tip)
 * @time O(1)
 */
function checkDribbling() {
  //someone has been dribbling for 4000ms (time upates after this)
  if (lastTouchHappened - time > 5) {
    if (lastTouch == blueplayers.get(1) && num_players > 2) {
      lastTouchHappened = 0;
      showPopUp(3);
    }
  }
}
/**
 * allows analysis of red's defense of the user's shot to start up
 * @time O(1)
 */
function checkDefense() {
  shotHappened = time;
  checkingDefense = true;
}

/**
 * runs with every animation frame (while checking defense) to check if the red defenders intercepted the shot
 * @time O(n)
 */
function defenseHelper() {
  let intercepted = false;
  if (secondlastTouch == blueplayers.get(1)) {
    for (let player of redplayers) {
      if (player == lastTouch && ball.x > canvas.width * (3 / 4)) {
        if (ball.xVel > 0) {
          intercepted = true;
        }
      } else {
        checkingDefense = false;
      }
    }
    if (intercepted && !shoot) {
      showPopUp(0);
    }
  }
  if (time - shotHappened > 0 && ball.x < canvas.width * 3 / 4) {
    checkingDefense = false;
  }
}

/**
 * checks to make sure the user is in the play
 * @time O(1)
 */
function checkPlayerDistance() {
  let distance = getDistance(blueplayers.get(1).x, blueplayers.get(1).y, ball.x, ball.y);
  if (distance > (canvas.width * (3 / 4)) && countdown_player_distance > 100) {
    showPopUp(4);
    countdown_player_distance = 0;
  } else {
    countdown_player_distance++;
  }
}

/**
 * gives a player velocity to go to a certain location
 * @param {Player} player player to move
 * @param {number} x x coord
 * @param {number} y y coord
 * @time O(1)
 */
function moveTo(player, x, y) {
  if (player.x + player.size > x) {
    player.setxVel(player.xVel - player.accel);
  } else if (player.x + player.size < x) {
    player.setxVel(player.xVel + player.accel);
  }
  if (player.y + player.size > y) {
    player.setyVel(player.yVel - player.accel);
  } else if (player.y + player.size < y) {
    player.setyVel(player.yVel + player.accel);
  }
}