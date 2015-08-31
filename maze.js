var maze = function(width, height, canvas){

	// Initialize the structure

	var cell_size = 10;

	var structure = [];

	for(var i = 0; i < width; i++){
		structure[i] = [];
		for(var j = 0; j < height; j++){			
			structure[i][j] = [1, 1, 1, 1]; // top, right, bottom, left
		}
	}

	var draw_borders = function(i, j, walls, c){
		var start_x = i * cell_size;
		var start_y = j * cell_size;

		if(walls[0]){
			c.moveTo(start_x, start_y);
			c.lineTo(start_x + cell_size, start_y);
			c.stroke();
		}

		if(walls[1]){
			c.moveTo(start_x + cell_size, start_y);
			c.lineTo(start_x + cell_size, start_y + cell_size);
			c.stroke();
		}

		if(walls[2]){
			c.moveTo(start_x, start_y + cell_size);
			c.lineTo(start_x + cell_size, start_y + cell_size);
			c.stroke();
		}

		if(walls[3]){
			c.moveTo(start_x, start_y);
			c.lineTo(start_x, start_y + cell_size);
			c.stroke();
		}

	}

	var display_maze = function(){

		var c = canvas.getContext("2d");
		c.fillStyle = "#000";

		for(var i = 0; i < width; i++){
			for(var j = 0; j < height; j++){			
				draw_borders(i, j, structure[i][j], c);
			}
		}

	};

	var get_relation = function(a, b){

		// Returns [how to get from a to b, how to get from b to a], where 0=up, 1=right, 2=down, 3=left

		if(a[0]!==b[0] && a[1]!==b[1]){
			throw "Cells are not adjacent";
		}else if(a[0]===b[0] && a[1]===b[1]){
			throw "Cells are the same";
		}else if( Math.abs(a[0]-b[0])!==1 && Math.abs(a[0]-b[0])!==0 && Math.abs(a[1]-b[1])!==1 && Math.abs(a[1]-b[1])!==0 ){
			throw "Cells are not adjacent";
		}else if(a[0]===b[0]){
			return a[1]>b[1] ? [0, 2] : [2, 0];
		}else{
			return a[0]>b[0] ? [3, 1] : [1, 3];
		}

	}

	var get_neighbors = function(pos){

		var neighbors = [];

		if(pos[0]+1<width){
			neighbors.push( [pos[0]+1, pos[1]] );
		}

		if(pos[0]>0){
			neighbors.push( [pos[0]-1, pos[1]] );
		}

		if(pos[1]+1<height){
			neighbors.push( [pos[0], pos[1]+1] );
		}

		if(pos[1]>0){
			neighbors.push( [pos[0], pos[1]-1] );
		}

		return neighbors;

	}

	var get_unvisited_neighbors = function(pos){

		var neighbors = get_neighbors(pos);

		var unvisited_neighbors = [];

		for(var i in neighbors){
			if(array_sum(structure[ neighbors[i][0] ][ neighbors[i][1] ])===4){
				unvisited_neighbors.push( neighbors[i] );
			}
		}

		return unvisited_neighbors;

	}

	var array_sum = function(array){
		return array.reduce(function(a, b) {
			return a + b;
		});
	}

	// Generate the maze

	var pos = [
		Math.floor(Math.random() * width),
		Math.floor(Math.random() * height)
	];

	var visited = [pos];
	var total_cells = width * height;
	var visited_cells = 1;

	while(visited_cells<total_cells){
		
		var unvisited_neighbors = get_unvisited_neighbors(pos);

		if(unvisited_neighbors.length>0){
			var target = unvisited_neighbors[Math.floor(Math.random() * unvisited_neighbors.length)];

			var relation = get_relation(pos, target);

			structure[pos[0]][pos[1]][relation[0]] = 0; // remove wall from old cell
			structure[target[0]][target[1]][relation[1]] = 0; // remove wall from new cell

			visited.push(target);
			pos = target;
			visited_cells++;

		}else{
			pos = visited.pop();
		}

	}

	// console.log(structure);

	display_maze();

	console.log(get_relation([0,0], [0,1]));

}