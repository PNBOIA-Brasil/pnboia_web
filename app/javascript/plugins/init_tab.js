import { initMapboxNew } from '../plugins/init_mapbox';


const initTab = () => {
    const smallButtons = document.querySelectorAll('#card-small')

    const bigCards = document.querySelectorAll('#card-big')
    const closeBtns = document.querySelectorAll('.close-btn')
  
    if (smallButtons) {
		smallButtons.forEach((smallButton) => {
            smallButton.addEventListener('click', (event) => {
                smallButtons.forEach((card) => {
                    card.classList.add('inactive-tab');
                });
                const marker = JSON.parse(smallButton.dataset.markers);
                let classBuoy = smallButton.classList[4];
                let bigCard = document.querySelector(`.${classBuoy}-01`)
                bigCard.classList.remove('inactive-tab');
                initMapboxNew(marker.buoy.longitude, marker.buoy.latitude, 8);
            });
        });
		closeBtns.forEach((closeBtn) => {
            closeBtn.addEventListener('click', (event) => {
                smallButtons.forEach((card) => {
                    card.classList.remove('inactive-tab');
                });
                bigCards.forEach((bigCard) => {
                    bigCard.classList.add('inactive-tab');
                });
                initMapboxNew();
            });
        });
    }
};

export { initTab };
