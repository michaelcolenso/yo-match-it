/*
	Memory-match Card Game
	Version: 1.2
	Author: Cristian Nistor
	History:
		1.0stable --> first release
		1.1 --> Added the possibility to shuffle the entire deck of (52) cards
		1.2 --> Added the possibility to save the number of clicks made and to display a high scores table on game' s page
	License: GPLv3
	Demo URI: http://www.lostresort.biz/memory-game
*/
/*When the page is loaded, initiate function startGame.
The function is called in two situations: at first page load and when user clicks to reload the game
*/
$(document).ready(startGame);
//Initialize all cards and store them in an array
var allCards = [
	"cardAA", "cardA2", "cardA3", "cardA4", "cardA5", "cardA6", "cardA7", "cardA8", "cardA9", "cardA10", "cardAJ", "cardAQ", "cardAK", 
	"cardBA", "cardB2", "cardB3", "cardB4", "cardB5", "cardB6", "cardB7", "cardB8", "cardB9", "cardB10", "cardBJ", "cardBQ", "cardBK",
	"cardCA", "cardC2", "cardC3", "cardC4", "cardC5", "cardC6", "cardC7", "cardC8", "cardC9", "cardC10", "cardCJ", "cardCQ", "cardCK",
	"cardDA", "cardD2", "cardD3", "cardD4", "cardD5", "cardD6", "cardD7", "cardD8", "cardD9", "cardD10", "cardDJ", "cardDQ", "cardDK"
];
//initialize game engine
function startGame() {
		//Initialize an array of objects for later use
		var matchingGame = {};
		/*Get the first 12 elements from the array after they are suffled.
		Slice may start at any index but make sure you set the correct ending one*/
		matchingGame = allCards.sort(shuffle).slice(0,12);
		//Merge the array with itself to have pairs
		matchingGame.deck = $.merge(matchingGame, matchingGame);
		/*Next code lines perform some checks. This is due to the fact that after the game is over and before starting new one the elements
		which hold the cards are removed, with the exception of the one with "first" class. After this, the initial conditions are recreated*/
		if ($(".card:first-child").hasClass("first")) {
				$(".card:first-child").removeClass("first");
				$(".card:first-child").html('<div class="face front"></div><div class="face back"></div>');
		};
		//Reset the clicks made and pairs founded to zero
		$("#clicks, #pairs").text("0");
		//The function which shuffle the cards
		function shuffle() {
			return 0.5 - Math.random();
		};
		//Cards are shuffled again
		matchingGame.deck.sort(shuffle);
		//First child is cloned for 23 times and the elements are added to the cards' container. Children too
		for (var i=0;i<23;i++) {
			$(".card:first-child").clone().appendTo("#cards")
		};
		//initialize each card position
		$("#cards").children(".card").each(function(index) {
			//align the cards to be 6x4 ourselves
			$(this).css({
				"left" : ($(this).width() + 10) * (index % 6),
				"top" : ($(this).height() + 10) * Math.floor(index/6)
				});
			//Get a pattern from the shuffled deck. Pattern is usefull to set the background of the HTML element to display cards
			var pattern = $(matchingGame.deck).get();
			/*Using get() method is more flexible than push(). Using push() in IE somehow the first child does not have a pattern defined.
			Using get implies to use the pattern array based on its index. After all cards are set when user cliks on one of them call selectCard()*/
			$(this).find(".back").addClass(pattern[index]);
			$(this).attr("data-pattern", pattern[index]);
			$(this).click(selectCard);
		});
		/*Use of setTimeout() method is necessary when getting the date stored in higscores.xml file to set a decent delay for the script to write new data
		if a user inputs a valid email address and a non empty name string.*/
		setTimeout(function() {
		//Empty the content of the table which holds the highscores stored, on game's page
		$("#update-val tr").remove();
		//Initiliaze the array which will hold the pairs name-email address
		var items=[];
		//AJAX native jQuery method
		$.ajax({
			type: "GET",
			url: "data/highscores.xml",
			dataType: "xml",
			success: function(xml) {
				//On succes find in highscores.xml file <highscore> elements and store in items array pairs name-email address
				$(xml).find('highscore').each(function(){
					var name_text = $(this).find('name').text();
					var value_text = parseInt($(this).find('value').text());
					/*Use associative arrays like JSON structure, better for sorting based on natural indexes.
					First reflex was to use arrays in a form like items[name_text]=value_text, but was very difficul to sort it*/
					items.push({"key":name_text,"value":value_text});
				}); //close each(
				//If no highscore yet display a message, otherwise display the first 20 records, sorted ascending by number of cliks made
				if (items.length >= 1) {
					$("#update-val").html("<thead><td>Name</td><td>Highscore</td></thead>");
					var j;
					//Function which sort ascending elements
					var cmp = function(x, y){
							return x > y ? 1 : x < y ? -1 : 0
						}
					//Sort items ascending based on clicks values
					items = items.sort(function(x, y){
						return cmp(x.value, y.value) < cmp(y.value, x.value) ? -1:1
					});
					/*Treat differently the situations in which array has less or more than 20 items. IE doesn't know to stop iterations 
					if array has less than 20 items using for (j=0;j<=19;j++) loop*/
					if (items.length<20) {
						for (j in items) {
							$('<tr></tr>').html('<td>' + items[j].key + '</td>' + '<td>' + items[j].value + '</td>').appendTo('#update-val');
							}
						} else {
							for (j=0;j<=19;j++) {
								$('<tr></tr>').html('<td>' + items[j].key + '</td>' + '<td>' + items[j].value + '</td>').appendTo('#update-val');
							}
						}
				} else {
						$('<tr></tr>').html('<td>Hmmmm... no records so far!</td>').appendTo('#update-val');
					}
			}
		}); //close $.ajax(
		},1800);
	};
function selectCard() {
	// we do nothing if there are already two cards flipped.
	if ($(".card-flipped").size() > 1) {
		return;
	}
	//Update the stored clicks value ONLY if card is flipped.
	if ($(this).hasClass("card-flipped") == false) {
		update($("#clicks"));
		};
	$(this).addClass("card-flipped");
	// check the pattern of both flipped card 0.5s later.
	if ($(".card-flipped").size() == 2) {
		setTimeout(checkPattern,500);
		}
	};
//Check if the both flipped cards are identical or not
function checkPattern() {
		//If they are identical remove them from visual area
		if (isMatchPattern()) {
			$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
			$(".card-removed").bind("fadeOut", removeTookCards);
			//Add class noclick, set z-index to -1 value. If only set opacity to 0 or display to none (IE older versions) cliks are STILL possible
			setTimeout(function() {
				$(".card-removed").addClass("noclick")
				}, 300);
			} else {
				$(".card-flipped").removeClass("card-flipped");
			}
		//Perform check if all cards were matched, and if true, display a box to enter a name and an email address which will be stored for later use
		if ($("#cards").children().length == $("#cards").children(".card-removed").length) {
			$("#go-2-nxt-lvl").html("<p>Game Finished!<br />Insert name and email address:<br /><form id='record-data'><table><tr><td><label for='name_value'>Name</label></td><td><input  type=text' id='name_value' value='' maxlength=15 /></td></tr><tr><td><label for='ea_value'>Email Address</label></td><td><input type=text' id='ea_value' value='' maxlength=35 /></td></tr></table></form><p>Note that, empty imput fields or with no valid email address will not be recorded</p>Click OK to restart the game.<br /><button id='reload'>OK</button></p>").fadeIn(1200);
			$("#reload").on("click", function() {
				$("#go-2-nxt-lvl").fadeOut(500);
				setTimeout(function() {
					$(".card:first-child").addClass("first").removeClass("card-removed noclick");
					$(".card").not(".first").remove();
					$(".first").html();
					var hs_value = $("#clicks").text();
					var name_value = $("#name_value").val();
					var ea_value = $("#ea_value").val();
					//Pass to the script: name, email address and highscore value
					$.post("data/highscore.php?name=" + name_value + "&value=" + hs_value + "&email_add=" + ea_value);
					//Restart game
					setTimeout(function() {
						startGame()
					},100);
				},400);
			});
		}
		//Update the number of matched pairs
		var pairs = Math.floor($(".card-removed").length/2);
		if ($("#pairs").text() != pairs) {
			$("#pairs").text(pairs);
		}
	};
//Check if two cards are identical, based on data-pattern value
function isMatchPattern() {
	var cards = Array();
	$(".card-flipped").each(function() {
		cards.push($(this).attr("data-pattern"));
	});
	return (cards[0] == cards[1]);
};

//Remove cards from visual field
function removeTookCards() {
	$(".card-removed").remove();
}
//The function to update the number of clicks
function update(j) {
	var n = parseInt(j.text(), 10);
	j.text(n + 1);
}
