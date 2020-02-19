// AJAX call to get quote
// function getQuote() {
//     var quoteURL = "https://api.paperquotes.com/apiv1/quotes/?tags=";

//     var userInput = $.ajax({
//         url: "https://api.paperquotes.com/apiv1/quotes/?tags=love",
//         method: "GET",
//         headers: {
//             Authorization: "Token{9837bc81e212bd1f0b9170070782152cd03ed12b}"
//         }
//     }).then(function(response) {
//         console.log(response);
//     });
// }

// getQuote();
// var quote = results[0].quote;
// var author = results[0].author;

$(document).ready(function() {
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        getMood();
    });

    // remove the modal on click of X
    $(".modal-close").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
    });

    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();
        console.log(selectedMood);
        if (selectedMood === "I don't know, pick for me!") {
            console.log("this is working");
        } else {
            return selectedMood;
        }
    }
});
