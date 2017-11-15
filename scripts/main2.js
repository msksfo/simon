/* =========================== Variables ========================*/

var on = document.getElementById('on');
var off = document.getElementById('off');
var startButton = document.getElementById('start-button');
var strictButton = document.getElementById('strict-button');
var countDisplay = document.getElementById('count-display');

var colors = document.getElementById('colors'); // this is the DIV

var greenSound = new Audio('green-audio.mp3');
var redSound = new Audio('red-audio.mp3');
var blueSound = new Audio('blue-audio.mp3');
var yellowSound = new Audio('yellow-audio.mp3');
var errorSound = new Audio('error-audio.mp3');


/* ===================== Event Handlers ==========================*/

on.addEventListener('click', turnOn);
off.addEventListener('click', turnOff);

startButton.addEventListener('click', function(e){
	powerCheck(startButton, 'rgba(255, 0, 0, 1)');

	setTimeout(function(){
		playGame();
	}, 1000); // change back to 5 seconds when using countdown display
	
});

strictButton.addEventListener('click', function(e){ 
	// visual cue that strict mode is on
	powerCheck(strictButton, 'rgba(241, 196, 15, 1)');
});

colors.addEventListener('click', function(e){
	// note to self- find a DRY way of doing this

	if (e.target.id === 'green'){ // if the green button was clicked...
		greenSound.play(); // play the 'green' sound.
		e.target.style.backgroundColor = '#2ECC71'; // brighten the background color
		toggleColor(e.target, '#218f4d'); // put the background color back to default
	} else if (e.target.id === 'red'){
		redSound.play();
		e.target.style.backgroundColor = '#FF0000';
		toggleColor(e.target, '#c2181b');
	} else if (e.target.id === 'blue'){
		blueSound.play();
		e.target.style.backgroundColor = '#1E88E5';
		toggleColor(e.target, '#1f58b0');
	} else if (e.target.id === 'yellow'){
		yellowSound.play();
		e.target.style.backgroundColor = '#f2c71f';
		toggleColor(e.target, '#d2aa0c');
	}
});
	

/* ============================= Functions ===========================*/

function turnOn(){ // turn the 'power' on
	on.style.backgroundColor = '#1f58b0';
	startCount();
	
	off.onmouseenter = function(){ // simulate :hover background color change
		off.style.backgroundColor = '#c2181b';
	}
	off.onmouseleave = function(){
		off.style.backgroundColor = '#4e4f50';
	}
}

function turnOff(){ // reset styling on all buttons & clear the count display
	on.style.backgroundColor = '#4e4f50';
	off.style.backgroundColor = '#4e4f50';

	off.onmouseenter = function(){
		off.style.backgroundColor = '#4e4f50';
	}

	startButton.style.backgroundColor = 'rgba(255, 0, 0, .6)';
	strictButton.style.backgroundColor = 'rgba(241, 196, 15, .3)';
	clearCount();
}

function resetCount (){ // called when user makes an error in strict mode
	countDisplay.innerHTML = 0;
}

function startCount(){ // called when on button is clicked
	countDisplay.innerHTML = '- -'; // simulates a device powering up
	setTimeout(function(){
		countDisplay.innerHTML = 0;
	}, 1200);
}

function clearCount(){ // called when off button is clicked. resets count display
	countDisplay.innerHTML = '';
}

function powerCheck(button, color){ // make sure user cannot play without clicking the on button
	if (on.style.backgroundColor !== 'rgb(31, 88, 176)'){
		alert('There is no power, dum dum. Please turn me on.');
	} else {
		button.style.backgroundColor = color;
		//beginCountdown(); //DONT FORGET TO UNCOMMENT THIS!!!!!! 
	}
}

function beginCountdown(){ // gives user 3 second countdown before first tone
	var interval;
	var number = 3;

	interval = setInterval(function(){
		if (number === 0){
			return endCountdown();
		} else {
			countDisplay.innerHTML = '... ' + number;
			number --;
		}
	}, 1000);
	
	function endCountdown(){
		clearInterval(interval);
		countDisplay.innerHTML = '';
	}
}

function playGame(){
	var color = document.querySelectorAll('.color'); // this is a LIST
	var brightColors = ['#2ECC71','#FF0000', '#1E88E5', '#f2c71f'];
	var sounds = [greenSound, redSound, blueSound, yellowSound];
	var simonColorArray = []; // list of simon's colors
	var simonSoundArray = []; // list of simons's sounds 
	var simonColorStringArray = []; // list of divs that can be clicked

	getRandomColors(); // get 20 random colors for simon
	
	var round = 3; // user wins if they complete round 20
	var index = 0; // used to mark up to which index simon should 'click'
	countDisplay.innerHTML = 1; // this shows which round is currently in play
	var turn = 'simon'; // the game should begin with it being simons turn
	
	function simonsTurn(){
		if (round === 5){ // game ends when user reaches round (whatever)
			console.log('game over');
		} else if (round === 1){ // if it is round 1, simon should click the first div in the array.
			simonColorStringArray[0].click();
			turn = 'user'; // then set the turn to user.
		} else {
			// otherwise simon should click through the array, stopping when the index is equal to the round.
			index = 0; 
			playSoundsArray(); 
			turn = 'user'; // then set the turn to user.
		}
		usersTurn();
	}

	simonsTurn();

	function usersTurn(){
		var passedRound = false;
		for (let x = 0; x < round; x++){ // test each button that the user clicks
			colors.onclick = function(e){
				let userColor = e.target.id; // get a reference to what the user clicked

				if (isMatch(userColor, simonColorArray[x]) !== true){ // if it does not match simon's...
					console.log('WRONG!!!'); // alert user that they made a mistake
					//errorSound.play(); // why so loud??????

					turn = 'simon';// user made an error -> exit usersTurn and tell simon to repeat the array of sounds
					return repeat();
				} 

			} // end colors.onclick function
		} // end for loop

		
	}

	function getRandomColors(){
		var color = document.querySelectorAll('.color'); // this is a LIST
		for (var d = 0; d < 20; d++){
			var random = Math.floor(Math.random() * 4);
			var randomColor = color[random];
			var randomSound = sounds[random];
			simonColorStringArray.push(randomColor); 
			simonColorArray.push(randomColor.id);
			simonSoundArray.push(randomSound);
		}
		console.log(simonColorArray);
		//setTimeout(playSoundsArray, 0100); //this line is only used for testing
	}

	function playSoundsArray(){
		// this function recurssively calls itself every second until the index is equal to the round
		setTimeout(function(){ 
			simonColorStringArray[index].click();
			index ++;
			if (index < round){ 
				playSoundsArray();
			}
		}, 1000);
	}

	function nextRound(){ 
		// user copied simon correctly, so...
		round++; // increment the round
		countDisplay.innerHTML = round; // update the display on the game board
		turn = 'simon'; // set turn to simon. 
		simonsTurn();
	}

	function repeat(){
		setTimeout(simonsTurn, 2000);
	}

	
	
} // end playGame function

function isMatch(a, b){ // used in a for loop to check for a match between the user click and simons (at the same index)
	return a === b;
}

function toggleColor(element, color){ // put back the default color of the div that was clicked
	setTimeout(function(){
		element.style.backgroundColor = color;
	}, 900);
}



