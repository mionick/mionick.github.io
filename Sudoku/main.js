function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function freeOfDuplicateNonZeroValues(arr) {
	let set = new Set();
	for (let num of arr) {
		if (num !== 0) {
			if (set.has(num)) {
				return false;
			} else {
				set.add(num);
			}
		}
	}
	return true;
}

class Board {
	constructor() {
		this.rows = [[], [], [], [], [], [], [], [], []];
		this.columns = [[], [], [], [], [], [], [], [], []];
		this.sqs = [
			[[], [], []],
			[[], [], []],
			[[], [], []]
		];
		this.given = [];
		this.given.length = 81;
		this.given.fill(0, 0, 81);

		for (let r of this.rows) {
			r.length = 9;
			r.fill(0, 0, 9);
		}
		for (let c of this.columns) {
			c.length = 9;
			c.fill(0, 0, 9);
		}
		for (let sq3 of this.sqs) {
			for (let sq of sq3) {
				sq.length = 9;
				sq.fill(0, 0, 9);
			}
		}
	}

	clone() {
		let newBoard = new Board();

		newBoard.rows = _.cloneDeep(this.rows);
		newBoard.columns = _.cloneDeep(this.columns);
		newBoard.given = _.cloneDeep(this.given);
		newBoard.sqs = _.cloneDeep(this.sqs);

		return newBoard;
	}

	setGivenNumber(x, y, value) {
		this.given[x + y * 9] = value;
		this.set(x, y, value);
	}

	getGivenNumber(x, y) {
		return this.given[x + y * 9];
	}
	get(x, y) {
		if (x < 0 || y < 0 || x > 9 || y > 9) {
			throw new Error();
		}

		return this.rows[y][x];
	}
	set(x, y, value) {
		this.rows[y][x] = value;
		this.columns[x][y] = value;

		let sqx = Math.floor(x / 3);
		let sqy = Math.floor(y / 3);
		x = x % 3;
		y = y % 3;

		this.sqs[sqx][sqy][x + y * 3] = value;
	}

	validatePosition(x, y) {
		let row = this.rows[y];
		let col = this.columns[x];
		let sq = this.sqs[Math.floor(x / 3)][Math.floor(y / 3)];
		return (
			freeOfDuplicateNonZeroValues(row) &&
			freeOfDuplicateNonZeroValues(col) &&
			freeOfDuplicateNonZeroValues(sq)
		);
	}

	validate() {
		for (let row of this.rows) {
			let set = new Set();
			for (let num of row) {
				if (num !== 0) {
					if (set.has(num)) {
						return false;
					} else {
						set.add(num);
					}
				}
			}
		}
		for (let col of this.columns) {
			let set = new Set();
			for (let num of col) {
				if (num !== 0) {
					if (set.has(num)) {
						return false;
					} else {
						set.add(num);
					}
				}
			}
		}
		for (let sq3 of this.sqs) {
			for (let sq of sq3) {
				let set = new Set();
				for (let num of sq) {
					if (num !== 0) {
						if (set.has(num)) {
							return false;
						} else {
							set.add(num);
						}
					}
				}
			}
		}
		return true;
	}
}

function Solve(board, solvedSoFar = 0, callback) {
	// either we are done or it's not solvable.
	if (solvedSoFar === 81) {
		return board.validate();
	}
	let x = solvedSoFar % 9;
	let y = Math.floor(solvedSoFar / 9);

	// do not modify the given values, trust them blindly.
	if (board.getGivenNumber(x, y) !== 0) {
		return Solve(board, solvedSoFar + 1, callback);
	}

	for (let num = 1; num < 10; num++) {
		board.set(x, y, num);

		// Can use this to log the state of the board at each step.
		if (callback) {
			callback([x, y, num]);
		}

		if (board.validatePosition(x, y)) {
			const done = Solve(board, solvedSoFar + 1, callback);
			if (done) {
				return true;
			}
		} else {
			board.set(x, y, 0);
		}
		if (callback && num >= 9) {
			callback([x, y, 0]);
		}
	}
	board.set(x, y, 0);

	return false;
}

let board = new Board();

let WIDTH = 500;
let HEIGHT = 500;
let side = WIDTH / 9;

let boardDisplay;
let inputEls = [];


let sampleStartValues = [
	9,
	2,
	6,
	4,
	3,
	5,
	8,
	0,
	1,
	8,
	0,
	0,
	0,
	0,
	6,
	0,
	0,
	0,
	4,
	0,
	0,
	0,
	0,
	1,
	2,
	5,
	0,
	5,
	6,
	0,
	1,
	0,
	0,
	0,
	0,
	7,
	0,
	0,
	0,
	8,
	6,
	7,
	0,
	0,
	5,
	1,
	9,
	0,
	0,
	2,
	0,
	0,
	0,
	0,
	0,
	0,
	5,
	7,
	0,
	0,
	0,
	3,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	9,
	0,
	2,
	0,
	0,
	0,
	0,
	0,
	7,
	0,
	0
];
let emptyArray = Array(81);
emptyArray.fill(0, 0, 81);

// EASEL JS

function drawBoard(board, graphics, inputEls) {
	graphics.s("#000");
	for (let i = 0; i < 10; i++) {
		if (i % 3 === 0) {
			graphics.setStrokeStyle(3);
		} else {
			graphics.setStrokeStyle(1);
		}
		graphics.mt(0, side * i);
		graphics.lt(WIDTH, side * i);
		graphics.mt(side * i, 0);
		graphics.lt(side * i, WIDTH);
	}

	for (let j = 0; j < 9; j++) {
		for (let i = 0; i < 9; i++) {
			let value = board.get(i, j);
			inputEls[i + j * 9].value = value || "";
		}
	}
}

function fillWith(board, filler) {
	for (let i = 0; i < filler.length; i++) {
		board.setGivenNumber(i % 9, Math.floor(i / 9), filler[i]);
		if (filler[i]) {
			inputEls[i].style.color = "green";
			inputEls[i].style.background = "none";
		} else {
			inputEls[i].style.background = "none";
			inputEls[i].style.color = "black";
		}
	}
}

async function clearClick() {
	fillWith(board, board.given);
	drawBoard(board, boardDisplay.graphics, inputEls);
}

async function clearAllClick() {
	fillWith(board, emptyArray);
	drawBoard(board, boardDisplay.graphics, inputEls);
}

function disableInput() {
	inputEls.forEach(x => x.disabled = true);
}


function enableInput() {
	inputEls.forEach(x => x.disabled = false);
}

async function solveClick() {
	let moves = [];
	let unsolvedBoard = board.clone();
	Solve(board, 0, move => {
		moves.push(move);
	});

	//let delay = Math.floor(200.0 / moves.length);
	console.log(`Solved in ${moves.length} moves.`);
	//console.log(`Playing with ${delay} ms between moves.`);

	disableInput();
	let delay = 1000; //start with 1 second between moves.

	// now we have a list of moves. Just loop and draw
	for (let i = 0; i < moves.length; i++) {
		//let startedDrawing = performance.now();
		unsolvedBoard.set(moves[i][0], moves[i][1], moves[i][2]);
		if (moves[i][2] !== 0 && unsolvedBoard.validatePosition(moves[i][0], moves[i][1])) {
			inputEls[moves[i][0] + moves[i][1] * 9].style.background = "rgba(0, 255, 0, 0.5)";
		} else {
			inputEls[moves[i][0] + moves[i][1] * 9].style.background = "rgba(255, 0, 0, 0.5)";
		}
		drawBoard(unsolvedBoard, boardDisplay.graphics, inputEls);
		// Sleep for delay minus amount of time it took to draw.
		delay *= 0.9;
		await sleep(delay);//- (performance.now() - startedDrawing));
	}

	drawBoard(unsolvedBoard, boardDisplay.graphics, inputEls);
	enableInput();

}


async function init() {
	let stage = new createjs.Stage("sudCanvas");
	//stage.canvas.style.position = "absolute";
	let boardEl = document.getElementById("board");
	boardEl.style.position = "absolute";
	boardEl.style.top = "0";
	boardEl.style.left = "0";
	boardEl.style.zindex = "100";
	let inputDisplayEls = [];

	for (let j = 0; j < 9; j++) {
		for (let i = 0; i < 9; i++) {
			let inp = document.createElement("input");
			boardEl.appendChild(inp);
			inputEls.push(inp);
			inp.style.position = 'relative';
			inp.style.width = side + "px";
			inp.style.height = side + "px";
			inp.style.background = "rgba(0,0,0,0)";
			inp.style.border = "0";
			inp.style.padding = "0";
			inp.style.textAlign = "center";
			inp.style.fontSize = side - 10 + "px";
			inp.onkeyup = e => {
				if (parseInt(inp.value)) {
					board.setGivenNumber(i, j, parseInt(inp.value));
					inp.style.color = "green";
				} else {
					board.setGivenNumber(i, j, 0);
					inp.style.color = "black";
				}
			};

			let dispEl = new createjs.DOMElement(inp);
			dispEl.x = i * side;
			dispEl.y = j * side;
			dispEl.width = side;
			dispEl.height = side;
			inputDisplayEls.push(dispEl);
			stage.addChild(dispEl);
		}
	}

	fillWith(board, sampleStartValues);

	boardDisplay = new createjs.Shape();
	stage.addChild(boardDisplay);

	drawBoard(board, boardDisplay.graphics, inputEls);
	stage.update();

	solveClick();

}