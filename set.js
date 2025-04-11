(function () {
    document.addEventListener('DOMContentLoaded', function () {

	const menuView = document.getElementById('start-btn');
	const gameView = document.getElementById('back-btn');

	const toggleView = () => {
	    document.getElementById('menu-view').classList.toggle('hidden');
	    document.getElementById('game-view').classList.toggle('hidden');
	    
	};

	menuView.addEventListener('click', toggleView);
	gameView.addEventListener('click', toggleView);

    })
})()
