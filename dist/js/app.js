//global vars
var gameDeck = [];
var tempCounter = 0;
var playerDeck = [];
var computerDeck = [];
var playerCardSet = [];
var computerCardSet = [];

function buildDeck (){
    const suit = ["CLUBS","HEARTS","SPADES","DIMONDS"];
    let faceVal =[];
    (function () {
        for (let index = 2; index <= 10; index++) {
            faceVal.push(index);
        }
        faceVal.push("Jack");
        faceVal.push("Queen");
        faceVal.push("King");
        faceVal.push("Ace");
    })();
    (function (){
        let tempCardVal = 0;
        for (let indexSuit = 0; indexSuit < suit.length; indexSuit++) {
            tempCardVal = 0
            for (let indexVal = 0; indexVal < faceVal.length; indexVal++) {
                let tempColor = "";
                if ( suit[indexSuit] === "CLUBS" || suit[indexSuit] === "SPADES") {
                    tempColor = "black";
                }else {
                    tempColor = "red";
                }
                tempCardVal += 1;
                gameDeck.push([ suit[indexSuit] , faceVal[indexVal], tempColor, tempCardVal ]);   
            }
        }
    })();
    //console.table(gameDeck[13]);
    console.table(gameDeck);
}

function shuffle(array) {
    //Credit: https://github.com/Daplie/knuth-shuffle
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function buildPlayerDecks(){
    shuffle(gameDeck);
    //pop off gameDeck, push onto player, then repeat for computer
    do {
        playerDeck.push(gameDeck.pop());
        computerDeck.push(gameDeck.pop());
    } while (gameDeck.length>0);
    
    //console.log("Player Deck");
    //console.table(playerDeck);
    //console.log("computer Deck");
    //console.table(computerDeck);
}

function w3_open() {
    document.getElementById("sidebarMenu").style.display = "block";
}
function w3_close() {
    document.getElementById("sidebarMenu").style.display = "none";
}

function buildCard(card){
    let cardNumTemp = card[1];
    let cardSuitTemp = card[0];
    let cardColorTemp = card[2];
    
    
    //
    if (cardSuitTemp === "CLUBS"){
        cardSuitTemp = "&clubs;"
        cardColor = "black"
    }
    else if (cardSuitTemp === "HEARTS"){
        cardSuitTemp = "&hearts;"
        cardColor = "red"
    }else if (cardSuitTemp === "SPADES"){
        cardSuitTemp = "&spades;"
        cardColor = "black"
    }else if (cardSuitTemp === "DIMONDS"){
        cardSuitTemp = "&diams;"
        cardColor = "red"
    }
    //not ideal
    let cardImage = cardSuitTemp +" x " + cardNumTemp; //needs code to dynamically generate this better
    //
    if (cardNumTemp === "Jack"){
        cardImage = "Jack";
        cardNumTemp = "J";
    }
    else if (cardNumTemp === "Queen"){
        cardImage = "Queen";
        cardNumTemp = "Q";
    }
    else if (cardNumTemp === "King"){
        cardImage = "King";
        cardNumTemp = "K";
    }
    else if (cardNumTemp === "Ace"){
        cardImage = "Ace";
        cardNumTemp = "A";
    }
    
    return `
            
                <div class="w3-cell-row"><div class="w3-cell w3-large w3-display-topleft w3-opacity w3-padding"><b class="w3-text-${cardColorTemp}">${cardNumTemp}<br/>${cardSuitTemp}</b></div></div>
                <div class="w3-cell-row"><div class="w3-cell w3-xxlarge w3-display-middle w3-opacity w3-padding"><b class="w3-text-${cardColorTemp}">${cardImage}</b></div></div>
                <div class="w3-cell-row"><div class="w3-cell w3-large w3-display-bottomright w3-opacity w3-padding" style="transform: rotate(180deg)"><b class="w3-text-${cardColorTemp}">${cardNumTemp}<br/>${cardSuitTemp}</b></div></div>
            
        `;
}
function updateScore(){
    //find/define HTML elements, replace with deck lengths, do something if a score is zero
    $('#computerScore').replaceWith(`<b class="w3-opacity" id="computerScore">Computer Score ${computerDeck.length}</b>`);
    $('#playerScore').replaceWith(`<b class="w3-opacity" id="playerScore">Player Score ${playerDeck.length}</b>`);
    //if less than zero disable DRAW button
    if(computerDeck.length <=0){
        alert("Game Over, you win");
        $('#drawBtn').prop("disabled",true);
        $('#btnStart').removeClass("w3-disabled");
    }else if (playerDeck.length <= 0) {
        alert("Game Over, you lost.");
        $('#drawBtn').prop("disabled",true);
        $('#btnStart').removeClass("w3-disabled");
    }

}

function updateAlert(message){
    $('#statusAlert').replaceWith(`<b class="w3-cell w3-animate-opacity" id="statusAlert">${message}</b>`);
}

function draw(){
    //pop off playerDeck, store in variable/array, build player card, repeat for computer player
    computerCardSet = computerDeck.pop()
    let computerCard = $('#computerCard');
    computerCard.replaceWith(
        `
        <div class="w3-cell w3-border w3-white w3-round-large w3-display-container w3-card-4 w3-animate-zoom" style="width:200px;height:300px;" id="computerCard">
            ${buildCard(computerCardSet)}
        </div>
        `
    );
    playerCardSet = playerDeck.pop()
    let playerCard = $('#playerCard');
    playerCard.replaceWith(
        `
        <div class="w3-cell w3-border w3-white w3-round-large w3-display-container w3-card-4 w3-animate-zoom" style="width:200px;height:300px;" id="playerCard">
            ${buildCard(playerCardSet)}
        </div>
        `
    );
    //score
    if(computerCardSet[3]>playerCardSet[3]){
        //console.log("computer wins round");
        computerDeck.unshift(computerCardSet,playerCardSet);
        updateAlert("Computer WINS");
    }else if (computerCardSet[3]<playerCardSet[3]) {
        //console.log("player wins round");
        playerDeck.unshift(computerCardSet,playerCardSet);
        updateAlert("Player WINS");
    }else {
        //tie: for now just return to sets
        //console.log("tie");
        computerDeck.unshift(computerCardSet);
        playerDeck.unshift(playerCardSet);
        updateAlert("Tie");
    }
    playerCardSet = [];
    computerCardSet = [];
    //console.log("ComputerDeck " + computerDeck.length +" | PlayerDeck " + playerDeck.length);
    updateScore();
}

function buildPlayArea(){
    
    $('#gameDiv').replaceWith(
        `
        <div class="w3-container" id="gameDiv">
            <div class="w3-green" id="gameMat">
                <div id="playerAI">
                <div class="w3-cell-row">
                    <div class="w3-cell w3-white w3-hide-small" style="width: 20%;"><!--Collapsible border--></div>
                    <div class="w3-cell w3-green">
                    <div class="w3-cell-row w3-large w3-pale-blue w3-center"><b class="w3-cell" id="statusAlert">Click DRAW to start</b></div>
                    <div class="w3-cell-row">
                        <!--AI Score-->
                        <div class="w3-cell w3-amber w3-center w3-border w3-large"><b class="w3-opacity" id="computerScore">Computer Score 26</b></div>
                    </div>
                    <div class="w3-cell-row">
                        <div class="w3-cell w3-green">
                        <div class="w3-cell-row w3-padding">
                            <!--AI Player card-->
                            <div class="w3-cell w3-border w3-blue w3-round-large w3-display-container w3-card-4 w3-animate-zoom" style="width:200px;height:300px;"id="computerCard">
                                <div class="w3-cell-row"><div class="w3-cell w3-xxlarge w3-display-middle w3-opacity w3-padding"><b class="w3-text-white">&#9818;</b></div></div>
                            </div>
                        </div>
                        <div class="w3-cell-row w3-center w3-padding">
                            <!--Draw button-->
                            <button class="w3-button w3-khaki" onClick="draw()" id="drawBtn"><b class="w3-opacity">DRAW</b></button>
                        </div>
                        <div class="w3-cell-row w3-padding">
                            <!--Player card-->
                            <div class="w3-cell w3-border w3-blue w3-round-large w3-display-container w3-card-4 w3-animate-zoom" style="width:200px;height:300px;" id="playerCard">
                                <div class="w3-cell-row"><div class="w3-cell w3-xxlarge w3-display-middle w3-opacity w3-padding"><b class="w3-text-white">&#9818;</b></div></div>
                            </div>
                        </div>
                        </div>
                        <div class="w3-cell w3-red">
                        <!--Battle panel-->
                        </div>
                    </div>
                    <div class="w3-cell-row">
                        <div class="w3-cell w3-amber w3-center w3-border w3-large"><b class="w3-opacity" id="playerScore">Player Score 26</b></Score></div>
                    </div>
                    </div>
                    <div class="w3-cell w3-white w3-hide-small" style="width: 20%;"><!--Collapsible border--></div>
                </div>
                </div>
            </div>
        </div>
        `
        );
}

$('.btnStart').click(function (){
    $('.btnStart').addClass('w3-disabled');
    w3_close();
    buildDeck();
    buildPlayerDecks();
    buildPlayArea();
    
});

