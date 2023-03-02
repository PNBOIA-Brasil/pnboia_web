const getDataStation = () => {
    const chartElement = document.getElementById('plotdata');
    const station = JSON.parse(chartElement.dataset.station);
    const token = chartElement.dataset.pnboiaApiKey;
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    const flag = document.getElementById('flag').value;
    let url
    if (flag === 'RETIRAR SOMENTE DADOS RUINS'){
        url = `http://localhost:8000/v1/qualified_data/qualified_data?order=true&flag=soft&buoy_id=${station.buoy_id}&start_date=${startDate}&end_date=${endDate}&token=${token}`
    } else if (flag === 'RETIRAR DADOS RUINS E SUSPEITOS'){
        url = `http://localhost:8000/v1/qualified_data/qualified_data?order=true&flag=all&buoy_id=${station.buoy_id}&start_date=${startDate}&end_date=${endDate}&token=${token}`
    } else {
        url = `http://localhost:8000/v1/qualified_data/qualified_data?order=true&buoy_id=${station.buoy_id}&start_date=${startDate}&end_date=${endDate}&token=${token}`
    }
    return fetch(url,{
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
    })
};

const updateToken = () => {  
    const chartElement = document.getElementById('apid');
    let url
    if (chartElement){
        const token = chartElement.dataset.pnboiaApiKey;
        const apiUrl = chartElement.dataset.apiurl;
        const user = chartElement.dataset.currentuser;
        url = `${apiUrl}/auth?update_token=true&token=${token}`
        return fetch(url,{
            method: 'PUT',
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
            body: JSON.stringify({email: user})
        })
    }
};


export { getDataStation, updateToken };