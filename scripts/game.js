var width = 480, height=480;

var whites;

var reds;

var cellSize = 60;

var selected;

var board = [];
var beats = new Set();

function draw()
{   

		
	if(beats.size > 0){
		beats.forEach(function (value){
			rectfill(canvas,(value.xAtt)*cellSize,(value.yAtt)*cellSize,cellSize,cellSize,makecol(255,125,125));
			rectfill(canvas,(value.x)*cellSize,(value.y)*cellSize,cellSize,cellSize,makecol(255,125,125));
			rectfill(canvas,(value.xAfter)*cellSize,(value.yAfter)*cellSize,cellSize,cellSize,makecol(255,125,125));
		});
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
}

function controls ()
{
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
		}else if(selected != undefined && Math.floor(mouse_x/cellSize) == selected.x + 1 && Math.floor(mouse_y/cellSize) == selected.y - 1 && board[selected.x+1][selected.y-1] == undefined){
			board[selected.x+1][selected.y-1] = 1;
			board[selected.x][selected.y] = undefined;
			selected = undefined;
		}
	}else if(mouse_pressed&1){
		beats.forEach(function(value){
			if(selected == undefined && Math.floor(mouse_x/cellSize) == value.xAtt && Math.floor(mouse_y/cellSize) == value.yAtt){
				selected = {
					x : value.xAtt,
					y : value.xAtt
				}
			}else if(selected != undefined && Math.floor(mouse_x/cellSize) == value.xAfter && Math.floor(mouse_y/cellSize) == value.yAfter){
				board[value.x][value.y] = undefined;
				board[value.xAtt][value.yAtt] = undefined;
				board[value.xAfter][value.yAfter] = 1;
				selected = undefined;
			}
		});
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
	board = [];
	for(var i = 0; i<8; i++){
		board[i] = [];
	}
	
	/*for(var i = 0; i<24; i = i+2){
		board[i%8 + Math.floor(i/8)%2][Math.floor(i/8)] = -1;
	}*/
	
	for(var i = 0; i<24; i=i+2){
		board[i%8 + Math.floor(i/8+1)%2][7-Math.floor(i/8)] = 1;
	}
	
	board[3][3] = -1;
	board[1][1] = -1;
	board[3][1] = -1;
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