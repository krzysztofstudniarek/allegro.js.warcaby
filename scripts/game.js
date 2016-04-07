var width = 480, height=480;

var whites;

var reds;

var cellSize = 60;

var selected;

var board = [];
var beats = new Set();

var moveFinished = false;
var beatMade = false;

function draw()
{   
	if(beats.size > 0){
		if(selected == undefined){
			beats.forEach(function (value){
				rectfill(canvas,(value.xAtt)*cellSize,(value.yAtt)*cellSize,cellSize,cellSize,makecol(255,125,125));
				rectfill(canvas,(value.x)*cellSize,(value.y)*cellSize,cellSize,cellSize,makecol(255,125,125));
				rectfill(canvas,(value.xAfter)*cellSize,(value.yAfter)*cellSize,cellSize,cellSize,makecol(255,125,125));
			});
		}else{
			beats.forEach(function (value){
				if(value.xAtt == selected.x && value.yAtt == selected.y){
					rectfill(canvas,(value.xAtt)*cellSize,(value.yAtt)*cellSize,cellSize,cellSize,makecol(255,125,125));
					rectfill(canvas,(value.x)*cellSize,(value.y)*cellSize,cellSize,cellSize,makecol(255,125,125));
					rectfill(canvas,(value.xAfter)*cellSize,(value.yAfter)*cellSize,cellSize,cellSize,makecol(255,125,125));
				}
			});
		}
		
	}else{
		if(selected != undefined){
			circlefill(canvas,selected.x*cellSize + cellSize/2,selected.y*cellSize + cellSize/2,20,makecol(0,255,0));
			if(selected.x<7 && selected.y >0 && board[selected.x+1][selected.y-1] == undefined){
				rectfill(canvas,(selected.x+1)*cellSize,(selected.y-1)*cellSize,cellSize,cellSize,makecol(125,125,255));
			}
			if(selected.x>0 && selected.y >0 && board[selected.x-1][selected.y-1] == undefined){
				rectfill(canvas,(selected.x-1)*cellSize,(selected.y-1)*cellSize,cellSize,cellSize,makecol(125,125,255));
			}
		}
	}

	for(var i = 0; i<8; i++){
		for(var j = 0; j<8; j++){
			if((j+i)%2 == 0){
				rect(canvas,i*cellSize,j*cellSize,cellSize,cellSize,makecol(0,0,0));
			}else{
				rectfill(canvas,i*cellSize,j*cellSize,cellSize,cellSize,makecol(0,0,0));
				rect(canvas,i*cellSize,j*cellSize,cellSize,cellSize,makecol(0,0,0));
			}
			
			if(board[i][j] == 1){
				circlefill(canvas,i*cellSize + cellSize/2,j*cellSize + cellSize/2,20,makecol(255,255,255));
				circle(canvas,i*cellSize + cellSize/2,j*cellSize + cellSize/2,20,makecol(0,0,0));
			}else if(board[i][j] == -1){
				circlefill(canvas,i*cellSize + cellSize/2,j*cellSize + cellSize/2,20,makecol(255,0,0));
				circle(canvas,i*cellSize + cellSize/2,j*cellSize + cellSize/2,20,makecol(0,0,0));				
			}
		}
	}
	
	if(moveFinished){
		rectfill(canvas, 0,0,width,height, makecol(255,255,255,127));
		textout_centre(canvas,font,"OPPONENT MOVE",width/2,height/2,50,makecol(0,0,0))
	}

}

function update()
{	
	beats = new Set();
	for(var i = 0; i<8; i++){
		for(var j = 0; j<8; j++){
			if(board[i][j] == 1){
				find_beat(i,j);
			}
		}
	}
	
	if(beatMade){
		moveFinished = true;
		beats.forEach(function(value){
			if(value.xAtt == selected.x && value.yAtt == selected.y){
				moveFinished = false;
				beatMade = false;
			}
		});
		
		if(moveFinished){
			selected = undefined;
			beatMade = false;
		}
	}
}

function controls ()
{
	if(!moveFinished){
		if(mouse_pressed&1 && beats.size == 0){
			if(board[Math.floor(mouse_x/cellSize)][Math.floor(mouse_y/cellSize)] == 1){
				selected = {
					x: Math.floor(mouse_x/cellSize), 
					y: Math.floor(mouse_y/cellSize)
					};
			}else if(selected != undefined && Math.floor(mouse_x/cellSize) == selected.x -1 && Math.floor(mouse_y/cellSize) == selected.y - 1 && board[selected.x-1][selected.y-1] == undefined){
				board[selected.x-1][selected.y-1] = 1;
				board[selected.x][selected.y] = undefined;
				selected = undefined;
				moveFinished = true;
			}else if(selected != undefined && Math.floor(mouse_x/cellSize) == selected.x + 1 && Math.floor(mouse_y/cellSize) == selected.y - 1 && board[selected.x+1][selected.y-1] == undefined){
				board[selected.x+1][selected.y-1] = 1;
				board[selected.x][selected.y] = undefined;
				selected = undefined;
				moveFinished = true;
			}
		}else if(mouse_pressed&1){
			beats.forEach(function(value){
				if(Math.floor(mouse_x/cellSize) == value.xAtt && Math.floor(mouse_y/cellSize) == value.yAtt){
					selected = {
						x : value.xAtt,
						y : value.yAtt
					}
				}else if(selected != undefined && Math.floor(mouse_x/cellSize) == value.xAfter && Math.floor(mouse_y/cellSize) == value.yAfter && value.xAtt == selected.x && value.yAtt == selected.y){
					board[value.x][value.y] = undefined;
					board[value.xAtt][value.yAtt] = undefined;
					board[value.xAfter][value.yAfter] = 1;
					selected = {
						x : value.xAfter,
						y : value.yAfter
					};
					beatMade = true;
				}
			});
		}				
	}
	//change to the other
	if(pressed[KEY_A]){
		moveFinished = false;
	}
}

function events()
{

}

function dispose ()
{

}

function main()
{
    enable_debug('debug');
    allegro_init_all("game_canvas", width, height);
	load_elements();
	ready(function(){
        loop(function(){
            clear_to_color(canvas,makecol(255,255,255));
			dispose();
			controls();
            update();
			events();
            draw();
        },BPS_TO_TIMER(60));
    });
    return 0;
}
END_OF_MAIN();

function load_elements()
{
	font = load_font("./antilles.ttf");
	
	board = [];
	for(var i = 0; i<8; i++){
		board[i] = [];
	}
	
	for(var i = 0; i<24; i = i+2){
		board[i%8 + Math.floor(i/8)%2][Math.floor(i/8)] = -1;
	}
	
	for(var i = 0; i<24; i=i+2){
		board[i%8 + Math.floor(i/8+1)%2][7-Math.floor(i/8)] = 1;
	}
	
	//board[4][4] = -1;
	//board[4][4] = -1;
	//board[4][2] = -1;
	//board[6][2] = -1;
	
	//board[2][4] = -1;
}

function find_beat(x,y){
	if(x<6 && y >0 && board[x+1][y-1] == -1 && board[x+2][y-2] == undefined){
		beats.add({
			xAtt : x,
			yAtt : y,
			x : x+1,
			y : y-1,
			xAfter : x+2,
			yAfter : y-2
		});
	}
	
	if(x>0 && y > 0 && board[x-1][y-1] == -1 && board[x-2][y-2] == undefined){
		beats.add({
			xAtt : x,
			yAtt : y,
			x : x-1,
			y : y-1,
			xAfter : x-2,
			yAfter : y-2
		});
	}
	
	if(x<6 && y <6 && board[x+1][y+1] == -1 && board[x+2][y+2] == undefined){
		beats.add({
			xAtt : x,
			yAtt : y,
			x : x+1,
			y : y+1,
			xAfter : x+2,
			yAfter : y+2
		});
	}
	
	if(x>0 && y < 6 && board[x-1][y+1] == -1 && board[x-2][y+2] == undefined){
		beats.add({
			xAtt : x,
			yAtt : y,
			x : x-1,
			y : y+1,
			xAfter : x-2,
			yAfter : y+2
		});
	}
}