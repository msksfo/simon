/* =========================== Variables ========================*/

var on = document.getElementById('on');
var off = document.getElementById('off');
var startButton = document.getElementById('start-button');
var strictButton = document.getElementById('strict-button');
var countDisplay = document.getElementById('count-display');

var colors = document.getElementById('colors'); // this is the DIV

//var color = document.querySelectorAll('.color'); // this is a LIST
//var brightColors = ['#2ECC71','#FF0000', '#1E88E5', '#f2c71f'];

var sounds = [greenSound, redSound, blueSound, yellowSound];
var greenSound = new Audio('green-audio.mp3');
var redSound = new Audio('red-audio.mp3');
var blueSound = new Audio('blue-audio.mp3');
var yellowSound = new Audio('yellow-audio.mp3');


var simonColorArray = []; // list of simon's colors
var simonSoundArray = []; // list of simons's sounds 
var simonColorStringArray = []; // list of divs that can be clicked
var simonSlicedArray; // the array sliced up to (not including) the current round

var turn; 
var round;
var index;
var target = 0;
var userColorArray = [];

var strict = false;
var errorSound = new Audio('error-audio.mp3');

/* ===================== Event Handlers ==========================*/

on.addEventListener('click', turnOn);
off.addEventListener('click', turnOff);

startButton.addEventListener('click', function(e){
	powerCheck(startButton, 'rgba(255, 0, 0, 1)');
/*
	setTimeout(function(){
		main();
	}, 5000); // change back to 5 seconds when using countdown display
*/	
});

strictButton.addEventListener('click', function(e){ 
	// visual cue that strict mode is on
	powerCheck(strictButton, 'rgba(241, 196, 15, 1)');
	strict = true;

});

colors.addEventListener('click', function(e) {
	var pressedButton = e.target;

	if (pressedButton.id === 'green'){ 
		colorEvent(greenSound, pressedButton, '#2ECC71', '#218f4d');
	} else if (pressedButton.id === 'red'){
		colorEvent(redSound, pressedButton, '#ff0000', '#c2181b');
	} else if (e.target.id === 'blue'){
		colorEvent(blueSound, pressedButton, '#1e88e5', '#1f58b0');
	} else if (e.target.id === 'yellow'){
		colorEvent(yellowSound, pressedButton, '#f2c71f', '#d2aa0c');
	}

	if (turn === 'user'){
		userColorArray.push(pressedButton.id)
		if (userColorArray.length === simonSlicedArray.length && isMatch(userColorArray[target], simonColorArray[target])) {
			target = 0;
			userColorArray = [];
			setTimeout(nextRound, 1300);
		} else if (isMatch(userColorArray[target], simonColorArray[target])){
			target ++;
		} else {
			if (strict === true){
				//countDisplay.innerHTML = 0;
				errorSound.play();
				getRandomColors();
				round = 1;
				countDisplay.innerHTML = round;
			}
			errorSound.play();
			target = 0;
			userColorArray = [];
			turn = 'simon';
			setTimeout(simonsTurn, 2000);
		}
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
		if (button === startButton){
			beginCountdown();
			setTimeout(function(){
				main();
			}, 5000); // change back to 5 seconds when using countdown display
		} 
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

function playSound(sound){
	sound.play()
}

function colorEvent(sound, button, brightColor, defaultColor){
	// toggle colors and play sound corresponding to which button was pressed
	playSound(sound);
	button.style.backgroundColor = brightColor;
	toggleColor(button, defaultColor);
}

function playGame(){
	turn = 'simon';
	round = 1; // user wins if they complete round (numberOfRounds)
	index = 0; // used to mark up to which index simon should 'click'
	countDisplay.innerHTML = 1; // this shows which round is currently in play
	simonsTurn();
}

function simonsTurn(){
	if (round === 1){ // if it is round 1, simon should click the first div in the array.
		simonColorStringArray[0].click();
		turn = 'user'; // then set the turn to user.
	} else {
		// otherwise simon should click through the array, stopping when the index is equal to the round.
		index = 0; 
		playSoundsArray(); 
	}
	simonSlicedArray = simonColorArray.slice(0, round);

	console.log(simonSlicedArray);
}


function isMatch(a, b){ // takes 2 arrays, the user's and simon's, and checks if they match
	return a === b;
}

function getRandomColors(){
	simonColorArray = [];
	simonSoundArray = [];
	simonColorStringArray = [];

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
	//console.log(simonColorStringArray);
}

function playSoundsArray(){
	// this function recurssively calls itself every second until the index is equal to the round
	setTimeout(function(){ 
		simonColorStringArray[index].click();
		index ++;
		if (index < round){ 
			playSoundsArray();
		} else {
			turn = 'user';
		}
	}, 1000);
}

function nextRound(){ 
	// user copied simon correctly, so...
	round++; // increment the round
	if (round === 4){ // the user wins if they reach round (whatever)
		newGame();
	} else {
		countDisplay.innerHTML = round; // update the display on the game board
		turn = 'simon'; // set turn to simon. 
		simonsTurn();
	}
}

function newGame(){
	// reset button colors and display values to default. 
	strict = false;
	strictButton.style.backgroundColor = 'rgba(241, 196, 15, .3)';
	resetCount();
	startButton.style.backgroundColor = 'rgba(255, 0, 0, .6)';
	// let user know they won
	document.getElementById('congratulations').style.display = 'flex';
	// after 3 seconds, toggle back to default display so they can play again.
	setTimeout(function(){
		document.getElementById('congratulations').style.display = 'none';
	}, 3000);
}

function toggleColor(element, color){ // put back the default color of the div that was clicked
	setTimeout(function(){
		element.style.backgroundColor = color;
	}, 900);
}

function main(){
	getRandomColors(); // get 20 random colors for simon
	playGame();
}





