$(document).ready(function() {
    // quote section variables
    var finalMood = "";
    var quoteKey = "";
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        getMood();
        getQuote();
    });

    // remove the modal on click of X
    $(".modal-close").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
    });

    // get the mood from user input
    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();
        if (selectedMood !== "I don't know, pick for me!") {
            finalMood = selectedMood;
        } else {
            console.log("will be random mood");
        }
    }
    // function to get quote
    function getQuote() {
        // parse user selection to searchable quote tags
        switch (finalMood) {
            case "Happy":
                quoteKey = "happiness";
                break;
            case "Sad":
                quoteKey = "sad";
                break;
            case "Calm":
                quoteKey = "peace";
                break;
            case "Hyper":
                quoteKey = "imagination";
                break;
            case "Tired":
                quoteKey = "simplicity";
                break;
            case "Energetic":
                quoteKey = "funny";
        }

        // quote AJAX call
        $.ajax({
            type: "GET",
            url:
                "https://favqs.com/api/quotes/?filter=" +
                quoteKey +
                "&type=tag",
            headers: {
                Authorization: 'Token token="c7feecf386bc6d6ca78ebf0002238dc8"'
            }
        }).then(function(response) {
            // pick a random quote from the returned results
            var randomQuote =
                response.quotes[
                    Math.floor(Math.random() * response.quotes.length)
                ];
            // push the random quote onto the DOM
            var qBody = $("<p>");
            qBody.addClass("title").text(randomQuote.body);
            $(".card-content").append(qBody);

            var qAuthor = $("<p>");
            qAuthor.addClass("subtitle").text(randomQuote.author);
            $(".card-content").append(qAuthor);
        });
    }
});
