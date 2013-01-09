$(document).ready(startGame);
function startGame() {
    var matchingGame = {};
    matchingGame.deck = [
        "cardAK", "cardAQ", "cardBQ", "cardA9", "cardB9", "cardC9",
        "cardAQ", "cardBK", "cardBJ", "cardA9", "cardB9", "cardC9",
        "cardAJ", "cardAJ", "cardBQ", "cardA10", "cardB10", "cardC10",
        "cardB10", "cardA10", "cardC10", "cardBJ", "cardBK", "cardAK",
    ];

    if ($(".card:first-child").hasClass("first")) {

        $(".card:first-child").removeClass("first");
        $(".card:first-child").html('<div class="face front"></div><div class="face back"></div>');
};

    function shuffle() {
        return 0.5 - Math.random();
    };
    matchingGame.deck.sort(shuffle);
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

    //get a pattern from the shuffled deck
    var pattern = $(matchingGame.deck).get();

    $(this).find(".back").addClass(pattern[index]);
    $(this).attr("data-pattern", pattern[index]);
    $(this).click(selectCard);
});
};

function selectCard() {

    // we do nothing if there are already two cards flipped.
    if ($(".card-flipped").size() > 1) {
        return;
    }

    if ($(this).hasClass("card-flipped") == false) {
        update($("#clicks"));
        };

    $(this).addClass("card-flipped");

    // check the pattern of both flipped card 0.5s later.
    if ($(".card-flipped").size() == 2) {

        setTimeout(checkPattern,500);

        }
    };
function checkPattern() {

    var pairs = Math.floor($(".card-removed").length/2);

    if ($("#pairs").text() != pairs) {
        $("#pairs").text(pairs);
}

    if (isMatchPattern()) {

        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        $(".card-removed").bind("fadeOut", removeTookCards);

    } else {
        $(".card-flipped").removeClass("card-flipped");

    }

    if ($("#cards").children().length == $("#cards").children(".card-removed").length) {

        $("#go-2-nxt-lvl").html("<p>Game Finished!<br /> Click OK to restart the game.<br /><button id='reload'>OK</button></p>").fadeIn(1200);

        $("#reload").on("click", function() {

        $("#go-2-nxt-lvl").fadeOut(500);

        setTimeout(function(){
            $(".card:first-child").addClass("first").removeClass("card-removed");
            $(".card").not(".first").remove();
            $(".first").html();
            startGame()
            },400);
        });
    }
    };
function isMatchPattern() {

    var cards = Array();

    $(".card-flipped").each(function() {

    cards.push($(this).attr("data-pattern"));

    });

    return (cards[0] == cards[1]);

    };
