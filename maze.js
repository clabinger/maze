var maze = function(width, height, canvas){

	// Initialize the structure

	var c = canvas.getContext("2d");
	c.lineWidth = 0.5;

	var cell_size = 30;
	
	width = Math.floor((window.innerWidth - 60) / cell_size);
	height = Math.floor((window.innerHeight - 60) / cell_size);

	canvas.width = width * (cell_size + 1);
	canvas.height = height * (cell_size + 1);

	var structure, 
		visit_index,
		pos,
		visited,
		total_cells,
		visited_cells,
		maze_start,
		maze_end,
		maze_start_temp,
		solve_count = 0;

	var initialize = function(){

		c.fillStyle = 'black';
		
		c.fillRect(0,0,canvas.width, canvas.height);

		structure = [];
		visit_index = [];
		pos = [];
		visited = [];
		total_cells = width * height;
		visited_cells = 1;

		for(var i = 0; i < width; i++){
			structure[i] = [];
			visit_index[i] = [];
			for(var j = 0; j < height; j++){			
				structure[i][j] = [1, 1, 1, 1]; // top, right, bottom, left
				visit_index[i][j] = 0;
			}
		}


		pos = [
			Math.floor(Math.random() * width),
			Math.floor(Math.random() * height)
		];

		visited = [pos];

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

		if(Math.floor(Math.random() * 2)===0){
			maze_start = [0, Math.floor(Math.random() * height)];
			maze_end = [width-1, Math.floor(Math.random() * height)];
		}else{
			maze_start = [Math.floor(Math.random() * width), 0];
			maze_end = [Math.floor(Math.random() * width), height-1];
		}

		if(Math.floor(Math.random() * 2)===0){
			maze_start_temp = maze_start;
			maze_start = maze_end;
			maze_end = maze_start_temp;
		}

		
		display_maze();

		pos = maze_start;
		visited = [pos];
		visit_index[pos[0]][pos[1]] = 1;

		solve_loop();

	}

	var compare_cells = function(a, b){
			return (a[0]===b[0] && a[1]===b[1]);
	}

	var draw_borders = function(cell, walls){
		
		var i = cell[0];
		var j = cell[1];

		var start_x = i * cell_size + .5;
		var start_y = j * cell_size + .5;

			if(walls[0]){
				c.beginPath();
				c.moveTo(start_x, start_y);
				c.strokeStyle = 'white';
				c.lineTo(start_x + cell_size, start_y);
				c.stroke();
			}

			if(walls[1]){
				c.beginPath();
				c.moveTo(start_x + cell_size, start_y);
				c.strokeStyle = 'white';
				c.lineTo(start_x + cell_size, start_y + cell_size);
				c.stroke();
			}

		// if(walls[2]){
		// 	c.moveTo(start_x, start_y + cell_size);
		// 	c.strokeStyle = 'blue';
		// 	c.lineTo(start_x + cell_size, start_y + cell_size);
		// 	c.stroke();
		// }

		// if(walls[3]){
		// 	c.moveTo(start_x, start_y);
		// 	c.strokeStyle = 'red';
		// 	c.lineTo(start_x, start_y + cell_size);
		// 	c.stroke();
		// }

	}

	var fill_cell = function(cell, color, to){
		
		var i = cell[0];
		var j = cell[1];

		var start_x = i * cell_size + 3;
		var start_y = j * cell_size + 3;

		var cell_width = cell_size - 5;
		var cell_height = cell_size - 5;

		if(to===0){
			start_y-= 5;
			cell_height+= 5;
		}

		if(to===1){
			cell_width+= 5;
		}

		if(to===2){
			cell_height+= 5;
		}

		if(to===3){
			start_x-= 5;
			cell_width+= 5;
		}

		c.fillStyle = color;

		c.fillRect(start_x, start_y, cell_width, cell_height);

	}

	var display_maze = function(){

			c.fillStyle = 'black';

			for(var i = 0; i < width; i++){
				for(var j = 0; j < height; j++){			
					draw_borders([i, j], structure[i][j]);
				}
			}

			c.beginPath();
			c.moveTo(0.5,0.5);
			c.lineTo(0.5, height*cell_size + 0.5);
			c.stroke();

			c.beginPath();
			c.moveTo(0.5, height*cell_size + 0.5);
			c.lineTo(width*cell_size + 0.5, height*cell_size + 0.5);
			c.stroke();

		

			fill_cell(maze_start, 'blue');
			fill_cell(maze_end, 'red');

		

	}

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

	var get_reachable_neighbors = function(pos){
	
		var neighbors = get_neighbors(pos);

		var reachable_neighbors = [];

		for(var i in neighbors){
			if(structure[ pos[0] ][ pos[1] ][get_relation(pos, neighbors[i])[0]]===0 && visit_index[neighbors[i][0]][neighbors[i][1]]===0){
				reachable_neighbors.push( neighbors[i] );
			}
		}

		return reachable_neighbors;
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

	var color_override = function(cell, color){
		if(compare_cells(cell, maze_start)){
			return 'blue';
		}else if(compare_cells(cell, maze_end)){
			return 'red';
		}else{
			return color;
		}
	}

	var solve_loop = function(){

		setTimeout(function(){

			if(!compare_cells(pos, maze_end)){

				var reachable_neighbors = get_reachable_neighbors(pos);

				if(reachable_neighbors.length>0){
					var target = reachable_neighbors[Math.floor(Math.random() * reachable_neighbors.length)];
				
					visit_index[target[0]][target[1]] = 1;

					visited.push(target);

					fill_cell(target, color_override(target, 'green'), get_relation(pos, target)[1]);
					
					pos = target;

				}else{

					var last = pos;
					
					visited.pop();
					
					pos = visited[visited.length - 1];

					fill_cell(last, color_override(last, 'brown'), get_relation(last, pos)[0]);

				}
			
				solve_loop();

			}else{
				solve_count++;
				
				document.title = 'Maze'+ '1'.repeat(solve_count);

				setTimeout(initialize, 3000);
			}

		}, 20);

	}
	
	initialize();

}
