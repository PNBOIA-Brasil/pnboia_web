import Plotly from 'plotly.js-dist';

const initPlotly = () => {

  const chartElement = document.getElementById('plotdata');

  if (chartElement) { // only build a map if there's a div#map to inject into

    const almirantadointData = JSON.parse(chartElement.dataset.almirantadoint);
    const almirantadoextData = JSON.parse(chartElement.dataset.almirantadoext);
    const inpeData = JSON.parse(chartElement.dataset.inpe);
    const language = chartElement.dataset.language;
    const inpeName = 'POTTER'
    const oldCode = true;

    plotWspd(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWdir(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWdirg(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotSwvht(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWvdirg(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWvdir(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotTp(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotSst(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
  }
};

const initPlotlyNew = () => {

  const chartElement = document.getElementById('plotdata-new');

  if (chartElement) { // only build a map if there's a div#map to inject into

    const almirantadointData = JSON.parse(chartElement.dataset.almirantadoint);
    const almirantadoextData = JSON.parse(chartElement.dataset.almirantadoext);
    const inpeData = JSON.parse(chartElement.dataset.inpe);
    const language = chartElement.dataset.language;
    const inpeName = 'CRIOSFERA';
    const oldCode = false;

    plotWspd(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWdir(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWdirg(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotSwvht(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWvdirg(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotWvdir(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotTp(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotSst(almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode);
    plotAtmp(almirantadoextData, language, inpeName, oldCode);
    plotPres(almirantadoextData, language, inpeName, oldCode);
    plotSss(almirantadoextData, language, inpeName, oldCode);
  }
};

const plotWvdir = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointWvdir = {
      x: almirantadointData.date_time,
      y: almirantadointData.wvdir,
      mode: 'lines+markers',
      name: 'KELLER',
      line: {
        color: '#c22d45',
        width: 2
      }
    };
    
    if (oldCode){
      const almirantadoextWvdir = {
        x: almirantadoextData.date_time,
        y: almirantadoextData.wvdir,
        mode: 'lines+markers',
        name: inpeName,
        line: {
          color: '#2f42ad',
          width: 2
        }
      };
    }

    const inpeWvdir = {
      x: inpeData.date_time,
      y: inpeData.wvdir,
      mode: 'lines+markers',
      name: 'PINGUIM',
      line: {
        color: '#486641',
        width: 2,
      }
    };

    let data
    if (oldCode){
      data = [almirantadointWvdir, almirantadoextWvdir, inpeWvdir];
    } else{
      data = [almirantadointWvdir, inpeWvdir];
    }


    let text = 'DIR. ONDAS'
    let title = 'Dir. ondas (°)'
    if (language === 'english') {
      text = "WAVE DIR."
      title = 'Wave Dir. (°)'
    }

    var layout = {
      title: {
        text: text,
        font: {
          family: 'Fira Sans, sans-serif',
          size: 24
        },
      },
      plot_bgcolor:"rgba(0,0,0,0)",
      paper_bgcolor:"rgba(0,0,0,0)",
      xaxis: {
        // title: 'Tempo',
        showgrid: true,
        zeroline: false,
        tickformat: '%d/%m %Hh',
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      yaxis: {
        title: title,
        showgrid: true,
        showline: true,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      showlegend: true,
      legend:{"orientation": "h",
        x: 0,
        y: -0.2,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 10,
          color: '#000'
        }
      }
    };

    var config = {responsive: true, displayModeBar: false }

    Plotly.newPlot('wvdir-plot', data, layout, config);


};

const plotWdir = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointWdir = {
      x: almirantadointData.date_time,
      y: almirantadointData.wdir,
      mode: 'lines+markers',
      name: 'KELLER',
      line: {
        color: '#c22d45',
        width: 2
      }
    };


    const almirantadoextWdir = {
      x: almirantadoextData.date_time,
      y: almirantadoextData.wdir,
      mode: 'lines+markers',
      name: inpeName,
      line: {
        color: '#2f42ad',
        width: 2
      }
    };

    const inpeWdir = {
      x: inpeData.date_time,
      y: inpeData.wdir,
      mode: 'lines+markers',
      name: 'PINGUIM',
      line: {
        color: '#486641',
        width: 2
      }
    };

    const data = [almirantadointWdir, almirantadoextWdir, inpeWdir];

    let text = 'DIR. VENTO'
    let title = 'Direção do Vento (°)'
    if (language === 'english') {
      text = "WIND DIR."
      title = 'Wind Direction (°)'
    }


    var layout = {
      title: {
        text: text,
        font: {
          family: 'Fira Sans, sans-serif',
          size: 24
        },
      },
      plot_bgcolor:"rgba(0,0,0,0)",
      paper_bgcolor:"rgba(0,0,0,0)",
      xaxis: {
        // title: 'Tempo',
        showgrid: true,
        tickformat: '%d/%m %Hh',
        zeroline: false,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      yaxis: {
        title: title,
        showgrid: true,
        showline: true,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      showlegend: true,
      legend:{"orientation": "h",
        x: 0,
        y: -0.2,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 10,
          color: '#000'
        }
      }
    };
    var config = {responsive: true, displayModeBar: false }

    Plotly.newPlot('wdir-plot', data, layout, config);
};

const plotWdirg = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointWdir = {
      theta: almirantadointData.wdirg,
      name: 'almirantado_int',
      line: {
        color: '#c22d45',
        width: 2
      },
      type: 'barpolar'
    };

    const data1 = [almirantadointWdir];

    var layout1 = {
      title: {
        text: 'KELLER',
        font: {
          family: 'Fira Sans, sans-serif',
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

    Plotly.newPlot('wdir-plot-almirantadoint', data1, layout1, config);

    const almirantadoextWdir = {
      theta: almirantadoextData.wdirg,
      name: 'almirantado_ext',
      line: {
        color: '#c22d45',
        width: 2
      },
      type: 'barpolar'
    };

    const data2 = [almirantadoextWdir];

    var layout2 = {
      title: {
        text: inpeName,
        font: {
          family: 'Fira Sans, sans-serif',
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

    Plotly.newPlot('wdir-plot-almirantadoext', data2, layout2, config);

    const inpeWdir = {
      theta: inpeData.wdirg,
      name: 'inpe',
      line: {
        color: '#486641',
        width: 2
      },
      type: 'barpolar'
    };

    const data3 = [inpeWdir];

    var layout3 = {
      title: {
        text: 'PINGUIM',
        font: {
          family: 'Fira Sans, sans-serif',
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

    Plotly.newPlot('wdir-plot-inpe', data3, layout3, config);
};


const plotWvdirg = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointWvdir = {
      theta: almirantadointData.wvdirg,
      name: 'almirantado_int',
      line: {
        color: '#c22d45',
        width: 2
      },
      type: 'barpolar'
    };

    const data1 = [almirantadointWvdir];

    var layout1 = {
      title: {
        text: 'KELLER',
        font: {
          family: 'Fira Sans, sans-serif',
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

    Plotly.newPlot('wvdir-plot-almirantadoint', data1, layout1, config);

    const almirantadoextWvdir = {
      theta: almirantadoextData.wvdirg,
      name: 'almirantado_ext',
      line: {
        color: '#c22d45',
        width: 2
      },
      type: 'barpolar'
    };

    const data2 = [almirantadoextWvdir];

    var layout2 = {
      title: {
        text: inpeName,
        font: {
          family: 'Fira Sans, sans-serif',
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

    if (oldCode){
      Plotly.newPlot('wvdir-plot-almirantadoext', data2, layout2, config);
    }

    const inpeWvdir = {
      theta: inpeData.wvdirg,
      name: 'inpe',
      line: {
        color: '#c22d45',
        width: 2
      },
      type: 'barpolar'
    };

    const data3 = [inpeWvdir];

    var layout3 = {
      title: {
        text: 'PINGUIM',
        font: {
          family: 'Fira Sans, sans-serif',
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

    Plotly.newPlot('wvdir-plot-inpe', data3, layout3, config);


};


const plotWspd = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointWspd = {
      x: almirantadointData.date_time,
      y: almirantadointData.wspd,
      mode: 'lines+markers',
      name: 'KELLER',
      line: {
        color: '#c22d45',
        width: 2
      }
    };

    const almirantadoextWspd = {
      x: almirantadoextData.date_time,
      y: almirantadoextData.wspd,
      mode: 'lines+markers',
      name: inpeName,
      line: {
        color: '#2f42ad',
        width: 2
      }
    };

    const inpeWspd = {
      x: inpeData.date_time,
      y: inpeData.wspd,
      mode: 'lines+markers',
      name: 'PINGUIM',
      line: {
        color: '#486641',
        width: 2,
      }
    };


    const data = [almirantadointWspd, almirantadoextWspd, inpeWspd];

    let text = 'VELOCIDADE DO VENTO'
    let title = 'Veloc Vento (nós)'
    if (language === 'english') {
      text = "WIND VELOCITY"
      title = 'Wind Velocity (knots)'
    }


    var layout = {
      title: {
        text: text,
        font: {
          family: 'Fira Sans, sans-serif',
          size: 24
        },
      },
      plot_bgcolor:"rgba(0,0,0,0)",
      paper_bgcolor:"rgba(0,0,0,0)",
      xaxis: {
        // title: 'Tempo',
        showgrid: true,
        tickformat: '%d/%m %Hh',
        zeroline: false,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      yaxis: {
        title: title,
        showgrid: true,
        showline: true,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      showlegend: true,
      legend:{"orientation": "h",
        x: 0,
        y: -0.2,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 10,
          color: '#000'
        }
      }
    };

    var config = {responsive: true, displayModeBar: false }

    Plotly.newPlot('wspd-plot', data, layout, config);

};

const plotSwvht = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointSwvht = {
      x: almirantadointData.date_time,
      y: almirantadointData.swvht,
      mode: 'lines+markers',
      name: 'KELLER',
      line: {
        color: '#c22d45',
        width: 2
      }
    };

    const almirantadoextSwvht = {
      x: almirantadoextData.date_time,
      y: almirantadoextData.swvht,
      mode: 'lines+markers',
      name: inpeName,
      line: {
        color: '#2f42ad',
        width: 2
      }
    };

    const inpeSwvht = {
      x: inpeData.date_time,
      y: inpeData.swvht,
      mode: 'lines+markers',
      name: 'PINGUIM',
      line: {
        color: '#486641',
        width: 2,
      }
    };

    let data
    if (oldCode){
      data = [almirantadointSwvht, almirantadoextSwvht, inpeSwvht];
    } else{
      data = [almirantadointSwvht, inpeSwvht];
    }

    let text = 'ALTURA SIG. ONDA'
    let title = 'Altura de Onda (m)'
    if (language === 'english') {
      text = "SIG. WAVE HEIGHT"
      title = 'Wave Height (m)'
    }

    var layout = {
      title: {
        text: text,
        font: {
          family: 'Fira Sans, sans-serif',
          size: 24
        },
      },
      plot_bgcolor:"rgba(0,0,0,0)",
      paper_bgcolor:"rgba(0,0,0,0)",
      xaxis: {
        // title: 'Tempo',
        showgrid: true,
        tickformat: '%d/%m %Hh',
        zeroline: false,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      yaxis: {
        title: title,
        showgrid: true,
        showline: true,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      showlegend: true,
      legend:{"orientation": "h",
        x: 0,
        y: -0.2,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 10,
          color: '#000'
        }
      }
    };
    var config = {responsive: true, displayModeBar: false }

    Plotly.newPlot('swvht-plot', data, layout, config);

};

const plotTp = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

  const almirantadointtp = {
    x: almirantadointData.date_time,
    y: almirantadointData.tp,
    mode: 'lines+markers',
    name: 'KELLER',
    line: {
      color: '#c22d45',
      width: 2
    }
  };

  const almirantadoexttp = {
    x: almirantadoextData.date_time,
    y: almirantadoextData.tp,
    mode: 'lines+markers',
    name: inpeName,
    line: {
      color: '#2f42ad',
      width: 2
    }
  };

  const inpetp = {
    x: inpeData.date_time,
    y: inpeData.tp,
    mode: 'lines+markers',
    name: 'PINGUIM',
    line: {
      color: '#486641',
      width: 2,
    }
  };

  let data
  if (oldCode){
    data = [almirantadointtp, almirantadoexttp, inpetp];
  } else{
    data = [almirantadointtp, inpetp];
  }

  let text = 'PERÍODO DE PICO DE ONDA'
  let title = 'Período (s)'
  if (language === 'english') {
    text = "WAVE PEAK PERIOD"
    title = 'Period (s)'
  }


  var layout = {
    title: {
      text: text,
      font: {
        family: 'Fira Sans, sans-serif',
        size: 24
      },
    },
    plot_bgcolor:"rgba(0,0,0,0)",
    paper_bgcolor:"rgba(0,0,0,0)",
    xaxis: {
      // title: 'Tempo',
      showgrid: true,
      tickformat: '%d/%m %Hh',
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    yaxis: {
      title: title,
      showgrid: true,
      showline: true,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    showlegend: true,
    legend:{"orientation": "h",
      x: 0,
      y: -0.2,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 10,
        color: '#000'
      }
    }
  };
  var config = {responsive: true, displayModeBar: false }

  Plotly.newPlot('tp-plot', data, layout, config);

};


const plotSst = (almirantadointData, almirantadoextData, inpeData, language, inpeName, oldCode) => {

    const almirantadointSst = {
      x: almirantadointData.date_time,
      y: almirantadointData.sst,
      mode: 'lines+markers',
      name: 'KELLER',
      line: {
        color: '#c22d45',
        width: 2
      }
    };

    const almirantadoextSst = {
      x: almirantadoextData.date_time,
      y: almirantadoextData.sst,
      mode: 'lines+markers',
      name: inpeName,
      line: {
        color: '#2f42ad',
        width: 2
      }
    };

    const inpeSst = {
      x: inpeData.date_time,
      y: inpeData.sst,
      mode: 'lines+markers',
      name: 'PINGUIM',
      line: {
        color: '#486641',
        width: 2,
      }
    };


    const data = [almirantadointSst, almirantadoextSst,inpeSst];

    let text = 'TEMP. ÁGUA DO MAR'
    let title = 'Temperatura (°C)'
    if (language === 'english') {
      text = "SEA SURFACE TEMPERATURE"
      title = 'Temperature (°C)'
    }

    var layout = {
      title: {
        text: text,
        font: {
          family: 'Fira Sans, sans-serif',
          size: 24
        },
      },
      plot_bgcolor:"rgba(0,0,0,0)",
      paper_bgcolor:"rgba(0,0,0,0)",
      xaxis: {
        // title: 'Tempo',
        showgrid: true,
        tickformat: '%d/%m %Hh',
        zeroline: false,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      yaxis: {
        title: title,
        showgrid: true,
        showline: true,
        gridcolor: 'rgba(0,0,0,0.2)'
      },
      showlegend: true,
      legend:{"orientation": "h",
        x: 0,
        y: -0.2,
        traceorder: 'normal',
        font: {
          family: 'sans-serif',
          size: 10,
          color: '#000'
        }
      }
    };
    var config = {responsive: true, displayModeBar: false }

    Plotly.newPlot('sst-plot', data, layout, config);

};

const plotSss = (almirantadoextData, language, inpeName, oldCode) => {

  const almirantadoextSss = {
    x: almirantadoextData.date_time,
    y: almirantadoextData.sss,
    mode: 'lines+markers',
    name: inpeName,
    line: {
      color: '#2f42ad',
      width: 2
    }
  };

  const data = [almirantadoextSss];

  let text = 'SALINIDADE'
  let title = 'Salinity'
  if (language === 'english') {
    text = "SALINITY"
    title = 'Salinity'
  }

  var layout = {
    title: {
      text: text,
      font: {
        family: 'Fira Sans, sans-serif',
        size: 24
      },
    },
    plot_bgcolor:"rgba(0,0,0,0)",
    paper_bgcolor:"rgba(0,0,0,0)",
    xaxis: {
      // title: 'Tempo',
      showgrid: true,
      tickformat: '%d/%m %Hh',
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    yaxis: {
      title: title,
      showgrid: true,
      showline: true,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    showlegend: true,
    legend:{"orientation": "h",
      x: 0,
      y: -0.2,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 10,
        color: '#000'
      }
    }
  };
  var config = {responsive: true, displayModeBar: false }

  Plotly.newPlot('sss-plot', data, layout, config);

};

const plotAtmp = (almirantadoextData, language, inpeName, oldCode) => {

  const almirantadoextAtmp = {
    x: almirantadoextData.date_time,
    y: almirantadoextData.atmp,
    mode: 'lines+markers',
    name: inpeName,
    line: {
      color: '#2f42ad',
      width: 2
    }
  };

  const data = [almirantadoextAtmp];

  let text = 'TEMPERATURA DO AR'
  let title = 'Temperature (°C)'
  if (language === 'english') {
    text = "AIR TEMPERATURE"
    title = 'Temperature (°C)'
  }

  var layout = {
    title: {
      text: text,
      font: {
        family: 'Fira Sans, sans-serif',
        size: 24
      },
    },
    plot_bgcolor:"rgba(0,0,0,0)",
    paper_bgcolor:"rgba(0,0,0,0)",
    xaxis: {
      // title: 'Tempo',
      showgrid: true,
      tickformat: '%d/%m %Hh',
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    yaxis: {
      title: title,
      showgrid: true,
      showline: true,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    showlegend: true,
    legend:{"orientation": "h",
      x: 0,
      y: -0.2,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 10,
        color: '#000'
      }
    }
  };
  var config = {responsive: true, displayModeBar: false }

  Plotly.newPlot('atmp-plot', data, layout, config);

};


const plotPres = (almirantadoextData, language, inpeName, oldCode) => {

  const almirantadoextSst = {
    x: almirantadoextData.date_time,
    y: almirantadoextData.pres,
    mode: 'lines+markers',
    name: inpeName,
    line: {
      color: '#2f42ad',
      width: 2
    }
  };

  const data = [almirantadoextSst];

  let text = 'PRESSÃO ATMOSFÉRICA'
  let title = 'Pressão (hPa)'
  if (language === 'english') {
    text = "ATMOSPHERIC PRESSURE"
    title = 'Pressure (hPa)'
  }

  var layout = {
    title: {
      text: text,
      font: {
        family: 'Fira Sans, sans-serif',
        size: 24
      },
    },
    plot_bgcolor:"rgba(0,0,0,0)",
    paper_bgcolor:"rgba(0,0,0,0)",
    xaxis: {
      // title: 'Tempo',
      showgrid: true,
      tickformat: '%d/%m %Hh',
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    yaxis: {
      title: title,
      showgrid: true,
      showline: true,
      gridcolor: 'rgba(0,0,0,0.2)'
    },
    showlegend: true,
    legend:{"orientation": "h",
      x: 0,
      y: -0.2,
      traceorder: 'normal',
      font: {
        family: 'sans-serif',
        size: 10,
        color: '#000'
      }
    }
  };
  var config = {responsive: true, displayModeBar: false }

  Plotly.newPlot('pres-plot', data, layout, config);

};


export { initPlotly, initPlotlyNew };