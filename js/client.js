
var sources = {
    bg: 'pixel_grid.jpg',
    cards: 'cards.png',
    hand1_btn: 'hand1_button.png',
    hand2_btn: 'hand2_button.png',
    vs: 'vs.png'
};

var pct1 = "";
var pct2 = "";




$(function () {
    loadImages(sources, initStage);
});



function writeMessage(messageLayer, message, x, y) {
    var context = messageLayer.getContext();
    messageLayer.clear();
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, x, y);
}

      function loadImages(sources, callback) {
        var assetDir = '';
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        for(var src in sources) {
          numImages++;
        }
        for(var src in sources) {
          images[src] = new Image();
          images[src].onload = function() {
            if(++loadedImages >= numImages) {
              callback(images);
            }
          };
          images[src].src = assetDir + sources[src];
        }
      }

      function initStage(images) {
      	var stage = new Kinetic.Stage({
      	  container: 'container',
      	  width: 700,
      	  height: 500
      	});
		var messageLayer = new Kinetic.Layer();

	  	var bgLayer = new Kinetic.Layer();
	  	bgLayer.add( new Kinetic.Image({
			image: images.bg,
			x: 0,
			y: 0
		}));
		stage.add(bgLayer);

		var buttonLayer = new Kinetic.Layer();
		var btnvs = new Kinetic.Image({
			x: 165,
			y: 50,
			image: images.vs

			});
		btnvs.on('click', function () {console.log("clicked btnvs");});
		buttonLayer.add(btnvs);
		var btnHand1 = new Kinetic.Image({
			x: 20,
			y: 130,
			image: images.hand1_btn,
			draggable: true
		});
		btnHand1.on('dragend', function () { console.log("button1 x=" + this.getX() + " y=" + this.getY());});
		btnHand1.on('mouseover', function () { writeMessage(messageLayer, pct1, 10,200); });
		btnHand1.on('mouseout', function () { writeMessage(messageLayer, "", 10,200); });

		buttonLayer.add(btnHand1);
		var btnHand2 = new Kinetic.Image({
			x: 255,
			y: 130,
			image: images.hand2_btn,
			draggable: true

		});
		btnHand2.on('dragend', function () { console.log("button2 x=" + this.getX() + " y=" + this.getY());});
		btnHand2.on('mouseover', function () { writeMessage(messageLayer, pct2, 250,200); });
		btnHand2.on('mouseout', function () { writeMessage(messageLayer, "", 250,200); });
		buttonLayer.add(btnHand2);

		stage.add(buttonLayer);
		stage.add(messageLayer);

      	var cardsLayer = new Kinetic.Layer();
	
		// do the cards
		var cards = [];
		var suits = ['S','H','D','C'];
		var ranks = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

		var cardvals = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
		var cardsuits = ['C','D','H','S'];
		var positions = {};

		for (var i=0; i<cardsuits.length; i++){
			for (var j=0; j<cardvals.length; j++){
				positions[cardvals[j] + cardsuits[i]] = {x: ( j*79), y:(i*123)};	
			}
		}

		// create the deck
		for (suit in suits) {
			for (rank in ranks){
				cards.push(ranks[rank] + suits[suit]);
			}
		}	
		// shuffle the cards
		fisherYates(cards);

		var hand1 = [];
		var hand2 = [];
		hand1.push(cards.shift());
		hand2.push(cards.shift());
		hand1.push(cards.shift());
		hand2.push(cards.shift());
		compare_hands(hand1, hand2);
		
	  	var cardcounter = 0;
		for (c in hand1)
		{
			//ctx.drawImage(img,positions[data.cards[c]].x,positions[data.cards[c]].y,79,123,card_counter * 79,0,79,123);

        	var card = new Kinetic.Image({
        	  x: cardcounter * 79,
        	  y: 0,
			  crop: {width: 79, height: 123, x: positions[hand1[c]].x, y: positions[hand1[c]].y},
			  width: 79,
			  height: 123,
        	  image: images.cards
        	});
        	cardsLayer.add(card);
			console.log(hand1[c] + ' x=' + positions[hand1[c]].x + ' y=' + positions[hand1[c]].y );
			cardcounter++;
		}
		cardcounter++;
		for (c in hand2)
		{
			//ctx.drawImage(img,positions[data.cards[c]].x,positions[data.cards[c]].y,79,123,card_counter * 79,0,79,123);

        	var card = new Kinetic.Image({
        	  x: cardcounter * 79,
        	  y: 0,
			  crop: {width: 79, height: 123, x: positions[hand2[c]].x, y: positions[hand2[c]].y},
			  width: 79,
			  height: 123,
        	  image: images.cards
        	});
        	cardsLayer.add(card);
			console.log(hand2[c] + ' x=' + positions[hand2[c]].x + ' y=' + positions[hand2[c]].y );
			cardcounter++;
		}

        // add the layer to the stage
        stage.add(cardsLayer);
	  }


function comb(s,n){
    var combos = Array();
    if (n ==1){
        for (i in s){ 
            combos.push([s[i]]);
        }
    } else {
        for (var i=0; i<= (s.length - n); i++) {
            var r_combos = comb(s.slice(i+1), n-1);
            for (var c in r_combos) {
                combos.push([ r_combos[c].concat([s[i]])]);
            }
        }
    }
    
    return combos;
}

function rank_cards(cards){
	// generate combinations from the 7 cards
	var highest_rank = 0;
	if (cards.length >= 5) {
		var card_combos = comb(cards, 5);
		for (var i in card_combos) {
				temp = card_combos[i].join(',');
				highest_rank = Math.max(highest_rank, evalHand2(temp).score);
    	}
	}
	return highest_rank;
}

function compare_hands(h1, h2)
{
		var h1_score = 0;
		var h2_score = 0;

		for (var runs=0; runs<1000; runs++)
		{
			var deck = [];
			var suits = ['S','H','D','C'];
			var ranks = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

			// create the deck without the players cards
			for (suit in suits) {
				for (rank in ranks){
					var tempcard = ranks[rank] + suits[suit];
					var foundcard = false;

					for (player_card in h1) {
						if (h1[player_card] == tempcard){
							foundcard = true;
						}
					}
					for (player_card in h2) {
						if (h2[player_card] == tempcard){
							foundcard = true;
						}
					}
					if (! foundcard){
						deck.push(ranks[rank] + suits[suit]);
					}
				}
			}	
			// shuffle the cards
			//deck.sort(function() {return 0.5 - Math.random()});
			fisherYates(deck);

			var board = [];
			board.push(deck.shift());
			board.push(deck.shift());
			board.push(deck.shift());
			board.push(deck.shift());
			board.push(deck.shift());
			h1_rank = rank_cards(h1.concat(board));
			h2_rank = rank_cards(h2.concat(board));
			//console.log ("hand1 " + h1.join(","));
			//console.log ("hand2 " + h2.join(","));
			//console.log ("board " + board.join(","));
			//console.log ("hand1 rank: " + h1_rank);
			//console.log ("hand2 rank: " + h2_rank);
			if (h1_rank > h2_rank){
				h1_score++;
			}
			if (h2_rank > h1_rank){
				h2_score++;
			}
			
		}
		console.log("h1_score: " + h1_score + " -> " + (h1_score * .10) + "%");
		console.log("h2_score: " + h2_score + " -> " + (h2_score * .1) + "%");
		pct1 = "" + (h1_score * .10) + "%";
		pct2 = "" + (h2_score * .10) + "%";

}

function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

var evalHand2 = function(input){
    if (!input) return;

    input = input.replace(/\s+/g, '').replace(/[Jj]/g, '11').replace(/[Qq]/g, '12').replace(/[Kk]/g, '13').replace(/[Aa]/g, '14').toUpperCase().split(',');

	var f = false; // flush
	var s = false; // straight
	var k4 = false;
	var k3 = false;
	var p2 = false;
	var p1 = false;
	var fh = false;

    var hand = {D: [], H: [], C: [], S:[]};
	var cards_of_suit = {D: 0, H: 0, C: 0, S: 0};
	var cards = []; // array of ranks i.e. ['3','4','6','K']
	var kickers = []; 
	var high_cards = []; 
	var score = 0;

    for (var i = 0, len = input.length; i < len; i++)
    {
		if (input[i]){
        	hand[input[i].slice(input[i].length - 1)][input[i].slice(0, input[i].length - 1)] = 1; 
			cards_of_suit[input[i].slice(input[i].length - 1)]++;
			cards.push(input[i].slice(0, input[i].length - 1));
		}
    }
	high_cards = cards.sort();

	// check for flush
	f = (cards_of_suit['D'] >= 5 || cards_of_suit['H'] >= 5 || cards_of_suit['S'] >= 5 || cards_of_suit['C'] >= 5);
	if (f){
		//console.log('pre flush check high cards:' + high_cards.join(','));
		// highest card should be first
		high_cards = [];
		cards = cards.sort(function(a,b){return b-a});
		for (c in cards){
			high_cards.push( cards[c]);
		}
		//console.log('post flush check high cards:' + high_cards.join(','));
	}
	//console.log('pre straight check high cards:' + high_cards.join(','));

	// check for straight
	cards = cards.sort(function(a,b){return a-b});
	//console.log('post straight pre sort check high cards:' + high_cards.join(','));
	for(var i=2; i<11; i++){
		 if(cards.join(',') ==  [i,i+1,i+2,i+3,i+4].join(',') )
		 {
		 	s = true;
			high_cards = [i+4];
		}
	}

	// straight special case
	if (cards.join(',') == [2,3,4,5,14].join(',')){
		s = true;
		high_cards = ['5'];
	}

	//console.log('post straight check high cards:' + high_cards.join(','));
	// check for four of a kind
	for (var i=2; i<15; i++){
		if (cards.slice(0,-1).join(',') == [i,i,i,i].join(','))
		{
			k4 = true;
			score = 7;
			high_cards = [i];
			kickers = cards.slice(-1);
		}
		if (cards.slice(1).join(',') == [i,i,i,i].join(','))
		{
			k4 = true;
			score = 7;
			high_cards = [i];
			kickers = [cards[0]];
		}
	}
	//console.log('post quads check high cards:' + high_cards.join(','));
	if (!k4 && !s && !f)
	{
		// check for three of a kind
		for (var i=2; i<15; i++){
			if (cards.slice(0,3).join(',') == [i,i,i].join(','))
			{
				k3 = true;
				score = 3;
				high_cards = [i];
				kickers = [cards[3], cards[4]];
			}
			if (cards.slice(1,4).join(',') == [i,i,i].join(','))
			{
				k3 = true;
				score = 3;
				high_cards = [i];
				kickers = [cards[0], cards[4]];
			}
			if (cards.slice(2,5).join(',') == [i,i,i].join(','))
			{
				k3 = true;
				score = 3;
				high_cards = [i];
				kickers = cards.slice(0,2);
			}
		}
		//console.log('post trips check high cards:' + high_cards.join(','));
		if (k3){
			// check for full house
			if (kickers[0] == kickers[1]){
				fh = true;
				score = 6;
				k3 = false;
				high_cards.push(kickers[0]);
				kickers = [];
			}
		}
		//console.log('post boat check high cards:' + high_cards.join(','));
	}
	if (!k4 && !s && !f && !fh && !k3)
	{
		// check for pair
		for (var i=0; i<4; i++){
			if (cards[i] == cards[i+1]){
				if (p1){
					p2 = true;
					score = 2;
					p1 = false;
					high_cards = [cards[i], high_cards[0]];
				} else {
					p1 = true;
					score = 1;
					high_cards = [cards[i]];
				}

			}
		}
		if (p1 || p2)
		{
			for (var i=0; i<5; i++)
			{
			   if (high_cards.indexOf(cards[i]) == -1)
			   {
			   	kickers.push(cards[i]);
			   }
			}
		}
		high_cards = high_cards.sort(function(a,b){return b-a});
		//console.log('post pair check high cards:' + high_cards.join(','));
	}

	//console.log('cards:' + cards.join(','));
	//console.log('flush:' + f);
	//console.log('straight:' + s);
	//console.log('four of a kind:' + k4);
	//console.log('three of a kind:' + k3);
	//console.log('full house:' + fh);
	//console.log('two pair:' + p2);
	//console.log('pair:' + p1);
	//console.log('high cards:' + high_cards.join(','));
	//console.log('kickers:' + kickers.join(','));

	//.sort(function(a,b){return b-a})

	if (s){
		score = 4;
	}
	if (f){
		score = 5;
	}
	if (s && f)
	{
		score = 8;
	}
	score = ("00" + score).substr(-2) + ".";
	for (i in high_cards)
	{
		score = score + ("00" + high_cards[i]).substr(-2);
	}
	//console.log('post score check high cards:' + high_cards.join(','));
	kickers = kickers.sort(function(a,b){return b-a});
	for (i in kickers)
	{
		score = score + ("00" + kickers[i]).substr(-2);
	}
	//console.log('post kickers check high cards:' + high_cards.join(','));
    return {
		score: score, 
		high_cards: high_cards, // sixes over threes
		kickers: kickers // no kickers in full house
    };
};


