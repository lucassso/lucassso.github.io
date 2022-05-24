/**
 * renders the soccer ball object onto the canvas
 * @time O(1)
 */
 function renderBall() {
    context.save();
    context.beginPath();
    context.fillStyle = "black";
    context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.restore();
  }
  
  /**
   * renders each player object on each team onto the canvas
   * @time O(n)
   */
  function renderPlayers() {
    /**
     * the user will be distinguishable from the other players on their team because of a different tone of blue 
     */
    for (let player of blueplayers) {
      if (player == blueplayers.get(1)) {
        context.beginPath();
        context.fillStyle = "#00B0FF"; //blue 100%, green 176
        context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        context.fill();
        context.closePath();
      } else {
        context.beginPath();
        context.fillStyle = "#000099"; // blue 60%
        context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        context.fill();
        context.closePath();
      }
    }
    for (let player of redplayers) {
      context.beginPath();
      context.fillStyle = "#990000"; //red 60%
      context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      context.fill();
      context.closePath();
    }
    context.restore();
  }
  /**
   * renders the grass/lines on the grass to represent the field
   * @time O(1)
   */
  function renderBackground() {
    /**
     * draws an open circle
     * @param {number} x x coord
     * @param {number} y y coord
     * @param {number} rad radius of circle
     * @param {number} start_ang starting angle of line
     * @param {number} end_ang ending angle of line
     */
    function drawArc(x, y, rad, start_ang, end_ang) {
      context.beginPath();
      context.arc(x, y, rad, start_ang, end_ang, false);
      context.stroke();
      context.closePath();
    }
    /**
     * draws an open rectangle
     * @param {number} x x coord
     * @param {number} y y coord
     * @param {number} width width of rect
     * @param {number} height height of rect
     */
    function drawRect(x, y, width, height) {
      context.beginPath();
      context.rect(x, y, width, height)
      context.stroke();
      context.closePath();
    }
    /**
     * draws a straight line
     * @param {number} move_x x coord to start at 
     * @param {number} move_y y coord to start at
     * @param {number} line_x x coord to end at
     * @param {number} line_y y coord to end at
     * @param {number} lineWidth width of line
     */
    function drawLine(move_x, move_y, line_x, line_y, doFill, lineWidth) {
      context.beginPath();
      context.moveTo(move_x, move_y);
      context.lineTo(line_x, line_y);
      context.lineWidth = lineWidth;
      context.stroke();
      context.closePath();
    }
    context.save();
  
    // Outer lines and background
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#569E1A";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "#FFF";
    context.stroke();
    context.closePath();
    context.fillStyle = "#FFF";
  
    // Mid line
    drawLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, 2);
  
    //Mid circle
    drawArc(canvas.width / 2, canvas.height / 2, 53, 0, 2 * Math.PI, false);
    //Mid point
    drawArc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI, false);
  
    //Home penalty box
    drawRect(0, (canvas.height - 146) / 2, 44, 146);
  
    //big goalie box
    drawRect(0, (canvas.height - (canvas.height * (3 / 5))) / 2, 132, canvas.height * 3 / 5)
  
    //Home goal
    context.strokeStyle = "#5F5F5F";
    context.lineWidth = 5;
    drawLine(1, canvas.height / 2 - 73, 1, canvas.height / 2 + 73, 5);
    context.lineWidth = 2;
    context.strokeStyle = "#FFF";
  
    //Home penalty point
    drawArc(88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  
    //Away goal box
    drawRect(canvas.width - 44, (canvas.height - 146) / 2, 44, 146);
  
    //away bigger goalie box
    drawRect(canvas.width - 132, (canvas.height - (canvas.height * (3 / 5))) / 2, 132, canvas.height * 3 / 5)
    //Away goal
    context.strokeStyle = "#5F5F5F";
    context.lineWidth = 5;
    drawLine(canvas.width - 1, canvas.height / 2 - 73, canvas.width - 1, canvas.height / 2 + 73, 5)
    context.lineWidth = 2;
    context.strokeStyle = "#FFF";
    //Away penalty point
    drawArc(canvas.width - 88, canvas.height / 2, 1, 0, 2 * Math.PI, true);
  
    //Home L corner
    drawArc(0, 0, 12, 0, 0.5 * Math.PI, false);
    //Home R corner
    drawArc(0, canvas.height, 12, 0, 2 * Math.PI, false);
    //Away R corner
    drawArc(canvas.width, 0, 12, 0.5 * Math.PI, 1 * Math.PI, false);
    //Away L corner
    drawArc(
      canvas.width,
      canvas.height,
      12,
      1 * Math.PI,
      1.5 * Math.PI,
      false
    );
    context.restore();
  }