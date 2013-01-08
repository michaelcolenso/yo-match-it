$(document).ready(startGame);

var allCards = [
    "sprite-YO12", "sprite-YO14", "sprite-YO22", "sprite-YO29", "sprite-YO33", "sprite-YO45"
];

var gameLevel = 1;

//inititalize the game
function startGame() {

		var matchingGame = {};


    //Get the first 3 elements from the array after they are shuffled
		matchingGame = allCards.sort( shuffle ).slice( 0, 2 );
    //Merge the array with itself to have pairs
		matchingGame.deck = $.merge( matchingGame, matchingGame );

    //resets the initial conditions when starting the game over
		if ( $( ".card:first-child" ).hasClass( "first" )) {
				$( ".card:first-child" ).removeClass( "first" );
				$( ".card:first-child" ).html( '<div class="face front"></div><div class="face back"></div>' );
		};

    //resets the clicks and pairs matched counter
		$( "#clicks, #pairs" ).text( "0" );

    //function to shuffle the cards
		function shuffle() {
			return 0.5 - Math.random();
		};

    //shuffle the cards again
		matchingGame.deck.sort( shuffle );

    /*THIS IS WHERE WE CHANGE HOW MANY CXARDS IN THE GAME OR LEVEL
		First child is cloned 'n' times and the elements  (and children of the elements)
    are added to the cards' container. Total cards are 'n+1'
    */
		for ( var i = 0; i < 3; i++ ) {
			$( ".card:first-child" ).clone().appendTo( "#cards" )
		};

    //initialize the cards position
		$( "#cards" ).children( ".card" ).each( function(index) {
			$( this ).css( {
				"left" : ( $( this ).width() + 80 ) * ( index % 2 ), //the number after the modulo is how many cards/row 
				"top" : ( $( this ).height() + 80 ) * Math.floor( index / 2 )
				});

			var pattern = $( matchingGame.deck ).get();
			$( this ).find( ".back" ).addClass( pattern[index] );
			$( this ).attr( "data-pattern", pattern[index] );
			$( this ).click( selectCard );
		});

		setTimeout( function() {
		$( "#update-val tr" ).remove();

		var items=[];
		$.ajax( {
			type: "GET",
			url: "data/highscores.xml",
			dataType: "xml",
			success: function(xml) {
				$( xml ).find( 'highscore' ).each( function() {
					var name_text = $( this ).find( 'name' ).text();
					var value_text = parseInt($( this ).find( 'value' ).text() );
					items.push( { "key": name_text, "value": value_text });
				});

				if (items.length >= 1) {
					$( "#update-val" ).html( "<thead><td>Name</td><td>Highscore</td></thead>" );
					var j;
					var cmp = function( x, y ) {
							return x > y ? 1 : x < y ? -1 : 0
						}
					items = items.sort(function(x, y){
						return cmp(x.value, y.value) < cmp(y.value, x.value) ? -1:1
					});

					if (items.length<20) {
						for ( j in items ) {
							$( '<tr></tr>' ).html( '<td>' + items[j].key + '</td>' + '<td>' + items[j].value + '</td>' ).appendTo('#update-val' );
							}
						} else {
							for ( j=0; j <= 19; j++ ) {
								$( '<tr></tr>' ).html( '<td>' + items[j].key + '</td>' + '<td>' + items[j].value + '</td>').appendTo( '#update-val' );
							}
						}
				} else {
						$( '<tr></tr>' ).html( '<td>Hmmmm... no records so far!</td>' ).appendTo( '#update-val' );
					}
			}
		});
		},1800);
	};

function selectCard() {
  //do nothing if there are already two cards flipped
	if ( $( ".card-flipped" ).size() > 1 ) {
		return;
	}

  //update the stored clicks value ONLY if the card is flipped
	if ( $( this ).hasClass( "card-flipped" ) == false ) {
		update( $( "#clicks" ));
		};

	$( this ).addClass( "card-flipped" );

	if ( $( ".card-flipped" ).size() == 2 ) {
		setTimeout( checkPattern, 500 );
		}
	};
//check to see if both the flipped cards are identical
function checkPattern() {

		//If they are identical remove them from visual area
		if ( isMatchPattern () ) {
			$( ".card-flipped" ).removeClass( "card-flipped" ).addClass( "card-removed" );
			$( ".card-removed" ).bind( "fadeOut", removeTookCards );

			//Add class noclick, set z-index to -1 value. If only set opacity to 0 or display to none (IE older versions) clicks are STILL possible
			setTimeout( function() {
				$( ".card-removed" ).addClass( "noclick" )
				}, 300 );
			} else {
				$( ".card-flipped" ).removeClass( "card-flipped" );
			}

		//Perform check if all cards were matched, and if true, display a box to enter a name and an email address which will be stored for later use
		if ( $( "#cards" ).children().length == $( "#cards" ).children( ".card-removed" ).length ) {

      if ( gameLevel === 3 ) {
        $("#passport").css( 'height', '552px' );
        $( "#passport" ).html( "<p>Game Finished!<br /></p>Click OK to restart the game.<br /></p><p><button class='btn' id='reload'>OK</button></p>" ).fadeIn( 1200 );

      } else if ( gameLevel === 2 ) {
        $("#passport").css( 'height', '552px' );
        $( "#passport" ).html( "<p>Level Complete!<br /></p>Click OK to go to level 3.<br /></p><p><button class='btn' id='reload'>OK</button></p>" ).fadeIn( 1200 );

      } else if ( gameLevel === 1 ) {
        $("#passport").css( 'height', '552px' );
        $( "#passport" ).html( "<p>Level Complete!<br /></p>Click OK to go to level 2.<br /></p><p><button class='btn' id='reload'>OK</button></p>" ).fadeIn( 1200 );
      }

      //Check to see if we are at the end of the game or not
			$( "#reload" ).on( "click", function() {
        //set level to next gameLevel
        gameLevel++

				$( "#passport" ).animate( { 
          height: "0px"
        }, 500 );
        $( "#passport" ).fadeOut( 500 );
				setTimeout( function () {
					$( ".card:first-child" ).addClass( "first" ).removeClass( "card-removed noclick" );
					$( ".card" ).not( ".first" ).remove();
					$( ".first" ).html();

          //var hs_value = $( "#clicks" ).text();
          //var name_value = $( "#name_value" ).val();
          //var ea_value = $( "#ea_value" ).val();

          //Pass to the script: name, email address and highscore value
          //$.post( "data/highscore.php?name=" + name_value + "&value=" + hs_value + "&email_add=" + ea_value );

          if ( gameLevel >= 4 ) {
                gameLevel = 1;
            }
					//Restart game
					setTimeout( function () {
						startGame()
					}, 100 );
				}, 400 );
			});
		}

		//Update the number of matched pairs
		var pairs = Math.floor( $( ".card-removed" ).length/2 );
		if ( $( "#pairs" ).text() != pairs ) {
			$( "#pairs" ).text( pairs );
		}
	};

//Check if two cards are identical, based on data-pattern value
function isMatchPattern () {
	var cards = Array();
	$( ".card-flipped" ).each( function () {
		cards.push ( $( this ).attr ( "data-pattern" ));
	});
	return ( cards[0] == cards[1] );
};

//Remove cards from visual field
function removeTookCards() {

	$( ".card-removed" ).remove();
}

//The function to update the number of clicks
function update( j ) {
	var n = parseInt( j.text(), 10 );
	j.text( n + 1 );
}
