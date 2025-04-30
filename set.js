// TODO:
//	make it so that when a set is made the cards 
//	swap the images to the set img 
//
//	get rid of the shuffle when set is made 

(function () {

    let cards;
    let timeOption;
    let setCount;
    let points;
    let timerID ;
    let gameBoard;
    let remainingSeconds = 0;  
    let isEasy = true;
    let gameView;

    document.addEventListener('DOMContentLoaded', function () {
	points = 0;
	timerID =document.getElementById('time'); 
	gameBoard = document.getElementById('board');
	timeOption = document.querySelector('select')
	setCount = document.getElementById('set-count');
	const menuView = document.getElementById('start-btn');
	 gameView = document.getElementById('back-btn');
	const refreshButton = document.getElementById('refresh-btn');
	const diffButton = document.querySelectorAll('input[name="diff"]');

	menuView.addEventListener('click', toggleView);
	refreshButton.addEventListener('click', genBoard);
	    
	diffButton.forEach((r) => {
	    r.addEventListener('change', (e) => {
		const value = e.target.value;
		console.log(value);
		if (value != 'easy') {
		    isEasy = false;
		} else {
		    isEasy = true;
		}
	    });
	});

    })

    function gameLoop() {
	const gameMode = document.getElementById('game-view');
	if (gameMode.className != 'hidden') {
		genBoard();
		startTimer();
		console.log('gameLoop started');
	    }
    }

    // Toggles menu and game board
    const toggleView = () => {
	const docView = document.getElementById('menu-view');
	const gameMode = document.getElementById('game-view');
	if (gameMode.className === 'hidden') {
	    docView.classList.toggle('hidden');
	    gameMode.classList.toggle('hidden');
	    gameLoop();
	} else {
	    docView.classList.toggle('hidden');
	    gameMode.classList.toggle('hidden');
	}
    };

    function genBoard () {
	const board = document.getElementById('board');

	board.replaceChildren();

	for(let i=0; i <= 11; i++) {
	    board.appendChild(generateUniqueCard(isEasy));
	}
	cards = document.querySelectorAll('.card');
	cards.forEach((e) => {
	    e.addEventListener('click', cardSelected);
	});
    }

    // returns an array of attributes, takes a bool arg
   function generateRandomAttribts (isEasy) { 
	let attrbs = [];
	const colors = ['red', 'purple', 'green'];
	let fill = ['solid', 'outline', 'striped'];
	const shape = ['oval', 'diamond', 'squiggle'];

	if (isEasy) {
	    attrbs.push(colors[randNum()], fill[0], shape[randNum()]);
	} else {
	    attrbs.push(colors[randNum()], fill[randNum()], shape[randNum()]);
	}

	return attrbs
    }

    function generateUniqueCard (isEasy) {
	let attributes = generateRandomAttribts().join('-');
	if (isEasy) {
	     attributes = generateRandomAttribts(isEasy).join('-');
	}
	const count = randNum() + 1;
	let alt =  `${attributes}-${count}`;

	//runs loop until unique attributes
	while (isDupes(alt)) {
	    if (isEasy) {
		attributes = generateRandomAttribts(isEasy).join('-');
	    } else {
		attributes = generateRandomAttribts().join('-');
	    }
	    alt = `${attributes}-${count}`;
	}
	const element = returnNumIMGS(count, attributes);
	return element;
    }
    //TODO: get option when dom is loaded
    function startTimer () {
	remainingSeconds = parseInt(timeOption.value);
	advanceTimer(remainingSeconds);
    }

    function advanceTimer (time) {
	if (time === 0) {
	    setTimeDisplay(0);
	    timesUp();
	} else {
	    setTimeDisplay(time)
	    setTimeout(() => {advanceTimer(time - 1)}, 1000);
	}

    }

    function timesUp() {
	gameView.addEventListener('click', toggleView);
	cards.forEach((e) => {e.classList.remove('selected');})
	cards.forEach((e) => {e.removeEventListener('click', cardSelected)});
	timerID.textContent = '00:00';
    }

    function isASet(selected) {
	  let attributes = [];
	  for (let i = 0; i < selected.length; i++) {
	    attributes.push(selected[i].id.split("-"));
	  }
	  for (let i = 0; i < attributes[0].length; i++) {
	    let allSame = attributes[0][i] === attributes[1][i] &&
			  attributes[1][i] === attributes[2][i];
	    let allDiff = attributes[0][i] !== attributes[1][i] &&
			  attributes[1][i] !== attributes[2][i] &&
			  attributes[0][i] !== attributes[2][i];
	    if (!(allDiff || allSame)) {
	      return false;
	    }
	  }
	  return true;
    }
    //checks the number of selected cards and checks for a set
    function cardSelected (e) {
	e.currentTarget.classList.toggle('selected');

	let selectedCards = document.querySelectorAll('.card.selected');
	console.log(selectedCards.length);

	if (selectedCards.length >=3) {
	    if (isASet(selectedCards)) {
		// add point to set counter
		points += 1;
		setCount.textContent = `${points}`
		console.log('set made');
		showSet();
		selectedCards.forEach((card) => {card.classList.remove('selected')});
	    } else {
		selectedCards.forEach((card) => {card.classList.remove('selected')});
	    }
	}
    }

//|||||||||||||||| UTIL FUNCTIONS ||||||||||||||||||
    // returns 0-3
    function randNum() {
	return Math.floor(Math.random() * 3)  
    }

    function showSet () {
	const selected = document.querySelectorAll('.card.selected');
	console.log(selected);
	selected.forEach((e) => {
	    const setCard = document.createElement('p');
	    setCard.textContent = 'set!';
	    e.classList.toggle('hide-imgs')

	    e.appendChild(setCard);
	    setTimeout(() => {
		e.removeChild(setCard);
		e.classList.toggle('hide-imgs');
	    },1000);
	    e.removeEventListener('click', cardSelected);
	});
    }

    function setTimeDisplay(time) {
	let timerID = document.getElementById('time');
	let minuets = Math.floor(time / 60);
	let seconds = (time % 60);

	let secString = seconds.toString().padStart(2, 0);
	let minString = minuets.toString().padStart(2, 0);
	console.log(minString);
	timerID.textContent = `${minString}:${secString}`;
    }

    function returnNumIMGS(num, attr) {
	const path = `img/${attr}.png`;
	const desc = `${attr}-${num}`;
	const card = document.createElement('div');
	card.className = 'card';
	card.id = desc;
	for(let i = 1; i <= num; i++) {
	    const img = document.createElement('img');
	    img.src = path; 
	    img.alt = desc;
	    card.appendChild(img);
	}
	return card;
    }

    //returns true if there is a duplicate and false otherwise
    function isDupes (attributes) {
	const cards = document.getElementById(`${attributes}`);

	if (cards) {
	    return true;
	}

	return false;
    }


})()
