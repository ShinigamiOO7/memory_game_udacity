
var flag=0;
var getReadyBtn=document.getElementById("but");
var rdyToPlay=document.getElementById("readyToPlay");
getReadyBtn.addEventListener("click",function(event){
    flag=1;
    getReadyBtn.setAttribute("style","visibility:hidden");
    rdyToPlay.setAttribute("style","visibility:hidden");
});

//the game_data will
const game_data ={
	move :0,
	star :3,
	incrementMove : () => {
		if(flag===1){
			game_data.move +=1;
			glue.player_moves_set(game_data.move);
			if(game_data.move===30){
				game_data.star=2;
				glue.player_reward_stars(2);
				}
				else if(game_data.move===40){
					game_data.star=1;
				glue.player_reward_stars(1);
				}
				else{}
		}

	},
	initial_point : () => {
		game_data.move=0;
		game_data.star=3;
		glue.player_moves_set(0);
		glue.player_reward_stars(3);
	}

}
Object.seal(game_data);
	/*
 * Create a list that holds all of your cards
 */
const Symbol = {
	ANCHOR :'fa fa-anchor',
	BICYCLE :'fa fa-bicycle',
	BOLT :'fa fa-bolt',
	BOMB :'fa fa-bomb',
	CUBE :'fa fa-cube',
	DIAMOND :'fa fa-diamond',
	LEAF :'fa fa-leaf',
	PLANE :'fa fa-paper-plane-o',
}
Object.freeze(Symbol);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const State ={
	CLOSED :'card',
	OPENED :'card open show',
	MATCHED :'card open match',
}
Object.freeze(State);


const Deck = {
	 cards : [Symbol.ANCHOR, Symbol.ANCHOR, Symbol.BICYCLE, Symbol.BICYCLE, Symbol.BOLT, Symbol.BOLT, Symbol.BOMB, Symbol.BOMB, Symbol.CUBE, Symbol.CUBE, Symbol.DIAMOND, Symbol.DIAMOND, Symbol.LEAF, Symbol.LEAF, Symbol.PLANE, Symbol.PLANE],
    opened : [],
	matched :[],
	// suffle algolithm from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
	shuffle : (array) => {
		for(let i=array.length - 1; i > 0; --i){
			const j=Math.floor(Math.random() * (i+1));
			var temp =array[i];
			array[i]=array[j];
			array[j]=temp;
		}
		glue.set_symbol(array);

	},	
	//this will initial_point the page to its initilized form and there will be suffle performed to change the positions of the card	
	initial_point :() => {
		Deck.opened.length =0;
		 Deck.matched.length =0;
		 for(let i=0; i<Deck.cards.length; i++){
		 	glue.shut_card(i);

		 }
		 Deck.shuffle(Deck.cards);
	},
//
	open_the_card :({index, symbol}) => {
		Deck.opened.push({index,symbol}) 
		glue.card_unlocked(index);
		if(Deck.opened.length===2)
		{
			window.setTimeout(Deck.match_checker, 200); 
		}
	},

	match_checker : () => {
		const c0=Deck.opened[0];
		const c1=Deck.opened[1];

		if(c0.symbol !== c1.symbol){
			glue.shut_card(c0.index);
			glue.shut_card(c1.index);
			Deck.opened.length=0;
		}
		else{
			glue.card_linked(c0.index);
			glue.card_linked(c1.index);
			Deck.matched.push(c0,c1);
			Deck.opened.length=0;

		}
		if(Deck.matched.length === Deck.cards.length){
			getReadyBtn.setAttribute("style","visibility:visible");
			rdyToPlay.setAttribute("style","visibility:visible");
			getReadyBtn.style.height="140px";
			getReadyBtn.innerHTML="!!!! YOU WIN !!!!<br>congratulation !<br>star rating: "+ game_data.star+"<br>total moves: "+game_data.move+"<br>click to restart";
			flag=0;
		}
	},		
			
}
Object.freeze(Deck);
Object.seal(Deck.cards)


class glue {
	static player_reward_stars(numStars){
		const d =document.getElementsByClassName("stars")[0];
		const starHTML='<li><i class="fa fa-star"></i></li>';
		d.innerHTML=starHTML.repeat(numStars);

	}

	static player_moves_set(numMoves){
		const d =document.getElementsByClassName("moves")[0];
		
		d.innerHTML=numMoves;
	}
	static card_unlocked(cardIndex){
		if(flag===1)
		{
			const d=document.getElementsByClassName("card");
			d[cardIndex].setAttribute("class",State.OPENED);
		}
	}
	static shut_card(cardIndex){
		
			const d=document.getElementsByClassName("card");
			d[cardIndex].setAttribute("class",State.CLOSED);
	}
	static card_linked(cardIndex){
			const d=document.getElementsByClassName("card");
			d[cardIndex].setAttribute("class",State.MATCHED);
	}

	static set_symbol(cards){
		const d=document.getElementsByClassName("card");
		for(var i=0; i<cards.length; i++){
			//console.log(cards[i]);
			 d[i].firstChild.setAttribute("class", cards[i]);
		}
	}
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
class EventListener{
	static setClickStart(){
		const d=document.getElementsByClassName('but')[0];
	d.addEventListener("click",EventHandler.clickStart);
	}

	static setClickRestart(){
		const d=document.getElementsByClassName('restart')[0];
		d.addEventListener("click",EventHandler.clickRestart);
		flag=0;
	}
	static setClickCards(){
		const d=document.getElementsByClassName("deck")[0];
		d.addEventListener("click",(e)=>{
			const state=e.target.className;
			if(state===State.CLOSED){
				EventHandler.clickCard(e);
			}
		});
	}
}



class EventHandler{
	static clickCard(e){
		const index =e.target.id;
		const state =e.target.className;
		const symbol =e.target.firstChild.className;

		game_data.incrementMove();
		Deck.open_the_card({index,symbol});
	}
	static clickRestart(){
		Deck.initial_point();
		game_data.initial_point();
		getReadyBtn.setAttribute("style","visibility:visible");
		rdyToPlay.setAttribute("style","visibility:visible");
		flag=0;
	}
	static clickStart(e){
		 Deck.initial_point();
		game_data.initial_point();
	}
}



function main(){
	EventListener.setClickStart();
	EventListener.setClickRestart();
	EventListener.setClickCards();
}


main();





