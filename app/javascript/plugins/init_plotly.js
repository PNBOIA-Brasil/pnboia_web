import Plotly from 'plotly.js-dist';
import { getDataStation } from '../plugins/get_data';

const updatePlotly = () => {
	const searchBtn = document.querySelector('.orange-button-search')
	
	if (searchBtn) {
		searchBtn.addEventListener('click', (event) => {
			const loader = document.getElementById('loader');
			loader.classList.remove('inactive-tab');
	
			const btnGraphs = document.querySelectorAll('.btn-graphs')
			const showGraphs = document.querySelectorAll('.show-graphs')
			showGraphs.forEach((value) => {
				value.classList.remove('inactive-tab');
			});
			btnGraphs.forEach((value) => {
				value.classList.remove('active');
			});
			btnGraphs[0].classList.add('active');	
			initPlotly();

		});
	};
}

const initPlotly = () => {
	const chartElement = document.getElementById('plotdata');
	if (chartElement) {
		const loader = document.getElementById('loader');
		loader.classList.remove('inactive-tab');
		const flag = JSON.parse(chartElement.dataset.station);
		getDataStation(flag).then(response => response.json())
		.then((dataApi) => {
			const station = JSON.parse(chartElement.dataset.station);
			const waves = JSON.parse(chartElement.dataset.waves);
			const meteorologys = JSON.parse(chartElement.dataset.meteorologys);
			const oceanographys = JSON.parse(chartElement.dataset.oceanographys);
			let dataAll = {};
			dataApi.forEach(o => {
				Object.keys(o).forEach(k => {
					dataAll[k] ||= [];
					dataAll[k].push(o[k]);
				});
			});
			for (const key in waves){
				plotData(dataAll, key, waves[key], station.name);
				if (waves[key][0].slice(0, 4) === "DIR."){
					plotDataDir(dataAll, key, waves[key], station.name);
				}
			}
			for (const key in meteorologys){
				plotData(dataAll, key, meteorologys[key], station.name);
				if (meteorologys[key][0].slice(0, 4) === "DIR."){
					plotDataDir(dataAll, key, meteorologys[key], station.name);
				}
			}
			for (const key in oceanographys){
				plotData(dataAll, key, oceanographys[key], station.name);
				if (oceanographys[key][0].slice(0, 4) === "DIR."){
					plotDataDir(dataAll, key, oceanographys[key], station.name);
				}
			}
		
			loader.classList.add('inactive-tab');	
		});
	}
};

const plotData = (dataApi, variable, variables_data, dataType) => {
	const chartElement = document.getElementById('plotdata');

	let y
	let title
	let yLegend
	let tickFormat
	y = dataApi[variable]
	title = variables_data[0]
	yLegend = variables_data[1]
	tickFormat = '%d/%m %Hh'

	let values
	if (y.every(element => element === null)) {
		let ok
	} else {
		values = {
			x: dataApi.date_time,
			y: y,
			mode: 'lines+markers',
			name: dataType,
			line: {
				color: '#D49511',
				width: 2
			}
		};

		const data = [values];
		var layout = {
			autosize: true,
			title: {
				text: title,
				font: {
					family: 'Work Sans, sans-serif',
					size: 20
				},
			},
			plot_bgcolor:"rgba(0,0,0,0)",
			paper_bgcolor:"rgba(0,0,0,0)",
			xaxis: {
				showgrid: true,
				zeroline: false,
				tickformat: tickFormat,
				gridcolor: 'rgba(0,0,0,0.2)'
			},
			yaxis: {
				title: yLegend,
				showgrid: true,
				showline: true,
				gridcolor: 'rgba(0,0,0,0.2)'
			},
			showlegend: false,
			height: 300,
		};
		var config = {responsive: true, displayModeBar: false }
		let plotName = `${variable}-plot`
		Plotly.newPlot(plotName, data, layout, config);
	}
};


const plotDataDir = (dataApi, variable, variables_data, dataType) => {
	const chartElement = document.getElementById('plotdata');

	let y
	let title
	let yLegend
	
	y = dataApi[variable]
	title = variables_data[0]
	yLegend = variables_data[1]
	
	let values
	if (y.every(element => element === null)) {
		let ok
	} else {
		values = {
			theta: y,
			name: title,
			line: {
				color: '#D49511',
				width: 10
			},
			type: 'barpolar'
		};

		const data = [values];

		var layout = {
			title: {
				text: title,
				font: {
					family: 'Work Sans, sans-serif',
					size: 18
				},
			},
			plot_bgcolor:"rgba(0,0,0,0)",
			paper_bgcolor:"rgba(0,0,0,0)",
			polar: {
				radialaxis: {
					visible: false
				},
				angularaxis: {
					tickfont: {
						size: 8
					},
					rotation: 90,
					direction: "clockwise"
				}
			}
		};

		var config = {responsive: true, displayModeBar: false }
		let plotName = `${variable}g-plot`
		Plotly.newPlot(plotName, data, layout, config);
	}

};

export { initPlotly, updatePlotly };
