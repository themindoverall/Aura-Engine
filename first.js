/* var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write('what up dood\n');
	res.end();
}).listen(8124, "127.0.0.1");
console.log('Server running at localhost.\n'); */

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

var enemy = {hp: 100, max: 100};

var commands = {
	"hp?": function() {
		return enemy.hp + "/" + enemy.max;
	},
	"attack": function() {
		atkpwr = 4;
		enemy.hp -= atkpwr;
		return "You attack for " + atkpwr + " damage.";
	},
	"whoami": function(player) {
		return player.name + " HP: " + player.hp + "/" + player.hpmax;
	},
	"help": function() {
		return "say something nice.";
	}
}

var players = {}

function Player(name) {
	this.name = name;
	this.hp = 40;
	this.hpmax = 40;
	this.mp = 10;
	this.mpmax = 10;
}

var net = require('net');
var jspack = require('./jspack');

net.createServer(function (socket) {
	console.log("New Connection.");
	socket.write("What is your name?\r\n");
	socket.on("data", function(data) {
		cmd = data.toString().trim()
		
		if (!(socket in players)) {
			players[socket] = new Player();
			players[socket].name = cmd;
			console.log("New player: " + players[socket].name);
			var b = jspack.Pack('H', [128])
			socket.write(b);
			//socket.write("Hello, " + players[socket].name + '\n');
			return;
		}
		player = players[socket]
		
		if (cmd in commands) {
			socket.write(commands[cmd](player) + "\n");
		} else {
			socket.write("Unrecognized command '" + cmd + "'\n");
		}
	});
	socket.on("close", function() {
		if (!(socket in players)) {
			console.log("New Connection disconnected.");
		} else {
			player = players[socket];
			console.log(player.name + " has disconnected.");
			delete players[socket];
		}
	});
}).listen(8124, "127.0.0.1");