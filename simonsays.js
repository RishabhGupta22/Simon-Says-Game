

$(document).ready(function() {
  // clear the console
  console.clear();
  var redSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
  var blueSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
  var greenSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
  var yellowSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
  var mute = false;
  var strikeCount = 0;
  var strict = false;
  var playing = false;
  var simonArray = [];
  var count = 0;
  var tempo = 1;
  var winNumber = 20;
  
  activateBoard(false);
  
  // buttons - startBtn, strictBtn, muteBtn  
  $("#startBtn").click(function() {
    
    // check if game is being played
    console.log("playing", playing);
    if (playing) {
      // reset game
      // set strike count to zero
      strikeCount = 0;
      // empty simonArray
      simonArray.length = 0;
      // set count to 0
      count = 0;
      // reset tempo
      tempo = 1;
    } else {
      playing = true;
      $("#startBtn")
        .addClass("control-btn-active");
    }
    // check for strict, if strict is true set strikeCount to 1 and update strikeInner
    if (strict) {
      strikeCount = 1;
      console.log("Starting new game with strict enabled.");
    } else {
      strikeCount = 0;
      console.log("Starting new game with strict not enabled.");
    }
    updateStrikeInner(strikeCount);
    updateCountInner(count);
    
    // start new game
    computerTurn();
    
  });
  
  $("#strictBtn").click(function() {
    
    $("#strictBtn").toggleClass("control-btn-active");
    strikeCount = 1;
    updateStrikeInner(strikeCount);
    if (strict) {
      strict = false;
    } else {
      strict = true;
    }
    console.log("strict", strict);
   
  });
  
 
  
  
  
  // buttons - redButton, blueButton, yellowButton, greenButton
  $("#redButton").click(function() {
    buttonCheck(0);
  });
  
  $("#blueButton").click(function() {
    buttonCheck(1);
  });
  
  $("#yellowButton").click(function() {
    buttonCheck(2);
  });
  
  $("#greenButton").click(function() {
    buttonCheck(3);
  });
  
  // computer move generator and board control
  function newGame() {
    // reset game
    // set strike count to zero
    strikeCount = 0;
    // empty simonArray
    simonArray.length = 0;
    // set count to 0
    count = 0;
    // reset tempo
    tempo = 1;
    if (strict) {
      strikeCount = 1;
      console.log("Starting new game with strict enabled.");
    } else {
      strikeCount = 0;
      console.log("Starting new game with strict not enabled.");
    }
    updateStrikeInner(strikeCount);
    updateCountInner(count);
    // start new game
    computerTurn();
  }
  
  function setTempo() {
    // set tempo
    switch(count) {
      case 5:
        tempo = 0.8;
        break;
      case 9:
        tempo = 0.6;
        break;
      case 13:
        tempo = 0.4;
        break;
    }
  }
  
  function buttonCheck(buttonId) {
    // light up the button and play the sound
    lightButton(buttonId);
    
    // check if sequence is correct
    if (buttonId == simonArray[count]) {
      // correct button press, increment count
      count += 1;
      updateCountInner(count);
      if (count < winNumber && count == simonArray.length) {
        setTempo();
        count = 0;
        computerTurn();
      } else if (count == winNumber) {
        updateFeedbackTextInner("YOU WIN!");
        var i = 0;
        var interval = setInterval(function() {
          i++;
          if (i > 1) {
            clearInterval(interval);
            // restart game
            newGame();
          }
        }, 1000);
      }      
    } else {
      // check number of strikes
      if ((strikeCount + 1) < 2) {
        strikeCount += 1;
        updateStrikeInner(strikeCount);
        count = 0;
        updateFeedbackTextInner("STRIKE");
        activateBoard(false);
        var i = 0;
        var interval = setInterval(function() {
          i++;
          if (i > 1) {
            clearInterval(interval);
            replayCompTurn();
          }
        }, 1000);         
      } else {
        updateFeedbackTextInner("LOST GAME");
        var i = 0;
        var interval = setInterval(function() {
          i++;
          if (i > 1) {
            clearInterval(interval);
            // restart game
            newGame();
          }
        }, 1000); 
      }   
    }
  }
  
  function lightButton(buttonId) {
    activateBoard(false);
    if (mute === false) {
      playSound(buttonId);
    }
    $("#" + gameboard[buttonId]).addClass("buttonLit");
    window.setTimeout(function() {
      $("#" + gameboard[buttonId]).removeClass("buttonLit");
      activateBoard(true);
    }, 500 * tempo);
  }
  
  function replayCompTurn() {
    // deactivate gameboard
    activateBoard(false);
    
    // update feedbackText to LISTEN or WATCH depending on if muted or not
    var feedbackText = "LISTEN";
    if (mute) {
      feedbackText = "WATCH";
    }
    updateFeedbackTextInner(feedbackText);
    
    // show moves to player and play sound or not
    showCompMoves();
    var i = 0;
    var interval = setInterval(function() {
      i++;
      if (i > 1) {
        clearInterval(interval);
        activateBoard(true);
        updateFeedbackTextInner("REPEAT");
      }
    }, (simonArray.length) * 600 * tempo);
  }
  
  function computerTurn() {
    // deactivate gameboard
    activateBoard(false);
    
    // update feedbackText to LISTEN or WATCH depending on if muted or not
    var feedbackText = "LISTEN";
    if (mute) {
      feedbackText = "WATCH";
    }
    updateFeedbackTextInner(feedbackText);
    
    // generate new move
    genNewMove();
    
    // show moves to player and play sound or not
    showCompMoves();
    
    // activate board
    var i = 0;
    var interval = setInterval(function() {
      i++;
      if (i > 1) {
        clearInterval(interval);
        activateBoard(true);
        updateFeedbackTextInner("REPEAT");
      }
    }, (simonArray.length) * 600 * tempo);
    
  }
  
  function activateBoard(check) {
    if (check) {
      // activate the buttons on the gameboard
      $("#redButton").prop("disabled", false);
      $("#blueButton").prop("disabled", false);
      $("#yellowButton").prop("disabled", false);
      $("#greenButton").prop("disabled", false);
    } else {
      // deactivate the buttons the gameboard
      $("#redButton").prop("disabled", true);
      $("#blueButton").prop("disabled", true);
      $("#yellowButton").prop("disabled", true);
      $("#greenButton").prop("disabled", true);
    }
  }
  
  function genNewMove() {
    var newMove = Math.floor(Math.random() * gameboard.length);
    simonArray.push(newMove);
    console.log(JSON.stringify(simonArray));
  }
  
  function playSound(button) {
    switch(button) {
      case 0:
        redSound.play();
        break;
      case 1:
        blueSound.play();
        break;
      case 2:
        yellowSound.play();
        break;
      case 3:
        greenSound.play();
        break;
    }
  }
  
  function showCompMoves() { 
    var i = 0;
    var interval = setInterval(function() {
      showCompMove(i);
      i++;
      if (i >= simonArray.length) {
        clearInterval(interval);
      }
    }, 1000 * tempo);
  }
  
  function showCompMove(i) {
    if (mute === false) {
      playSound(simonArray[i]);
    }
    $("#" + gameboard[simonArray[i]]).addClass("buttonLit");
    window.setTimeout(function() {
      $("#" + gameboard[simonArray[i]]).removeClass("buttonLit");
    }, 900 * tempo);
  }
  
  // dom updaters
  function updateStrikeInner(strikes) {
    var strikeText = "";
    if (strikes == 1) {
      strikeText = "X";
    }
    $("#strikeInner").html(strikeText);
  }
  
  function updateCountInner(count) {
    if (count === 0) {
      countText = "--";
    } else {
      countText = count;
    }
    $("#countInner").html(countText);
  }
  
  function updateFeedbackTextInner(feedbackText) {
    $("#feedbackTextInner").html(feedbackText);
  }
  
  // tips
  $("#tipText").html(tips[0]);
  
  function rotateTip() {
    // #tipText for tip div
    $("#tipText").html(getNextTip($("#tipText").html()));
  }
  
  (function rotateTips() {
    setInterval(function() {rotateTip();}, 10000)    
  })();
  
  function getNextTip(lastTip) {
    // return the next tip
    var lastTipIndex = tips.indexOf(lastTip);
    var nextTipIndex = (lastTipIndex == (tips.length - 1) || lastTipIndex == -1) ? 0 : lastTipIndex + 1
    return tips[nextTipIndex];
  }
  
});

var tips = [
  "Press START to play.",
  "Press RESET to restart your game.",
  "STRICT mode allows for no mistakes.",
  "Achieve a COUNT of 20 to win the game."
];

var gameboard = [
  "redButton",
  "blueButton",
  "yellowButton",
  "greenButton"
];