/**
 * when the close button is clicked closes the modal
 * @time O(1)
 */
span.onclick = function () {
    removePopUp();
}

/**
 * when anywhere outside the modal content is clicked the content is removed
 * @param {*} event where on the window a click was registered
 * @time O(1)
 */
window.onclick = function (event) {
    if (event.target == modal) {
        removePopUp();
    }
}

/**
 * when the slider is moved, remake the teams with the appropriate number of players and edit the button
 * @time O(1)
 */
document.getElementById("slider").oninput = function () {
    let numPlayers = this.value;
    num_players = this.value;
    document.getElementById("value").innerHTML = numPlayers + "v" + numPlayers + " Match";
    makeTheTeams();
}
/**
 * when the show tips toggle is clicked redo opacity and change variables
 * @time O(1)
 */
toggleButton1.oninput = function () {
    toggle1 *= -1;
    if (toggle1 == 1) {
        showTips = true;
    } else { showTips = false; }
    if (showTips) {
        this.style.opacity = "1";
    } else {
        this.style.opacity = "0.7";
    }
}
/**
 * mimics a :hover pseudo-element except not overwritten by the above function
 * @time O(1)
 */
toggleButton1.onmouseover = function () {
    this.style.opacity = "1";
}
/**
 * when the mouse no longer hovers remove the opacity
 * @time O(1)
 */
toggleButton1.onmouseout = function () {
    if (!showTips) { this.style.opacity = "0.7"; }
}

/**
 * when the play audio toggle is clicked redo opacity and change variables
 * @time O(1)
 */
toggleButton2.oninput = function () {
    toggle2 *= -1;
    if (toggle2 == 1) {
        showAudio = true;
    } else { showAudio = false; }
    if (showAudio) {
        this.style.opacity = "1";
    } else {
        this.style.opacity = "0.7";
    }
}
/**
 * mimics a :hover pseudo-element except not overwritten by the above function
 * @time O(1)
 */
toggleButton2.onmouseover = function () {
    this.style.opacity = "1";
}
/**
 * when the mouse no longer hovers remove the opacity
 * @time O(1)
 */
toggleButton2.onmouseout = function () {
    if (!showAudio) { this.style.opacity = "0.7"; }
}

/**
* handles keyboard keys being released
* @param {*} e KeyEvent of which key(s) were released
* @time O(1)
*/
document.onkeyup = function (e) {
    if (e.key === 'w' || e.key === 'W' || e.key == 'ArrowUp') {
        up = false;
    }
    if (e.key === 'a' || e.key === 'A' || e.key == 'ArrowLeft') {
        left = false;
    }
    if (e.key === 's' || e.key === 'S' || e.key == 'ArrowDown') {
        down = false;
    }
    if (e.key === 'd' || e.key === 'D' || e.key == 'ArrowRight') {
        right = false;
    }
    if (e.key === ' ') {
        shoot = false;
    }
    if (e.key === 'Shift') {
        run = false;
    }
    if (e.key === 'r' || e.key === 'R') {
        restart = false;
    }

};
/**
 * handles keyboard keys being pressed
 * @param {*} e KeyEvent of which key(s) were pressed
 * @time O(n)
 */
document.onkeydown = function (e) {
    if (e.key === 'w' || e.key === 'W' || e.key == 'ArrowUp') {
        up = true;
    }
    if (e.key === 'a' || e.key === 'A' || e.key == 'ArrowLeft') {
        left = true;
    }
    if (e.key === 's' || e.key === 'S' || e.key == 'ArrowDown') {
        down = true;
    }
    if (e.key === 'd' || e.key === 'D' || e.key == 'ArrowRight') {
        right = true;
    }
    if (e.key === ' ') {
        shoot = true;
    }
    if (e.key === 'Shift') {
        run = true;
    }
    if (e.key === 'r' || e.key === 'R') {
        restart = true;
    }
    if (e.key === 'e' || e.key === 'E') {
        //swtich player if necessary
        if (num_players > 2) {
            switchPlayer();
        }
    }

};

document.getElementById("backBtn").onclick = function () {
    goBack();
}

document.getElementById("tutorial").onclick = function () {
    showPopUp(6);
}
document.getElementById("newGame").onclick = function () {
    onTimer();
    quickMatch();
    doCountdown = true;
    countdownLabel = 2;
    makeTheTeams();
}

