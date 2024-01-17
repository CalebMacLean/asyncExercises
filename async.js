// Async Exercises
// Part One: Number Facts
// API URL: http://numbersapi.com/

// global number api vars
const numURL = "http://numbersapi.com/";
const favNum = 2;

// Prompt One: Get a Single Number from the API
async function getANum() {
    try{
        // response var awaits response from dynamic endpoint
        const res = await axios.get(`${numURL}${favNum}/?json`);
        const text = res.data.text;
        $("#fav-num-container").text(text);
    }
    catch(err){
        console.log(err);
    }
};
// call getANum
getANum();

// Prompt Two: Get a Batch of Numbers Put them on the Page
async function getBatchNum(min, max){
    try{
        // response var awaits response from dynamic endpoit
        const res = await axios.get(`${numURL}${min}..${max}/?json`);
        const factArr = Object.values(res.data);

        // create and append an li w/ each fact in the factArr
        for(let fact of factArr) {
            const factLi = $("<li></li>").text(fact);
            $("#batch-fact-container").append(factLi);
        };
    }
    catch(err){
        console.log(err);
    }
};
// call getBatchNum()
getBatchNum(5, 10);

// Prompt Three: Get 4 facts w/ singular parallel requests
async function getParallelNum(num) {
    try{
        // create request variables
        const req1 = axios.get(`${numURL}${num}/?json`);
        const req2 = axios.get(`${numURL}${num}/?json`);
        const req3 = axios.get(`${numURL}${num}/?json`);
        const req4 = axios.get(`${numURL}${num}/?json`);
        // request array
        const reqArr = [req1, req2, req3, req4];
        // make parallel request using Promise.all store in var
        const promArr = await Promise.all(reqArr);

        // for each prom in promArr create li and push to page
        promArr.forEach(p => {
            const fact = p.data.text;
            const factLi = $("<li></li>").text(fact);
            $("#singular-fact-container").append(factLi);
        });
    }
    catch(err) {
        console.log(err);
    }
};
// call getParallelNum
getParallelNum(favNum);

// #######################################################
// Part Two: Deck of Cards
// API URL: https://deckofcardsapi.com/

const deckURL = "https://deckofcardsapi.com/api/"

// Prompt One: Make req to API for a single card from a newly created deck and log its suit and val
async function drawACard() {
    try{
        const res = await axios.get(`${deckURL}deck/new/draw/`);
        const card = res.data.cards[0];

        return `Value: ${card.value}; Suit: ${card.suit}`
    }
    catch(err) {
        console.log(err);
    }
}
// call drawACard
const promptOne = drawACard();

// Prompt Two: Draw a card from a newly created deck then draw another from the same deck
async function drawTwoCards() {
    try{
        const result = [];
        const res = await axios.get(`${deckURL}deck/new/draw`);
        const deckId = res.data["deck_id"];
        const card1 = res.data.cards[0];
        result.push(card1);

        const res2 = await axios.get(`${deckURL}deck/${deckId}/draw`);
        const card2 = res2.data.cards[0];
        result.push(card2);
        return result;
    }
    catch(err) {
        console.log(err);
    }
}
// call drawTwoCards
const promptTwo = drawTwoCards();

// Prompt Three: Create a Whole A** Site
// section 2 jQuery vars
const $two = $("#two");
const $cardBtn = $("#card-btn");
const $cardContainer = $("#cards-container");
// global var for section 2
let currDeck = undefined;

// site set-up
$("document").ready(() => {
    $cardBtn.hide();
});

// section 2 is clicked event
$two.click(createNewDeck);

// section 2 click handler function
async function createNewDeck() {
    // check to see if a deck exist based on currDeck var
    if (!currDeck) {
        try {
            // clear cards container
            $cardContainer.empty();
            // get deck and first card with new deck draw endpoint
            const res = await axios.get(`${deckURL}deck/new/draw/`);
            const deckId = res.data["deck_id"];
            currDeck = deckId;

            // get first card and its img
            const card = res.data.cards[0];
            const imgURL = card.image;

            // create image w/ image url, push to page
            const cardImg = $("<img>").attr("src", imgURL);
            cardImg.attr("alt", `Card: ${card.value} of ${card.suit}`);
            cardImg.addClass("card");
            $cardContainer.append(cardImg);

            // show card button
            $cardBtn.show();
        }
        catch(err) {
            console.log(err);
        };
    } else {
        console.log("A Deck is in Play");
    }
};

// $cardBtn click event
$cardBtn.click(getCard);

// $cardBtn click handler function
async function getCard() {
    try{
        // get a card from current deck w/ image url
        const res = await axios.get(`${deckURL}deck/${currDeck}/draw/`);
        const card = res.data.cards[0];
        const imgURL = card.image;

        // create img w/ imgURL
        const img = $("<img>").attr("src", imgURL);
        img.attr("alt", `Card: ${card.value} of ${card.suit}`);
        img.addClass("card");

        // vars for rotation and translation
        const dSignPotential = Math.random();
        const tSignPotential = Math.random();
        const degree = Math.floor((Math.random() * 30) + 1);
        const rem = (Math.random() * 2);
        let translation = undefined;
        let rotation = undefined;

        // condition to determine rotation sign
        if (dSignPotential < 0.5) {
            rotation = degree - (degree * 2);
        } else {
            rotation = degree;
        };
        // condition to determine translation sign
        if (tSignPotential < 0.5) {
            translation = rem - (rem * 2);
        } else {
            translation = rem;
        };

        // rotate and translate img
        img.css("transform", `rotate(${rotation}deg) translateX(${translation}rem) translateY(${translation}rem)`);
        // push img to doc
        $cardContainer.append(img);

        // Case: for last card drawn
        if (res.data.remaining === 0) {
            $cardBtn.hide();
            currDeck = undefined;
        };

    }
    catch(err) {
        console.log(err);
    }
}

// #############################################
// Further Study
// API URL: https://pokeapi.co/

const pokeURL = "https://pokeapi.co/api/v2/";

// Prompt One: Make a Single Request to get names and urls for every pokemon in the database
async function getAllPokemon() {
    try{
        const res = await axios.get(`${pokeURL}pokemon/?limit=100000&offset=0`);
        const pokemons = res.data.results;
        const result = [];

        for (let pokemon of pokemons) {
            result.push(pokemon);
        }

        return result;
    }
    catch(err) {
        console.log(err);
    }
}

// Prompt Two: Pick three pokemon at random, make request to their api endpoints and log their data
async function getThreePokemon() {
    try{
        // create array of all pokemon and an array of promises
        const pokemons = await getAllPokemon();
        const urlArr = [];

        // loop to repeat process till urlArr has three elements
        while (urlArr.length < 3) {
            // generate a random index for pokemons
            const randomIdx = Math.floor((Math.random() * pokemons.length) + 1);
            // grab a random pokemon from pokemons
            const pokemon = pokemons[randomIdx];
            // check to see if we have duplicate URL in urlArr
            const url = pokemon.url;
            if(!(url in urlArr)) {
                // push unique urls
                urlArr.push(url);
            } else {
                continue;
            }
        };

        // create array of promises using urls
        const promArr = [];
        for(let url of urlArr){
            promArr.push(axios.get(url));
        };

        // create array of resolved promises and push to result array than return
        const resArr = await Promise.all(promArr);
        const result = [];
        for(let res of resArr) {
            result.push(res.data);
        };
        return result;
    }
    catch(err) {
        console.log(err);
    }
}

// Prompt Three: Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s species URL (you should see a key of species in the data). Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English. If you find one, console.log the name of the pokemon along with the description you found.
const threePokemon = getThreePokemon();

async function getInfoOnPokemons(array) {
    // await passed array of promises, use elements to create new array full of pokemon names
    const arr = await array;
    const nameArr = [];
    // make array full of species urls
    const speciesArr = [];
    for(let pokemon of arr) {
        nameArr.push(pokemon.name);
        speciesArr.push(axios.get(pokemon.species.url));
    };

    // parallel request all species in speciesArr
    const resArr = await Promise.all(speciesArr);
    // make an array of all flavor text 
    const flavorArr = [];
    // loop throught resolved promises array
    for(let res of resArr){
        // first loop text var
        let text = undefined;
        // all flavor text entries arr
        const flavorTextArr = res.data["flavor_text_entries"];
        // second loop to check if entry is in english using flavor_text language attribute
        for(let textObj of flavorTextArr) {
            if (textObj.language.name === "en") {
                text = textObj["flavor_text"];
                break;
            } else {
                continue;
            };
        };
        // push first english flavor text found
        flavorArr.push(text);
    };

    // deconstruct nameArr and flavorArr
    let one, two, three;
    let oneTxt, twoTxt, threeTxt;
    [one, two, three] = nameArr;
    [oneTxt, twoTxt, threeTxt] = flavorArr;
    
    // add deconstructed vars to result obj
    const result = {
        p1 : {name: undefined, flavorText: undefined},
        p2 : {name: undefined, flavorText: undefined},
        p3 : {name: undefined, flavorText: undefined}
    };

    for(let i = 1; i < 4; i++) {
        const attr = result[`p${i}`];
        switch(i) {
            case 1:
                attr.name = one;
                attr.flavorText = oneTxt;
                break;
            case 2:
                attr.name = two;
                attr.flavorText = twoTxt;
                break;
            case 3:
                attr.name = three;
                attr.flavorText = threeTxt;
                break;
        }
    };
    
    return result;
}
console.log(getInfoOnPokemons(threePokemon));

