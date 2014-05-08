var window_height;
var window_width;
var success;
var match;
var turns;

$(document).ready(function() {
	window_width = window.innerWidth;
	window_height = window.innerHeight;

	orientationAdjustments();
});
$('#userNav').hide("slide", {direction: "left" }, 1000);

function orientationAdjustments() {
	if (window_width > window_height) { //landscape orientation

	} else { //portrait orientation

	}
}

var tiles = new Array(),
	flips = new Array('tb', 'bt', 'lr', 'rl' ),
	iFlippedTile = null,
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4,5,6,7,8,9,10),
	tileAllocation = null,
	iTimer = 0,
	iInterval = 100,
	iPeekTime = 3000;


var tileCounter;

function pagestart() {
$('#success').hide("slide", {direction: "left" }, 10);
$('#nomatch').hide("slide", {direction: "left" }, 10);
$('#match').hide("slide", {direction: "left" }, 10);

}


function showboard() {
$('#success').hide("slide", {direction: "left" }, 10);
$('#nomatch').hide("slide", {direction: "left" }, 10);
$('#match').hide("slide", {direction: "left" }, 10);
$('#board').show("slide", {direction: "left" }, 500);
//$('#board').show("slide", { direction: "right" }, 1000);
document.getElementById("board").className = "showboard";
match=0;
}




function getRandomImageForTile() {

	var iRandomImage = Math.floor((Math.random() * tileAllocation.length)),
		iMaxImageUse = 2;
	
	while(tileAllocation[iRandomImage] >= iMaxImageUse ) {
			
		iRandomImage = iRandomImage + 1;
			
		if(iRandomImage >= tileAllocation.length) {
				
			iRandomImage = 0;
		}
	}
	
	return iRandomImage;
}

function createTile(iCounter) {
	
	var curTile =  new tile("tile" + iCounter),
		iRandomImage = getRandomImageForTile();
		
	tileAllocation[iRandomImage] = tileAllocation[iRandomImage] + 1;
		
	curTile.setFrontColor("tileColor" + Math.floor((Math.random() * 5) + 1));
	curTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));
	curTile.setFlipMethod(flips[Math.floor((Math.random() * 3) + 1)]);
	curTile.setBackContentImage("images/" +  (iRandomImage + 1) + ".png");
	
	return curTile;
}

function initState() {

	/* Reset the tile allocation count array.  This
		is used to ensure each image is only 
		allocated twice.
	*/
	

	var level = document.getElementById('selectlvl').value;
	switch (level) {
		case 'lvl1': 
			tileAllocation = new Array(0,0);
			tileCounter = 4;
			document.getElementById('board').style = "";
			//document.getElementsByClassName('tile').style = "width: 40%";
			$('<style>.tile {width: 43.5%; height:39%; margin: 1%;} .tile img{padding:7% 0%; height: 80%;} <style>').appendTo("head");
			success = 2;
			break;
		case 'lvl2': 
			tileAllocation = new Array(0,0,0);
			tileCounter = 6;
			document.getElementById('board').style = "";
			$('<style>.tile {width: 29.7%; height:38%; margin: 1%;} .tile img{padding:10% 0%; height: 70%;} <style>').appendTo("head");
			success = 3;
			break;
		case 'lvl3': 
			tileAllocation = new Array(0,0,0,0);
			tileCounter = 8;
			document.getElementById('board').style = "";
			$('<style>.tile {width: 21.5%; height:30%; margin: 1.5% 1%;} .tile img{padding:15% 0%; height: 60%;} <style>').appendTo("head");
			success = 4;
			break;
		case 'lvl4': 
			tileAllocation = new Array(0,0,0,0,0,0);
			tileCounter = 12;
			document.getElementById('board').style = "";
			$('<style>.tile {width: 22%; height:28%; margin: .5%;} .tile img{padding:10% 0%; height: 70%;} <style>').appendTo("head");
			success = 6;
			break;		

		case 'lvl5': 
			tileAllocation = new Array(0,0,0,0,0,0,0,0);
			tileCounter = 16;
			document.getElementById('board').style = "";
			$('<style>.tile {width: 20%; height: 20%; margin: .8%;} .tile img{padding:8% 0%; height: 80%;}<style>').appendTo("head");
			success = 8;
			break;	

		case 'lvl6': 
			tileAllocation = new Array(0,0,0,0,0,0,0,0,0,0);
			tileCounter = 20;
			document.getElementById('board').style = "";
			$('<style>.tile {width: 22%; height:17.5%; margin: .5%;} .tile img{padding: 5%; height: 80%;}<style>').appendTo("head");
			success = 10;
			break;	
	}

	
	
	while(tiles.length > 0) {
		tiles.pop();
	}
	
	$('#board').empty();
	iTimer = 0;
	
}

function initTiles() {

	var iCounter = 0, 
		curTile = null;

	initState();
	
	// Randomly create twenty tiles and render to board
	for(iCounter = 0; iCounter < tileCounter; iCounter++) {
		
		curTile = createTile(iCounter);
		
		$('#board').append(curTile.getHTML());
		
		tiles.push(curTile);
	}	
// reset score counter	
	turns=0;
}

function hideTiles(callback) {
	
	var iCounter = 0;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		tiles[iCounter].revertFlip();

	}
	
	callback();
}

function revealTiles(callback) {
	
	var iCounter = 0,
		bTileNotFlipped = false;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		if(tiles[iCounter].getFlipped() === false) {
		
			if(iTimer > tiles[iCounter].getStartAt()) {
				tiles[iCounter].flip();
			}
			else {
				bTileNotFlipped = true;
			}
		}
	}
	
	iTimer = iTimer + iInterval;

	if(bTileNotFlipped === true) {
		setTimeout("revealTiles(" + callback + ")",iInterval);
	} else {
		callback();
	}
}

function playAudio(sAudio) {
	
	var audioElement = document.getElementById('audioEngine');
			
	if(audioElement !== null) {

		audioElement.src = sAudio;
		audioElement.play();
	}	
}
//check for a match
function checkMatch() {
	
	if(iFlippedTile === null) {
		  
		iFlippedTile = iTileBeingFlippedId;
		// increase score counter by one
			turns++;

	} else {
		
		if( tiles[iFlippedTile].getBackContentImage() !== tiles[iTileBeingFlippedId].getBackContentImage()) {
			
			setTimeout("tiles[" + iFlippedTile + "].revertFlip()", 2000);
			setTimeout("tiles[" + iTileBeingFlippedId + "].revertFlip()", 2000);
			
			//$('#nomatch').show("slide", {direction: "right" }, 2000);
			//$('#nomatch').hide("slide", {direction: "left" }, 2000);
			$("#nomatch").fadeIn(1700);
			$("#nomatch").fadeOut(1000);
			
			// increase score counter by one
		
			
			playAudio("mp3/no.mp3");

		} else {
		//check for all cards turned
			$("#match").fadeIn(1700);
			$("#match").fadeOut(1000);
			playAudio("mp3/applause.mp3");
			match++;
			if(match == success) {
			$("#board").fadeOut(1500);
			window.setTimeout("win();",1000);
			$("#success span").html(turns);
			
			
			
			
			}
		}


		iFlippedTile = null;
		iTileBeingFlippedId = null;
	}
}

//show success screen
function win() {
			document.getElementById("board").className = "hideboard";
			$('#success').show("slide", { direction: "right" }, 2000);
			//document.getElementById("success").className = "showboard";
			
		}

function onPeekComplete() {

	$('div.tile').click(function() {
	
		iTileBeingFlippedId = this.id.substring("tile".length);
	
		if(tiles[iTileBeingFlippedId].getFlipped() === false) {
			tiles[iTileBeingFlippedId].addFlipCompleteCallback(function() { checkMatch(); });
			tiles[iTileBeingFlippedId].flip();
		}
	  
	});
}

function onPeekStart() {
	setTimeout("hideTiles( function() { onPeekComplete(); })",iPeekTime);
}

$(document).ready(function() {
	
	$('#startGameButton').click(function() {
	
		initTiles();
		
		setTimeout("revealTiles(function() { onPeekStart(); })",iInterval);

	});
});