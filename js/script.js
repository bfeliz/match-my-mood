$(document).ready(function() {
    //--------------------------------------------------------------------------
    // GLOBAL FUNCTIONS AND MOOD SELECTIONS
    //---------------------------------------------------------------------------

    var finalMood = "";
    var moodArray = ["Happy", "Sad", "Calm", "Hyper", "Tired", "Energetic"];
    // remove the modal on click of launch button
    $(".launch-btn").on("click", function(event) {
        event.preventDefault();
        $(".modal").removeClass("is-active");
        $(".card").removeClass("is-hidden");
        appendTime();
        getMood();
        setColor();
        getQuote();
        getPhotos();
        loadPlaylist();
        getArticle();
    });

    // get the mood from user input
    function getMood() {
        var selectedMood = $(".select option:selected")
            .text()
            .trim();

        if ($("input[name=question]:checked", ".control").val() === "no") {
            if (selectedMood !== "I don't know, pick for me!") {
                switch (selectedMood) {
                    case "Happy":
                        finalMood = "Sad";
                        break;
                    case "Sad":
                        finalMood = "Happy";
                        break;
                    case "Calm":
                        finalMood = "Hyper";
                        break;
                    case "Hyper":
                        finalMood = "Calm";
                        break;
                    case "Tired":
                        finalMood = "Energetic";
                        break;
                    case "Energetic":
                        finalMood = "Tired";
                        break;
                }
            } else {
                finalMood =
                    moodArray[Math.floor(Math.random() * moodArray.length)];
            }
        } else {
            if (selectedMood !== "I don't know, pick for me!") {
                finalMood = selectedMood;
            } else {
                finalMood =
                    moodArray[Math.floor(Math.random() * moodArray.length)];
            }
        }
    }

    // set color as relates to mood selection
    function setColor() {
        switch (finalMood) {
            case "Happy":
                $("html")
                    .removeClass()
                    .addClass("bg-ha");
                $(".card")
                    .removeClass()
                    .addClass("card-ha");
                break;
            case "Sad":
                $("html")
                    .removeClass()
                    .addClass("bg-sa");
                $(".card")
                    .removeClass()
                    .addClass("card-sa");
                break;
            case "Calm":
                $("html")
                    .removeClass()
                    .addClass("bg-ca");
                $(".card")
                    .removeClass()
                    .addClass("card-ca");
                break;
            case "Hyper":
                $("html")
                    .removeClass()
                    .addClass("bg-hy");
                $(".card")
                    .removeClass()
                    .addClass("card-hy");
                break;
            case "Tired":
                $("html")
                    .removeClass()
                    .addClass("bg-ti");
                $(".card")
                    .removeClass()
                    .addClass("card-ti");
                break;
            case "Energetic":
                $("html")
                    .removeClass()
                    .addClass("bg-en");
                $(".card")
                    .removeClass()
                    .addClass("card-en");
        }
    }

    //--------------------------------------------------------------------------
    // WEATHER AND TIME FUNCTIONS
    //---------------------------------------------------------------------------
    var currDate = "";
    var currTime = "";

    // Capture selector for HTML area to hold current weather data
    var $displayWeather = $("#display-weather");

    // This is my (JimG) weather API key.
    var weatherAPIKey = "7514abfe02ab6db7877685958ec119d7";

    //---------------------------------------------------------------------------
    // get geolocation (latitude & longitude) from local storage if it exists,
    // otherwise get geographic location using navigator function.
    //---------------------------------------------------------------------------

    var data = localStorage.getItem("MyGeoLocation");

    if (!data) {
        // create empty array to hold geolocation
        var my_geolocation = [];
        // get current geolocation (latitude & longitude)
        navigator.geolocation.getCurrentPosition(success);
    } else {
        var my_geolocation = JSON.parse(data);
        var latitude = my_geolocation[0];
        var longitude = my_geolocation[1];
        getCurrentWeather(latitude, longitude);
    }

    //---------------------------------------------------------------------
    // functions to handle success or failure of getCurrentPosition method
    //---------------------------------------------------------------------

    function success(pos) {
        var latitude = pos.coords.latitude;
        var longitude = pos.coords.longitude;

        // save latitude and longitude in geolocation array
        my_geolocation.push(latitude);
        my_geolocation.push(longitude);

        // save geolocation array in local storage
        localStorage.setItem("MyGeoLocation", JSON.stringify(my_geolocation));

        // get current weather conditions at current geolocation
        getCurrentWeather(latitude, longitude);
    }

    //---------------------------------------------------------------------
    // function to get current weather for specific latitude & longitude
    //---------------------------------------------------------------------

    function getCurrentWeather(lat, lon) {
        // set up the AJAX query URL

        var queryURL =
            "https://api.openweathermap.org/data/2.5/weather?appid=" +
            weatherAPIKey +
            "&units=imperial&lat=" +
            lat +
            "&lon=" +
            lon;

        // AJAX call

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // get date and time
            var myDate = moment().format("dddd, MMMM Do");
            var myTime = moment().format("h:mm a");
            currDate = $("<h1>").text(myDate);
            currTime = $("<h1>").text(myTime);

            // get weather icon
            var wClass = "";
            var cloudy = ["802", "803", "804"];
            var storm = [
                "200",
                "201",
                "202",
                "210",
                "211",
                "212",
                "221",
                "230",
                "231",
                "232"
            ];
            var drizzle = [
                "300",
                "301",
                "302",
                "310",
                "311",
                "312",
                "313",
                "314",
                "321"
            ];
            var rain = [
                "500",
                "501",
                "502",
                "503",
                "504",
                "511",
                "520",
                "521",
                "522",
                "531"
            ];
            var snow = [
                "600",
                "601",
                "602",
                "611",
                "612",
                "613",
                "615",
                "616",
                "620",
                "621",
                "622"
            ];
            var atmosphere = ["701", "711", "721", "731", "741", "751", "761"];

            if (response.weather[0].id === 801) {
                wClass = "wi wi-day-cloudy";
            } else if (response.weather[0].id === 800) {
                wClass = "wi wi-day-sunny";
            } else if (jQuery.inArray("response.weather[0].id", cloudy)) {
                wClass = "wi wi-cloudy";
            } else if (jQuery.inArray("response.weather[0].id", storm)) {
                wClass = "wi wi-owm-230";
            } else if (jQuery.inArray("response.weather[0].id", drizzle)) {
                wClass = "wi wi-owm-301";
            } else if (jQuery.inArray("response.weather[0].id", rain)) {
                wClass = "wi wi-owm-302";
            } else if (jQuery.inArray("response.weather[0].id", snow)) {
                wClass = "wi wi-owm-600";
            } else if (jQuery.inArray("response.weather[0].id", atmosphere)) {
                wClass = "wi wi-owm-731";
            }

            // append weather icon to date
            var weatherIcon = $("<i>");
            weatherIcon.addClass(wClass);
            currDate.append(weatherIcon);
        });
    }

    // append time to DOM
    function appendTime() {
        $displayWeather.append(currDate);
        $displayWeather.append(currTime);
    }

    //--------------------------------------------------------------------------
    // QUOTE FUNCTIONS
    //---------------------------------------------------------------------------

    // quote section variables
    var quoteKey = "";

    // function to get quote
    function getQuote() {
        // parse user selection to searchable quote tags
        switch (finalMood) {
            case "Happy":
                quoteKey = "happiness";
                break;
            case "Sad":
                quoteKey = "alone";
                break;
            case "Calm":
                quoteKey = "nature";
                break;
            case "Hyper":
                quoteKey = "best";
                break;
            case "Tired":
                quoteKey = "good";
                break;
            case "Energetic":
                quoteKey = "life";
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
            var quotes = response.quotes.filter(
                quote => quote.body.length < 150
            );
            var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            // push the random quote onto the DOM
            var qBody = $("<p>");
            qBody.addClass("title").text(randomQuote.body);
            $(".quote-content").append(qBody);

            var qAuthor = $("<p>");
            qAuthor.addClass("subtitle").text(randomQuote.author);
            $(".quote-content").append(qAuthor);
        });
    }

    //--------------------------------------------------------------------------
    // PHOTO FUNCTIONS
    //---------------------------------------------------------------------------

    function getPhotos() {
        // Capture selector for HTML area to hold photos
        var $displayPhoto = $("#display-photo");
        //var $displayPhoto = $(".photo-content");


        var photoType = "";
        var photosPerPage = 80;
        var timerTime = 10000;     // 10 second delay between photos
        var nextPageOfPhotos = "";

        var currentPhoto = -1;
        var photoInfo = []; // clear out photo info array

        // API key for Pexels:
        // 563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484

        var photoTypesHappy = ["flowers", "smile", "flower", "fun", "sky"];
        var photoTypesSad   = ["sad", "rain", "clouds", "sea", "desert"];
        var photoTypesCalm  = ["landscape", "universe", "sunset", "nature", "mountains"];
        var photoTypesHyper = ["fire", "gym", "party", "kids"];
        var photoTypesTired = ["night", "forest", "light", "tree"];
        var photoTypesEnergetic = ["adventure", "sport", "success", "newyork"];
        //   beach, trees, earth, 

        // set photo search parameter based on mood.

        switch (finalMood) {
            case "Happy":
                //photoType = "flowers";
                var idx = (Math.floor(Math.random() * photoTypesHappy.length));
                photoType = photoTypesHappy[idx];
                break;
            case "Sad":
                //photoType = "sad";
                var idx = (Math.floor(Math.random() * photoTypesSad.length));
                photoType = photoTypesSad[idx];
                break;
            case "Calm":
                //photoType = "landscape";
                var idx = (Math.floor(Math.random() * photoTypesCalm.length));
                photoType = photoTypesCalm[idx];
                break;
            case "Hyper":
                //photoType = "fire";
                var idx = (Math.floor(Math.random() * photoTypesHyper.length));
                photoType = photoTypesHyper[idx];
                break;
            case "Tired":
                //photoType = "sunset";
                var idx = (Math.floor(Math.random() * photoTypesTired.length));
                photoType = photoTypesTired[idx];
                break;
            case "Energetic":
                //photoType = "beach";
                var idx = (Math.floor(Math.random() * photoTypesEnergetic.length));
                photoType = photoTypesEnergetic[idx];
        }

        console.log("Photo type:", photoType);

         // Some of the choices are:
        //  sunset, sky, mountains, sea, sad, night, light, desert, universe,
        //  forest, fire, beach, tree, trees, rain, earth, flowers, flower, clouds, smile

        /*  -----------------------------------------------------------------------------------------------------------
            Whenever you are doing an API request make sure to show a prominent link to Pexels.
            You can use a text link (e.g. "Photos provided by Pexels") or a link with our logo (Download our logo in white or black).
            Always credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels).
            Do not copy core functionality of Pexels.
            Do not abuse the API. The API is rate-limited to 200 requests per hour and 20,000 requests per month. (For higher limits contact us).
        -------------------------------------------------------------------------------------------------------------*/

        getNextPageOfPhotos();

        function getNextPageOfPhotos() {
            currentPhoto = -1;
            photoInfo = []; // clear out photo info array

            // set up the AJAX query URL
            if (nextPageOfPhotos === "") {
                var queryURL =
                    "https://api.pexels.com/v1/search?query=" +
                    photoType +
                    "&per_page=" +
                    photosPerPage +
                    "&page=1";
            } else {
                var queryURL = nextPageOfPhotos;
            }

            console.log("photo URL:", queryURL);

            // AJAX call

            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    Authorization:
                        "563492ad6f91700001000001bbb93d6089ee4731b7a0c2fa559ab484"
                }
            }).then(function(response) {
                console.log(response);

                nextPageOfPhotos = response.next_page;
                console.log("Resp photos len: ", response.photos.length);
                console.log("Next page: ", response.next_page);

                for (let i = 0; i < response.photos.length; i++) {
                    //console.log(response.photos[i].id,
                    //    response.photos[i].photographer);
                    if (response.photos[i].width > response.photos[i].height) {
                        // create new Photo object to hold photo data and save new Photo
                        // in array of photo information
                        var newPhoto = new Photo(
                            response.photos[i].photographer,
                            response.photos[i].id,
                            response.photos[i].width,
                            response.photos[i].height,
                            //response.photos[i].src.medium
                            response.photos[i].src.landscape
                        );
                        photoInfo.push(newPhoto);
                    }
                }
                console.log("photo array length: ", photoInfo.length);
                displayNextPhoto();

                // start the countdown timer
                setTimer();
            });
        }

        //-----------------------------------------------------------
        // display next photo from array "photoInfo"
        // "https://images.pexels.com/lib/api/pexels-white.png"
        //-----------------------------------------------------------
        function displayNextPhoto() {
            //debugger;
            currentPhoto++;
            //console.log(currentPhoto);
            //if (currentPhoto < 5) {
            if (currentPhoto < photoInfo.length) {
                var foto = photoInfo[currentPhoto];
                console.log(foto.photoId, "width: ", foto.photoWidth, "height: ", foto.photoHeight);
                // clear out the area holding the current photo so the next one will replace it
                $displayPhoto.empty();
                var photoSpot = $("<img>").attr("src", foto.photo);
                $displayPhoto.append(photoSpot);
                debugger;
                // setup photo credit 
                var aURL = $("<a>");
                aURL.addClass("subtitle")
                     .attr("href", "https://www.pexels.com/")
                     .text(foto.fotographer);
                 $displayPhoto.append(aURL);
                // fade-in in 1.5 seconds
                $displayPhoto.fadeIn(1500);
                // set timer to start fade-out in 8 seconds
                var fade = setTimeout(fadePhoto, 8000);
            } else {
                clearTimeout(fade);
                clearInterval(timerInterval);
                if (typeof nextPageOfPhotos !== "undefined") {
                    getNextPageOfPhotos();
                }
            }
        }
 
        function fadePhoto() {
            console.log("fadePhoto");
            $displayPhoto.fadeOut(1500);
        }

        //-----------------------------------------------------------
        // function to set countdown timer
        //-----------------------------------------------------------
        function setTimer() {
            timerInterval = setInterval(displayNextPhoto, timerTime);
        }

        //-----------------------------------------------------------
        // Constructor function for Photo objects
        //-----------------------------------------------------------
        function Photo(fotographer, picId, picWidth, picHeight, picture) {
            this.photographer = fotographer;
            this.photoId = picId;
            this.photoWidth = picWidth;
            this.photoHeight = picHeight;
            this.photo = picture;
        }
    }

    //--------------------------------------------------------------------------
    // SONG FUNCTIONS
    //---------------------------------------------------------------------------

    var playlists = {
        energetic: "pp.243995364",
        tired: "pp.201748658",
        happy: "pp.181321249",
        calm: "pp.191473986",
        hyper: "pp.283875163",
        sad: "pp.162612012"
    };

    function loadPlaylist() {
        var moodLowercase = finalMood.toLocaleLowerCase();
        let finalPlaylist = playlists[moodLowercase];
        singlePlaylist(finalPlaylist);
    }

    function singlePlaylist(moodLowercase) {
        var queryURL = `https://api.napster.com/v2.2/playlists/${moodLowercase}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`;

        $.ajax({
            url: queryURL,

            method: "GET"
        }).then(function(response) {
            player.tracks = response.tracks;
            console.log(response.tracks);
            player.init();
            player.play();
        });
    }

    let player = {
        htmlPlayer: null,
        tracks: [],
        currentIndex: Math.floor(Math.random() * 10),

        play() {
            let songTitle = this.tracks[this.currentIndex].name;
            let artist = this.tracks[this.currentIndex].artistName;

            var newSongTitle = "";

            if (songTitle.length > 50) {
                newSongTitle = songTitle.substring(0, 50) + "...";
            } else {
                newSongTitle = songTitle;
            }

            let songHtml = `<p class="song-title">${"Song: " +
                newSongTitle}</p>`;
            songHtml += `<p class="artist-name">${"By: " + artist}</p>`;

            $(".content").html(songHtml);

            // htmlPlayer.load();
            this.htmlPlayer.play();
        },
        next() {
            this.htmlPlayer.pause();
            this.currentIndex++;
            if (typeof this.tracks[this.currentIndex] === "undefined") {
                this.currentIndex = 0;
            }
            document.getElementById("currentTrackSource").src = this.tracks[
                this.currentIndex
            ].previewURL;
            console.log(this.tracks[this.currentIndex].previewURL);
            this.htmlPlayer.load();
            this.play();
        },
        previous() {
            this.htmlPlayer.pause();
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.tracks.length - 1;
            }
            document.getElementById("currentTrackSource").src = this.tracks[
                this.currentIndex
            ].previewURL;
            this.htmlPlayer.load();
            this.play();
        },

        init() {
            $("#song-content").append('<audio id="player" controls></audio>');
            this.htmlPlayer = document.getElementById("player");
            $("#player").append(
                `<source id="currentTrackSource" src="${
                    this.tracks[this.currentIndex].previewURL
                }">`
            );
            $("#song-content").append('<div id="current-song"></div>');

            var previous = $("<a>");
            previous
                .addClass("previous-button")
                .attr("href", "#")
                .text("Previous")
                .css({ color: "white", "padding-right": "40px" });
            $("#song-content").append(previous);

            $(".previous-button").on("click", function(event) {
                event.preventDefault();
                player.previous();
            });

            var next = $("<a>");
            next.addClass("next-button")
                .attr("href", "#")
                .text("Next")
                .css("color", "white");
            $("#song-content").append(next);

            $(".next-button").on("click", function(event) {
                event.preventDefault();
                player.next();
            });
        }
    };

    //--------------------------------------------------------------------------
    // ARTICLE FUNCTIONS
    //---------------------------------------------------------------------------

    function getArticle() {
        var articleKey = "";

        switch (finalMood) {
            case "Happy":
                articleKey = "happiness";
                break;
            case "Sad":
                articleKey = "solitude";
                break;
            case "Calm":
                articleKey = "nature";
                break;
            case "Hyper":
                articleKey = "hyper";
                break;
            case "Tired":
                articleKey = "art";
                break;
            case "Energetic":
                articleKey = "energetic";
        }
        var articleQueryURL =
            "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=PV7q6CymGpwmm5FszG8i5ZWTzvmDvnxQ&q=" +
            articleKey;

        console.log(articleQueryURL),
            // article AJAX call
            $.ajax({
                type: "GET",
                url: articleQueryURL
            }).then(function(response) {
                console.log(response);
                var randomArticle =
                    response.response.docs[
                        Math.floor(
                            Math.random() * response.response.docs.length
                        )
                    ];
                console.log(randomArticle);
                // // push the random article onto the DOM
                var aHeadline = $("<p>");
                aHeadline.addClass("title").text(randomArticle.headline.main);
                $(".article-content").append(aHeadline);

                var newAbstract = "";

                if (randomArticle.abstract.length > 250) {
                    newAbstract =
                        randomArticle.abstract.substring(0, 250) + "...";
                } else {
                    newAbstract = randomArticle.abstract;
                }
                var aAbstract = $("<p>");
                aAbstract.addClass("subtitle").text(newAbstract);
                $(".article-content").append(aAbstract);

                var aURL = $("<a>");
                aURL.addClass("subtitle")
                    .attr("href", randomArticle.web_url)
                    .text("Read article here");
                $(".article-content").append(aURL);
            });
    }
});
