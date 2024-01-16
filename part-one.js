// Promises Exercises
// Part One: Number Facts
// API URL: http://numbersapi.com/

const numURL = "http://numbersapi.com/";
const favNum = 2;

// Prompt One: Get a Single Number
const favNumRequest = $.getJSON(`${numURL}${favNum}/?json`)
    .then(data => {
        // Using then/catch to grab the actual data and not the promise.
        $("#fav-num-container").text(data.text);
    })
    .catch(err => {
        // Handle errors by logging them to console.
        console.log(err);
    });


// Prompt Two: Get a Batch of Numbers Put Them on the Page
const batchNumRequest = $.getJSON(`${numURL}${favNum}..10/?json`)
    .then(data => {
        // Use JQuery to accesss the container we will append elements to.
        const $wrapper = $("#batch-fact-container");
        const factArr = Object.values(data);

        // Create and Append an li with each fact in the batch that has been converted into an array.
        for (let fact of factArr) {
            const factLi = $("<li></li>").text(fact)
            $wrapper.append(factLi);
        };
    })
    .catch(err => {
        // Handle errors by logging them to console.
        console.log(err);
    });

// Prompt Three: Get 4 facts with singular request and put them on the page
const fourPromises = [];

// Populate fourPromises with get requests
for ( let i = 0; i < 4; i++) {
    fourPromises.push(
        $.getJSON(`${numURL}${favNum}/?json`)
    );
};

// Use Promise.all() to get promises and push their facts to the page 
Promise.all(fourPromises)
    .then(promArr => {
        const $wrapper = $("#singular-fact-container");
        // Promise.all() returns an array so we will use forEach method to create Lis and push them to page.
        promArr.forEach(p => {
            const fact = p.text;
            const factLi = $("<li></li>").text(fact);
            $wrapper.append(factLi);
        });
    })
    .catch(err => {
        console.log(err);
    });

    // #############################################################################################
// Part Two: Deck of Cards
// API URL: https://deckofcardsapi.com/

const deckURL = "https://deckofcardsapi.com/api/"

// Prompt One: Make request to API for a single card from a newly created deck and log its suit and value
const drawACardRequest = $.getJSON(`${deckURL}deck/new/draw/?count=1`)
    .then(resp => {
        const card = resp.cards[0];
        console.log(`Value = ${card.value}`);
        console.log(`Suit = ${card.suit}`);
    })
    .catch(err => console.log(err));


// Prompt Two: Draw a card from a newly created deck than draw another from that deck
const drawnCards = [];

const drawTwoCardRequest = $.getJSON(`${deckURL}deck/new/draw/?count=1`)
    .then(resp => {
        // Store the card obj in card arr
        drawnCards.push(resp.cards[0]);
        // Access deckId and return new request using id for the next then
        const deckId = resp["deck_id"];
        return $.getJSON(`${deckURL}deck/${deckId}/draw/?count=1`);
    })
    .then(p => {
        // Store the card obj in card arr
        drawnCards.push(p.cards[0]);
        console.log(drawnCards);
    })
    .catch(err => console.log(err));

// Prompt Three: Create a Whole A** Site
// Section 2 JQuery Vars
const $two = $("#two");
const $cardBtn = $("#card-btn");
const $cardContainer = $("#cards-container");
// Global Variables
let currDeck = undefined;

// Site Set-Up
$("document").ready(() => {
    // Hide the Gimme Card Button
    $cardBtn.hide();
});

// Section 2 is Clicked Event
$two.click(createNewDeck);

// Section 2 Click Handler Funciton
function createNewDeck() {
    // Check to see if a deck exist by checking currDeck
    if (!currDeck) {
        // Make a request to create a new deck and draw the first card.
        $.getJSON(`${deckURL}deck/new/draw/?count=1`)
            .done(resp => {
                // clear card container of elements for new draw area
                $cardContainer.empty()

                // update currDeck with new deck id
                const deckId = resp["deck_id"];
                currDeck = deckId;

                // get card
                const card = resp.cards[0];
                const imgURL = card.image;

                // create image with image url
                const cardElement = $(`<img>`).attr("src", imgURL);
                cardElement.attr("alt", `Card: ${card.value} of ${card.suit}`);
                cardElement.addClass("card");

                // append image to cards container
                $cardContainer.append(cardElement);

                // show card btn
                $cardBtn.show();
            })
            .catch(err => console.log(err));
    } else {
        console.log("A Deck is in play.");
    }
};

// $cardBtn Click Event
$cardBtn.click(getCard);

// $cardBtn Click Handler Function
function getCard() {
    $.getJSON(`${deckURL}deck/${currDeck}/draw/?count=1`)
        .then(resp => {
            // get card
            const card = resp.cards[0];
            const imgURL = card.image;

            // create image with image url
            const cardElement = $(`<img>`).attr("src", imgURL);
            cardElement.attr("alt", `Card: ${card.value} of ${card.suit}`);
            cardElement.addClass("card");

            // vars for rotation
            const signPotential = Math.random();
            const degree = Math.floor(Math.random() * 30);
            const translation = Math.random() * 2;
            let rotation = undefined;

            // condition to determine rotation
            if (signPotential < 0.5) {
                rotation = degree - (2 * degree);
            } else {
                rotation = degree;
            }

            // rotate and translate element
            cardElement.css("transform", `rotate(${rotation}deg) translateX(${translation}rem) translateY(${translation}rem)`);
            // append image to cards container
            $cardContainer.append(cardElement);
            
            // Case: for last card drawn
            if (resp.remaining === 0) {
                $cardBtn.hide();
                currDeck = undefined;
            }
        })
        .catch(err => console.log(err));
}

// #####################################################################################################
// Further Study
// API URL: https://pokeapi.co/

const pokeURL = "https://pokeapi.co/api/v2/";

// Prompt One: Make a Single Request to get names and urls for every pokemon in the database
// create array to store pokemon names and urls
const pokeArr = [];

$.getJSON(`${pokeURL}pokemon/?limit=100000&offset=0`)
    .then(resp => {
        // Var with response's pokemon array
        const pokemons = resp.results;
        // loop through array and push them to global pokeArr
        for (let pokemon of pokemons) {
            pokeArr.push(pokemon);
        };
    })
    .catch(err => console.log(err));

// Prompt Two: Pick three pokemon at random, make request to their api endpoints and log their data
// function to pick a random index for pokeArr and then make a url for them

$.getJSON(`${pokeURL}pokemon/?limit=100000&offset=0`)
    .then(resp => {
        // Var with response's pokemon array
        const pokemons = resp.results;
        // array that will store constructed urls
        const promiseArr = [];

        // loop to repeat this process till we have three results
        while (promiseArr.length < 3) {
            // Need to grab random 
            const randomIdx = Math.floor(Math.random() * pokemons.length) + 1;
            // get random pokemon
            const pokemon = pokemons[randomIdx];
            // check to see if we have the url in the promise arr to prevent duplication
            const url = pokemon.url;
            if(!(url in promiseArr)) {
                // store unique promise in the promise array
                promiseArr.push($.getJSON(url));
            } else {
                continue;
            }
        };

        // return all the promises using Promise.all
        return Promise.all(promiseArr);
    })
    .then(pArr => {
        for (let pokemon of pArr) {
            console.log(pokemon);
        }
    })
    .catch(err => console.log(err));

