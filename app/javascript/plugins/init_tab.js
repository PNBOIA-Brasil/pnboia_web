import { initMapboxNew } from '../plugins/init_mapbox';
import { updateToken } from '../plugins/get_data';
import Swal from 'sweetalert2'

const initTabDownload = () => {
    const smallButtons = document.querySelectorAll('#card-small1')

    const updateButtonsDownload = (smallButton) => {
        const apiDoc = document.getElementById('api-doc')
        apiDoc.classList.add('inactive-tab');    
        smallButton.classList.add('active10');
        const dateDownload = document.getElementById('date-download');
        dateDownload.classList.remove('inactive-tab');
        const formatDownload = document.getElementById('download-format');
        formatDownload.classList.remove('inactive-tab');

        const first = JSON.parse(smallButton.dataset.first);
        const last = JSON.parse(smallButton.dataset.last);

        const startDate = document.getElementById('start_date');
        startDate.value = first.date_time.slice(0,10)

        const endDate = document.getElementById('end_date');
        endDate.value = last.date_time.slice(0,10)

        const buoyId = document.getElementById('buoy_download');
        buoyId.value = last.buoy_id
        const apiToken = document.getElementById('api_user_token');
        const textToken = document.getElementById('text-token');
        if (apiToken.value) {
            dateDownload.classList.remove('inactive-tab');
            formatDownload.classList.remove('inactive-tab');
            textToken.classList.add('inactive-tab')
            updateApiLink();
        } else {
            textToken.classList.remove('inactive-tab')
            dateDownload.classList.add('inactive-tab');
            formatDownload.classList.add('inactive-tab');
        }
    };

    if (smallButtons) {
		smallButtons.forEach((smallButton) => {
            if (smallButton.classList.contains('active10')){
                updateButtonsDownload(smallButton)
            } else {
                const apiToken = document.getElementById('api_user_token');
                const textToken = document.getElementById('text-token');
                if (apiToken.value) {
                    textToken.classList.add('inactive-tab')
                }
            }
            smallButton.addEventListener('click', (event) => {
                smallButtons.forEach((card) => {
                    card.classList.remove('active10');
                });
                updateButtonsDownload(smallButton)
            });
        });
    }
};

const upToken = () => {
    const smallButton = document.getElementById('generate-token')
  
    if (smallButton) {
        smallButton.addEventListener('click', (event) => {
            Swal.fire({
                title: 'Tem certeza?',
                text: "O token anterior será descartado!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim'
            }).then((result) => {
                if (result.isConfirmed) {
                    updateToken().then(response => response.json())
                    .then((user) => {        
                        const apiToken = document.getElementById('api_user_token');
                        apiToken.value = user.token;
                        updateApiLink(user.token);
                        const dateDownload = document.getElementById('date-download');
                        dateDownload.classList.remove('inactive-tab');
                        const formatDownload = document.getElementById('download-format');
                        formatDownload.classList.remove('inactive-tab');
                        const textToken = document.getElementById('text-token');
                        textToken.classList.add('inactive-tab')
                        formatDownload.classList.remove('inactive-tab');
                    });
                    Swal.fire(
                        'Novo Token gerado!',
                        'success'
                    )
                }
            });
        });
    }
};


const initTabApi = () => {
    const smallButton = document.getElementById('api-json')
  
    if (smallButton) {
        smallButton.addEventListener('click', (event) => {
            const apiDoc = document.getElementById('api-doc');
            apiDoc.classList.remove('inactive-tab');
            updateApiLink();
        });

    }
};

const newLink = () => {
    const startDate = document.getElementById('start_date');
    const endDate = document.getElementById('end_date');
    const smallButton = document.getElementById('api-json')
    if (smallButton) {
        smallButton.addEventListener('change', (event) => {
            updateApiLink();
        });
        startDate.addEventListener('change', (event) => {
            updateApiLink();
        });
        endDate.addEventListener('change', (event) => {
            updateApiLink();
        });
    }
};

const updateApiLink = (token=false) => {
    const buoyId = document.getElementById('buoy_download');
    const startDate = document.getElementById('start_date');
    const endDate = document.getElementById('end_date');
    const smallButton = document.getElementById('api-json')
    if (smallButton) {
        let apiToken
        if (token){
            apiToken = token;
        } else{
            apiToken = JSON.parse(smallButton.dataset.apitoken);
        }
        const apiUrl = smallButton.dataset.apiurl;
        const urlApi = document.getElementById('api_url');
        urlApi.value = `${apiUrl}/v1/qualified_data/qualified_data?buoy_id=${buoyId.value}&start_date=${startDate.value}&end_date=${endDate.value}&token=${apiToken}`
    }
};


const initTab = () => {
    const smallButtons = document.querySelectorAll('#card-small')
    const smallBtn = document.querySelector('#card-small')

    const bigCards = document.querySelectorAll('#card-big')
    const closeBtns = document.querySelectorAll('.close-btn')
  
    if (smallBtn) {
		smallButtons.forEach((smallButton) => {
            smallButton.addEventListener('click', (event) => {
                smallButtons.forEach((card) => {
                    card.classList.add('inactive-tab');
                });
                const marker = JSON.parse(smallButton.dataset.markers);
                let classBuoy = smallButton.classList[4];
                let bigCard = document.querySelector(`.${classBuoy}-01`)
                bigCard.classList.remove('inactive-tab');
                initMapboxNew(marker, 8);
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


const initTabGraph = () => {
    const btnGraphs = document.querySelectorAll('.btn-graphs')
    const showGraphs = document.querySelectorAll('.show-graphs')
    
    if (btnGraphs) {
		btnGraphs.forEach((btnGraph) => {
            btnGraph.addEventListener('click', (event) => {
                let btnId = btnGraph.id.slice(4);
                showGraphs.forEach((value) => {
                    value.classList.add('inactive-tab');
                });
                btnGraphs.forEach((value) => {
                    value.classList.remove('active');
                });
                btnGraph.classList.add('active');
                document.getElementById(`plot-${btnId}`).classList.remove('inactive-tab')
            });
        });
    }
};


const initTabBuoy = () => {
    const buoyTabs = document.querySelectorAll('.buoy-tabs')
    const buoyShows = document.querySelectorAll('.buoy-shows')
    
    if (buoyTabs) {
		buoyTabs.forEach((buoyTab) => {
            buoyTab.addEventListener('click', (event) => {
                buoyShows.forEach((value) => {
                    value.classList.add('inactive-tab');
                });
                let btnId = buoyTab.id.slice(3);
                document.getElementById(`show${btnId}`).classList.remove('inactive-tab')
                buoyTabs.forEach((value) => {
                    value.classList.remove('active');
                });
                buoyTab.classList.add('active');
            });
        });
    }
};

export { upToken, initTab, initTabGraph, initTabBuoy, initTabDownload, initTabApi, newLink };
