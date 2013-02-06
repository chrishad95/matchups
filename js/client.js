var prGame = {
	players: [],
	name:   "" 
}

var lines = [];

var KEY = {
	UP: 38,
	DOWN: 40,
	W:87,
	S:83,
	ENTER: 13,
	RIGHT: 39,
	SPACE: 32,
    LEFT: 37
}

var random_commands = false;

var socket;
var image_loaded = false;
var img = new Image();
var message_buffer = new Array();

$(function () {
	img.src = 'cards.png';
	img.onload = function(){
		image_loaded = true;
	}
	var stage = new Kinetic.Stage({
		container: 'container',
		width: 578,
		height: 200
		});
	var layer = new Kinetic.Layer();
	
	var rect = new Kinetic.Rect({
		width: 100,
		height: 200
	});

	layer.add(rect);
	stage.add(layer);

	setInterval(gameloop, 5000);
});

function gameloop(){
	if (random_commands){
		console.log("random commands = " + random_commands);
		commands = [];
		names = ['jimmy', 'bob', 'bill', 'randal', 'chris', 'dick', 'jack', 'george', 'carla', 'sue', 'betty', 'Taylor', 'Olivia'];
		game_names = ['fun', 'hell', 'football', 'baseball', 'soccer', 'ping pong', 'rugby', 'darts', 'polo', 'monopoly', 'checkers', 'chess', 'othello'];

		commands.push( {type: 'game', message: 'new ' + game_names[Math.floor((Math.random()* game_names.length ))]} );
		commands.push( {type: 'game', message: 'join 0'} );
		commands.push( {type: 'game', message: 'join ' +  Math.floor((Math.random()* commands.length ))} );
		commands.push( {type: 'set nickname', message: names[Math.floor((Math.random()* names.length ))]} );
		commands.push( {type: 'game', message: 'bet 1'} );
		commands.push( {type: 'game', message: 'bet 2'} );
		commands.push( {type: 'game', message: 'bet 0'} );
		commands.push( {type: 'game', message: 'list'} );
		commands.push( {type: 'game', message: 'leave'} );
		commands.push( {type: 'game', message: 'start'} );
		commands.push( {type: 'game', message: 'status'} );
		c = Math.floor((Math.random()* commands.length ));
		console.log(commands[c]);
		appendchat("command: /" + commands[c].type + " " + commands[c].message);
		socket.emit(commands[c].type, commands[c].message);
	}
}
