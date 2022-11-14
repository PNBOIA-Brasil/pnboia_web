const initTab = () => {
    const fixedTab = document.getElementById('fixed-buoys')
    const driftTab = document.getElementById('drifters')

    const fixedButton = document.getElementById('fix-button')
    const driftButton = document.getElementById('drift-button')
  
    if (fixedTab) {
        fixedButton.addEventListener('click', (event) => {
            fixedTab.classList.remove('inactive-tab');
            driftTab.classList.add('inactive-tab');
            fixedButton.classList.add('active-button');
            driftButton.classList.remove('active-button');
        });
        driftButton.addEventListener('click', (event) => {
            driftTab.classList.remove('inactive-tab');
            fixedTab.classList.add('inactive-tab');
            driftButton.classList.add('active-button');
            fixedButton.classList.remove('active-button');
        });
    }
};

export { initTab };
