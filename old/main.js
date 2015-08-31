// Array.prototype.random = function () {
//     return this[Math.floor(Math.random() * this.length)];
// }

var maze = function(){

	var space_size = 20;

	var cells, rows, cols, num_cells;

	var get_cell = function(coordinates){
		return $('#c_'+coordinates[0]+'_'+coordinates[1]);
	}

	var move_cell = function(coordinates, direction){
		switch(direction){
			case 0:
				coordinates[1]--;
				break;
			case 1:
				coordinates[0]++;
				break;
			case 2:
				coordinates[1]++;
				break;
			case 3:
				coordinates[0]--;
				break;
		}

		return coordinates;
	}

	// var create_grid = function(){

	// 	var height = $(window).height() * 0.9;
	// 	var width = $(window).width() * 0.9;

	// 	cols = Math.floor(width/space_size);
	// 	rows = Math.floor(height/space_size);

	// 	height = rows * space_size;
	// 	width = cols * space_size;

	// 	$('body').html('<div class="wrapper"></div>');
	// 	var wrapper = $('.wrapper');
		
	// 	wrapper.css({
	// 		'width': width - 1,
	// 		'height': height - 1
	// 	});

	// 	cells_html = '';

	// 	for(var i=0; i<rows; i++){
	// 		cells_html += '<div class="row" id="r_'+i+'">';
	// 		for(var j=0; j<cols; j++){
	// 			cells_html += '<div class="cell" id="c_'+j+'_'+i+'"></div>';
	// 		}
	// 		cells_html += '</div>';
	// 	}

	// 	wrapper.html(cells_html);

	// 	wrapper.find('.cell').css({
	// 		'width': space_size-1,
	// 		'height': space_size-1
	// 	});

	// 	// Remove margins/borders on bottom of bottommost cells
	// 	wrapper.find('.row').last().find('.cell').css({
	// 		'margin-bottom': 0,
	// 		'border-bottom': 0
	// 	});

	// 	// Remove margins/borders on right of rightmost cells
	// 	wrapper.find('.row').each(function(){
	// 		$(this).find('.cell').last().css({
	// 			'margin-right': 0,
	// 			'border-right': 0
	// 		});
	// 	});

	// }

	// create_grid();

	// var choose_start = function(){

	// 	// choose start side and derive end side
	// 	var start_side = [0,1,2,3].random();
	// 	var end_side = (start_side+2)%2;

	// 	// choose the position of the start cell along the start side
	// 	if(start_side===1 || start_side===3){ // start side is 1 or 3
	// 		var start_x = start_side===1 ? cols-1 : 0;
	// 		var start_y = Math.floor(Math.random() * rows);
	// 	}else{ // start side is 0 or 2
	// 		var start_y = start_side===2 ? rows-1 : 0;
	// 		var start_x = Math.floor(Math.random() * cols);
	// 	}

	// 	return [start_x, start_y];

	// }

	var choose_cell = function(){
		var x = Math.floor(Math.random() * cols);
		var y = Math.floor(Math.random() * rows);

		return cells[y][x];
	}

	var draw_maze = function(){

		var table = $('<table class="maze">');//.width(cols*(1+space_size)+2).height(rows*(1+space_size)+2);

		for(var i in cells){

			var row = $('<tr>');

			for(var j in cells[i]){

				var cell = cells[i][j];
				var classes = [];

				if(cell['border'][0]){
					classes.push('border_n');
				}

				if(cell['border'][1]){
					classes.push('border_e');
				}

				if(cell['border'][2]){
					classes.push('border_s');
				}

				if(cell['border'][3]){
					classes.push('border_w');
				}

				$('<td class="'+classes.join(' ')+'"></td>').width(space_size).height(space_size).appendTo(row);
			}

			table.append(row);
		}

		return table;

	}
	
	var get_neighbors= function(cell){

		var neighbors = [];

		var x = cell['x'];
		var y = cell['y'];

		// North
		if(!cell['border'][0]){
			neighbors.push(cells[y-1, x]);
			// console.log('North: '+cells[y-1, x]);
		}

		// East
		if(!cell['border'][1]){
			neighbors.push(cells[y, x+1]);
			// console.log('East: '+cells[y, x+1]);
		}

		// South
		if(!cell['border'][2]){
			neighbors.push(cells[y+1, x]);
			// console.log('South: '+cells[y+1, x]);
		}

		// West
		if(!cell['border'][3]){
			neighbors.push(cells[y, x-1]);
			// console.log('West: '+cells[y, x-1]);
		}

		return neighbors;

	}
	
	var create_maze = function(col, row){

		rows = row;
		cols = col;

		num_cells = rows * cols;

		// Create array of cells
		cells = [];

		for(var i=0; i<rows; i++){
			cells[i] = [];
			for(var j=0; j<cols; j++){
				cells[i][j] = {
					// N, E, S, W
					'x': j,
					'y': i,
					'backtrack': [0, 0, 0, 0],
					'solution': [0, 0, 0, 0],
					'border': [(i==0 ? 1:0), (j==cols-1 ? 1:0), (i==rows-1 ? 1:0), (j==0 ? 1:0)],
					'walls': [1, 1, 1, 1],
					'visited': 0
				}
			}
		}

		// console.log(JSON.stringify(cells)); // for testing


		// Choose a random cell to start in
		var start = choose_cell();

		// console.log(JSON.stringify(start));

		// console.log(JSON.stringify(get_neighbors(start)));
		

	}

	create_maze(10,6);

	$('div.wrapper').html(draw_maze());


};

$(function(){
	maze();
})