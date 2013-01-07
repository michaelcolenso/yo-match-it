/* ------------------------------------------------------------------
 * Title: travelodge.js
 * Date: 10/9/2012
 * Version: 0.1
 * Author: Phil Puleo
 * Company: Phil Puleo Consulting LLC
 * Description: Logic and behaviors for the Travelodge Match-It game.
 * Dependencies:
 *   -jQuery 1.7+
 *   
 * Copyright 2012, Phil Puleo Consutling LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------*/
 
// Extend the array prototype to include a random shuffle function
Array.prototype.shuffle = function() {
  for (var i = this.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

// Provide an object for extensibility and to play nice with other scripts.
window.travelodge = (function() {

  // Use strict mode
  "use strict";
  
  // Create an object to return.
  var travelodge = {
    cardArray: [
      {cid: 101, file: "game-harry.png"},
      {cid: 102, file: "game-liam.png"},
      {cid: 103, file: "game-louis.png"},
      {cid: 104, file: "game-niall.png"},
      {cid: 105, file: "game-zayn.png"},
      {cid: 101, file: "game-harry-2.png"},
      {cid: 102, file: "game-liam-2.png"},
      {cid: 103, file: "game-louis-2.png"},
      {cid: 104, file: "game-niall-2.png"},
      {cid: 105, file: "game-zayn-2.png"}  
    ],
    compareArray: [],
    score: 0
  };
  
  // Event Handlers
  var session = 0;
  // Respond to card flips
  $(".container").on("click",".panel", function() { 
    if (session == 0) 
    {
      timerGame.Start();
      session = 1;
    }
    // If this card is already face up, ignore the click.
    if($(this).hasClass("flip")) {
      return false;
    }
    
    // Add the flipped class to trigger the CSS transform flip.
    $(this).addClass("flip");
    
    // Push the card into the compare array.
    travelodge.compareArray.push(this);
    
    // If there are two cards in the compare array... 
    if(travelodge.compareArray.length === 2) {
    
      // Check to see if they match.
      cardCheck();
    }
    
  });
  
  // Respond to the Play Again button
  $(".play-again").click(function() {
    location.reload();
  });
  
  // Functions
  
  // Function to check if two flipped cards match.
  function cardCheck() {
  
    var card1 = travelodge.compareArray[0];
    var card2 = travelodge.compareArray[1];
    
    // If the cards match...
    if($(card1).find("img.cardfront").attr("id") === $(card2).find("img.cardfront").attr("id")) {
      
     travelodge.score += 1;
     if(travelodge.score % 5 === 0) {
       youWin();
       omnitureLbox.lbxEvent4();
       timerGame.Stop();
     }
    }
    
    // If the cards don't match...
    else {
      
      // Flip the unmatched cards back over.
      setTimeout(function() {
        $(card1).removeClass("flip");
        $(card2).removeClass("flip");
      }, 1200);
      
    
    }
    
    // Clear out the compare array for the next turn.
    travelodge.compareArray.length = 0;
     
  }
  
  // Function to build the playing board.
  function buildBoard() {
    
    // Clear any previous games
    $("#gameboard").empty();
    
    // Clear the score
    //travelodge.score = 0;
    
    // Create a temporary array to hold all the cards for the board.
    var boardArray = [];
    
    // Push in each of the cards from the cardArray twice.
    for(var h=0; h < travelodge.cardArray.length; h++) {
      boardArray.push(travelodge.cardArray[h]);
      //boardArray.push(travelodge.cardArray[h]); Push in once because 2 cards are not the same
    }
    
    // Shuffle the board array.
    boardArray.shuffle();
    
    // Build the HTML for each card and card row.
    var cardHTML = "";
    
    // We have 18 cards so 6 cards in 3 rows...
    for(var i=0; i < 2; i++) {
      
      // Build the card row
      cardHTML += '<div class="row card-row">';
      
      // For each row, build the cards...
      for(var j=0; j < 5; j++) {
        cardHTML += '<div class="span2 panel">';
        cardHTML += '<div class="face front">';
        cardHTML += '<img class="cardback" src="ui/img/game-card.png" alt="Card Back" /></div>';
        cardHTML += '<div class="face back">';
        cardHTML += '<img class="cardfront" id="'+boardArray[j+i*5].cid+'" src="ui/img/'+boardArray[j+i*5].file+'" alt="Card Front" /></div>';
        cardHTML += '</div>';
      }
      
      // Finish the row.
      cardHTML += '</div>';
      
    }
    
    // Add the rows of cards to the gameboard.
    $("#gameboard").append(cardHTML);


  }
  
  // Function to celebrate when you win.
  function youWin() {
    $(".alert-success").show();
    $("#gameboard").hide();
    //$(".alert-success-notice").trigger('click');
  }
  
  // Build the board.
  buildBoard();
  
  // Return the object
  return travelodge;  

})(this); // self-execute

