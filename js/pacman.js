// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
 var scoreContainer;
 var lifesContainer;
 
 var eatpill;
 var eating;
 var waza;
 var siren;
 var die;
 var eatghost;
 var ghosteaten;

    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};

    const TILE_WIDTH=24, TILE_HEIGHT=24;
        var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost

	
	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;
		
		this.spritesGhost = {};
		this.spritesGhost[0] = new Sprite('res/img/sprites.png', [456, 16*this.id + 65],[16,16], 0.005, [0,1]); //normal
		this.spritesGhost[1] = new Sprite('res/img/sprites.png', [584, 16*0 + 65],[16,16], 0.005, [0,1]); //asustado
		this.spritesGhost[2] = new Sprite('res/img/sprites.png', [584, 16*1 + 65],[16,16], 0.005, [0,1]); //volviendo

	this.draw = function(){

		ctx.save();
		ctx.translate(this.x,this.y);
		
		

		if(this.state==Ghost.NORMAL){
			this.spritesGhost[0].render(ctx);
		}
		else if(this.state==Ghost.VULNERABLE){
			this.spritesGhost[1].render(ctx);
		}
		else{
			this.spritesGhost[2].render(ctx);
		}
		ctx.restore();
		

		
		

	}; // draw

	    	this.move = function() {

			if(this.state!=Ghost.SPECTACLES){
				var baldosas = [];

			for(var i = 0;i<thisLevel.lvlHeight;i++){
				for(var j = 0;j<thisLevel.lvlWidth;j++){
					var xInicio = 24*j;
					var yInicio = 24*i;
					//poner solo
					if(xInicio-24<this.x && xInicio+24+24>this.x+24 && 
					yInicio-24<this.y && yInicio+24+24>this.y+24){
						var casilla = [i,j];
						baldosas.push(casilla);
					}
				}
			}

			if(baldosas.length==1){
				var futuroI = baldosas[0][0]+this.velY;
				var futuroJ = baldosas[0][1]+this.velX;
				
				var soluciones = [];
				if(!thisLevel.isWall(baldosas[0][0],baldosas[0][1]-1)){
					soluciones.push([baldosas[0][0],baldosas[0][1]-1]);
				}
				if(!thisLevel.isWall(baldosas[0][0],baldosas[0][1]+1)){
					soluciones.push([baldosas[0][0],baldosas[0][1]+1]);
				}
				if(!thisLevel.isWall(baldosas[0][0]-1,baldosas[0][1])){
					soluciones.push([baldosas[0][0]-1,baldosas[0][1]]);
				}
				if(!thisLevel.isWall(baldosas[0][0]+1,baldosas[0][1])){
					soluciones.push([baldosas[0][0]+1,baldosas[0][1]]);
				}
				if(soluciones.length>2 || thisLevel.isWall(futuroI,futuroJ) || (soluciones.length==1 && this.x==this.homeX)){
					var random = Math.floor(Math.random() * soluciones.length);
				if(soluciones[random][1]==baldosas[0][1]+1){
					this.velY=0;
					this.velX=this.speed;
				}
				else if(soluciones[random][1]==baldosas[0][1]-1){
					this.velX=-this.speed;
					this.velY=0;
				}
				else if(soluciones[random][0]==baldosas[0][0]+1){
					this.velY=+this.speed;
					this.velX=0;
				}
				else if(soluciones[random][0]==baldosas[0][0]-1){
					this.velY=-this.speed;
					this.velX=0;
				}
				}
				
			}
			}
			
			else{
				if(this.x-this.homeX<0){
					this.velX=this.speed;
					this.velY=0;
				}
				else if(this.x-this.homeX>0){
					this.velX=-this.speed;
					this.velY=0;	
				}
				else if(this.y-this.homeY<0){
					this.velX=0;
					this.velY=this.speed;	
				}
				else if(this.y-this.homeY>0){
					this.velX=0;
					this.velY=-this.speed;	
				}
				if(this.x==this.homeX && this.y==this.homeY){
					this.state=Ghost.NORMAL;
					this.velX=0;
					this.velY=0;
					ghosteaten.play();
				}
			}
			this.x=this.x+this.velX;
			this.y=this.y+this.velY;

		};
		
	

	};
	  Ghost.NORMAL = 1;
	  Ghost.VULNERABLE = 2;
	  Ghost.SPECTACLES = 3;

var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 196;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		
		this.map[row][col] = newValue;
	};

	this.getMapTile = function(row, col){
		return this.map[row][col];	
	};

	this.printMap = function(){
		// tu código aquí
	};

	this.loadLevel = function(){
		// leer res/levels/1.txt y guardarlo en el atributo map	
		// haciendo uso de setMapTile
		var file = "res/levels/1.txt";
		getFile();
		function getFile(){
			
			$.get(file,function(txt){
				var lines = txt.split('\n');
				thisLevel.lvlWidth = lines[0].replace( /^\D+/g, '');
				thisLevel.lvlHeight = lines[1].replace( /^\D+/g, '');

				for (i=0;i<thisLevel.lvlHeight;i++) {
					thisLevel.map[i]=new Array();
					for (j=0;j<thisLevel.lvlWidth;j++) {
						thisLevel.map[i][j]=0;
					}
				}
				//console.log(lines[3]); se salta esta
				var ghost_number = 0;
				for(var i = 4;i<+thisLevel.lvlHeight+ +4;i++){
					var arrayNumeros = lines[i].split(' ').map(Number);
					for(var j = 0;j<arrayNumeros.length-1;j++){
						thisLevel.setMapTile(i-4,j,arrayNumeros[j]);
						/*if(arrayNumeros[j]==2 || arrayNumeros[j]==3){
							thisLevel.pellets = thisLevel.pellets+1;
						}*/
						if(arrayNumeros[j]==4){
							player.homeX = thisGame.TILE_WIDTH*j+2;
							player.homeY = thisGame.TILE_HEIGHT*(i-4)+2;
						}
						if(arrayNumeros[j]>=10 && arrayNumeros[j]<=13){
							ghosts[ghost_number].homeX = thisGame.TILE_WIDTH*j;
							ghosts[ghost_number].homeY = thisGame.TILE_HEIGHT*(i-4);
							ghost_number = ghost_number+1;
						}
					}
				}
				
				reset();
			}); 
		}
	
	}

    this.drawMap = function(){
this.powerPelletBlinkTimer = this.powerPelletBlinkTimer+1;
if(this.powerPelletBlinkTimer==61){
	this.powerPelletBlinkTimer = 0;
}
	   var TILE_WIDTH = thisGame.TILE_WIDTH;
	    var TILE_HEIGHT = thisGame.TILE_HEIGHT;

    	var tileID = {
	    		'door-h' : 20,
			'door-v' : 21,
			'pellet-power' : 3
		};

		var posX = 0;
		var posY = 0;
		for(var i = 0;i<thisLevel.lvlHeight;i++){
			for(var j = 0;j<thisLevel.lvlWidth;j++){

				var tipo = thisLevel.getMapTile(i,j);
				//console.log(i+"; "+j+"; "+tipo);
				if(tipo==0){
					ctx.beginPath();
					ctx.fillStyle="rgba(0, 0, 0, 0)";
					ctx.fillRect(posX,posY,TILE_WIDTH,TILE_HEIGHT);
				}
				else if(tipo==20 || tipo==21){
					ctx.beginPath();
					ctx.fillStyle = "rgba(0, 0, 0, 0)";
					ctx.fillRect(posX,posY,TILE_WIDTH,TILE_HEIGHT);
				}
				else if(tipo>=10 && tipo<=13){
					ctx.beginPath();
					ctx.fillStyle="black";
					ctx.fillRect(posX,posY,TILE_WIDTH,TILE_HEIGHT);
				}
				else if(tipo>=100 && tipo<=199){
					ctx.beginPath();
					ctx.fillStyle="blue";
					ctx.fillRect(posX,posY,TILE_WIDTH,TILE_HEIGHT);
				}
				else if(tipo==2){
					ctx.beginPath();
					ctx.fillStyle="white";
					ctx.arc(posX+TILE_WIDTH/2, posY+TILE_HEIGHT/2, 5, 0, 2 * Math.PI);
					ctx.fill();

				}
				else if(tipo==3 && this.powerPelletBlinkTimer >=30){
					ctx.beginPath();
					ctx.fillStyle="red";
					ctx.arc(posX+TILE_WIDTH/2, posY+TILE_HEIGHT/2, 5, 0, 2 * Math.PI);
					ctx.fill();
				}
				posX = posX+TILE_WIDTH
			}
			posY = posY+TILE_HEIGHT;
			posX = 0;
		}
	};

	this.isWall = function(row, col) {
		if(row<0 || col<0){
			return true;
		}
		if(row>=thisLevel.lvlHeight || col>=thisLevel.lvlWidth){
			return true;
		}
			var tile = this.getMapTile(row,col);
			if(tile>=100 && tile<=199){
				return true;
			}
			return false;
	};

	this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
		
		var choca = false;
		
		for(var i = 0;i<this.lvlHeight;i++){
			for(var j = 0;j<this.lvlWidth;j++){
				var xInicio = 24*j;
				var yInicio = 24*i;
				
				if(xInicio-player.radius*2<=possiblePlayerX && xInicio+24+player.radius*2>=possiblePlayerX+player.radius*2 && 
					yInicio-player.radius*2<=possiblePlayerY && yInicio+24+player.radius*2>=possiblePlayerY+player.radius*2){
					if(this.isWall(i,j)){
						choca=true;
					}
				}
			}
		}
		
		return choca;
	};


		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};

		var choca = false;
		
		for(var i = 0;i<this.lvlHeight;i++){
			for(var j = 0;j<this.lvlWidth;j++){
				var xInicio = 24*j;
				var yInicio = 24*i;
				
				if(xInicio-player.radius*2<=playerX && xInicio+24+player.radius*2>=playerX+player.radius*2 && 
					yInicio-player.radius*2<=playerY && yInicio+24+player.radius*2>=playerY+player.radius*2){
					var tile = this.getMapTile(i,j);
					if(tile==2){
						this.pellets = this.pellets-1;
						this.setMapTile(i,j,0);
						addToScore(1);
						eating.play();
						return true;
					}
					if(tile==3){
						this.pellets = this.pellets-1;
						this.setMapTile(i,j,0);
						for(var i = 0; i<numGhosts;i++){
							ghosts[i].state = Ghost.VULNERABLE;
						}
						thisGame.ghostTimer = 360;
						addToScore(1);
						eatpill.play();
						waza.play();
						return true;
					}
					if(tile==20){ //horizontal
						if(player.x<w/2){ //esta a la izquierda
							player.x = player.x+24*(this.lvlWidth-3);
						}
						else{ //esta a la derecha
							player.x = player.x-24*(this.lvlWidth-3);;
						}
						return true;
					}
					if(tile==21){
						if(player.y<h/2){ //esta arriba
							player.y = player.y+24*(this.lvlHeight-3);
						}
						else{ //esta abajo
							player.y = player.y-24*(this.lvlHeight-3);
						}
						return true;
					}							
				}
			}
		}
		
		return choca;
		};
				var playerX = 240, playerY = 555, x = 23, y = 10, holgura = 10;
		this.checkIfHit = function(playerX, playerY, x, y, holgura){
			if(x-holgura<=playerX && x+24+holgura>=playerX+holgura && 
					y-holgura<=playerY && y+24+holgura>=playerY+holgura){
					
					return true;
				}
				return false;

		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.ctx = ctx;
		this.sprite = new Sprite('res/img/sprites.png', [454,0], [16,16], 0.005, [0,1,2]);
	};
	Pacman.prototype.move = function() {
this.sprite.update(delta);
if(this.velX>0){
			if((this.x>w-this.radius*2 && this.velX>0) || thisLevel.checkIfHitWall(this.x+this.speed,this.y,13,16)){
				this.velX=0;
			}
		}
		else if(this.velX<0){
			if((this.x<=0 && this.velX<0) || thisLevel.checkIfHitWall(this.x-this.speed,this.y,13,16)){
				this.velX=0;
			}
		}
		if(this.velY>0){
			if((this.y>h-this.radius*2 && this.velY>0) || thisLevel.checkIfHitWall(this.x,this.y+this.speed,13,16)){
				this.velY=0;
			}
		}
		else if(this.velY<0){
			if((this.y<0 && this.velY<0) || thisLevel.checkIfHitWall(this.x,this.y-this.speed,13,16)){
				this.velY=0;
			}
		}

		this.x = this.x+this.velX;
		this.y = this.y+this.velY;
		
		thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		for (var i=0; i< numGhosts; i++){
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,12)){
				if(ghosts[i].state==Ghost.VULNERABLE){
					addToScore(5);
					eatghost.play();
					ghosts[i].state = Ghost.SPECTACLES;
				}
				else if(ghosts[i].state==Ghost.NORMAL){
					die.play();
					thisGame.setMode( thisGame.HIT_GHOST);
				}
			}
		}
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
		//test2 Pac Man
		/*ctx.beginPath();
		ctx.arc(this.x+this.radius, this.y+this.radius, this.radius, this.angle1*Math.PI, this.angle2*Math.PI);
		ctx.lineTo(this.x+this.radius, this.y+this.radius);
		ctx.closePath();
		ctx.fillStyle = 'yellow';
		ctx.fill();
		ctx.stroke(); */
		//test2 
		
		ctx.save();
		ctx.translate(this.x,this.y);
		this.sprite.render(ctx);
		ctx.restore();

    };

	var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
	        setMode : function(mode) {
			this.mode = mode;
			this.modeTimer = 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0,
		NORMAL : 1,
		HIT_GHOST : 2,
		GAME_OVER : 3,
		WAIT_TO_START: 4,
		modeTimer: 0,
		lifes: 3,
		points: 0,
		highscore: 0
	};

	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};
	
	var addToScore = function(puntos) {
		thisGame.points = thisGame.points+puntos;
	};

	var displayScore = function() {
		document.getElementById("score").innerHTML = 'SCORE: ' + thisGame.points; 
	};
	
	var displayLifes = function() {
		document.getElementById("lifes").innerHTML = 'LIFES: ' + thisGame.lifes; 
	};

	var checkInputs = function(){
		if(inputStates.up){
			if(thisLevel.checkIfHitWall(player.x,player.y-player.speed,13,16)){

			}
			else{
				player.velX = 0;
				player.velY = -player.speed;		
			}
			inputStates.up = false;			
		}
		else if(inputStates.down){
			if(thisLevel.checkIfHitWall(player.x,player.y+player.speed,13,16)){

			}
			else{
				player.velX = 0;
				player.velY = player.speed;		
			}
			inputStates.down = false;
		}
		else if(inputStates.right){
			if(thisLevel.checkIfHitWall(player.x+player.speed,player.y,13,16)){
			}
			else{
				player.velX = player.speed;
				player.velY = 0;		
			}	
			inputStates.right = false;
		}
		else if(inputStates.left){
			if(thisLevel.checkIfHitWall(player.x-player.speed,player.y,13,16)){

			}
			else{
				player.velX = -player.speed;
				player.velY = 0;		
			}
			inputStates.left = false;
		}
	};


    var updateTimers = function(){
		thisGame.ghostTimer = thisGame.ghostTimer-1;
		if(thisGame.ghostTimer == 0){
			for(var i = 0; i<numGhosts;i++){
				ghosts[i].state = Ghost.NORMAL;
			}
			waza.stop();
		}
		thisGame.modeTimer =thisGame.modeTimer+1;
    };

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
		delta = timer(time);

		displayScore();
		displayLifes();
     

	if(thisGame.mode ==thisGame.NORMAL ){
		checkInputs();
		for(var i = 0; i<numGhosts;i++){
			ghosts[i].move();
		}
		player.move();
	}


	else if(thisGame.mode==thisGame.HIT_GHOST){
		if(thisGame.modeTimer==90){
				reset();
			thisGame.lifes = thisGame.lifes-1;
			thisGame.setMode( thisGame.WAIT_TO_START);	
		}

	}
	else if(thisGame.mode==thisGame.WAIT_TO_START){
		if(thisGame.modeTimer==30){
				reset();
			thisGame.setMode( thisGame.NORMAL);	
		}
	}

	// Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	for(var i = 0; i<numGhosts;i++){
		ghosts[i].draw();
	}
 
	player.draw();

	updateTimers();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

var addListeners = function(){
		window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 37) { //izquierda
		inputStates.left = true;
		inputStates.right = false;
		inputStates.up = false;
		inputStates.down = false;
    }else if (key == 38) { //arriba
		inputStates.left = false;
		inputStates.right = false;
		inputStates.up = true;
		inputStates.down = false;
    }else if (key == 39) { //derecha
		inputStates.left = false;
		inputStates.right = true;
		inputStates.up = false;
		inputStates.down = false;
    }else if (key == 40) { //abajo
		inputStates.left = false;
		inputStates.right = false;
		inputStates.up = false;
		inputStates.down = true;
    }}
   };

    var reset = function(){

player.x = player.homeX;
		player.y = player.homeY;

		inputStates.right = true;
		this.velX=this.speed;
	// Tu código aquí (test10)
	// Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente
	
		for(var i = 0; i<numGhosts;i++){
			ghosts[i].x = ghosts[i].homeX;
			ghosts[i].y = ghosts[i].homeY;
			ghosts[i].velX = ghosts[i].speed;
			ghosts[i].velY = 0;
			ghosts[i].state = Ghost.NORMAL;
		}
	     thisGame.setMode( thisGame.NORMAL);
    };

	var timer = function(currentTime) {
		var aux = currentTime - lastTime;
		lastTime = currentTime;
		return aux;
	};

	function init(){
		loadAssets();
	}
	
	function loadAssets(){
		
		eatpill = new Howl({
			src: ["res/sounds/eat-pill.mp3"],
			volume: 1,
			onload: function(){
				eating = new Howl({
					src: ["res/sounds/eating.mp3"],
					volume: 1,
					onload: function(){
						siren = new Howl({
							src: ["res/sounds/siren.mp3"],
							volume: 0.4,
							loop:true,
							onload: function(){
								waza = new Howl({
									src: ["res/sounds/waza.mp3"],
									volume: 1,
									loop:true,
									onload: function(){
										eatghost = new Howl({
											src: ["res/sounds/eat-ghost.mp3"],
											volume: 1,
											onload: function(){
												ghosteaten = new Howl({
													src: ["res/sounds/ghost-eaten.mp3"],
													volume: 1,
													onload: function(){
														die = new Howl({
															src: ["res/sounds/die.mp3"],
															volume: 1,
															onload: function(){
																siren.play();
																requestAnimationFrame(mainLoop)
															}	
														});
													}	
												});
											}	
										});
									}	
			
								});
							}	
			
						});
					}
			
				});
			}
			
			
		});
	}
	
    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	    lifesContainer = document.createElement('div');
        document.body.appendChild(lifesContainer);
		
		scoreContainer = document.createElement('div');
        document.body.appendChild(scoreContainer);
		
	addListeners();
	
	resources.load(["res/img/sprites.png"]);
	resources.onReady(init);
	reset();

    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
	thisGame: thisGame
    };
};


  var game = new GF();
  game.start();

