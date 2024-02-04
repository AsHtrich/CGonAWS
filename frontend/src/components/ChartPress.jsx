import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
const ChartPress = () => {

  const [pressureChart, setPressureChart] = useState(null);

  useEffect(() => {
    function updateCharts() {
      axios.get('https://api.thingspeak.com/channels/2309020/fields/3.json?api_key=I2TWU0ISG1JNAJDI&results=1')
        .then((response) => {
          const data = response.data.feeds[0];
          const timestampUTC = new Date(data.created_at);
          const istOptions = { timeZone: 'Asia/Kolkata' , hour12: false};
          const timestamp = timestampUTC.toLocaleTimeString('en-US', istOptions);

          const pressure = parseFloat(data.field3);

          // Update pressure chart
          if (pressureChart) {
            pressureChart.data.labels.push(timestamp);
            pressureChart.data.datasets[0].data.push(pressure);

            // Remove the oldest entry if the number of entries exceeds 5
            if (pressureChart.data.labels.length > 10) {
              pressureChart.data.labels.shift();
              pressureChart.data.datasets[0].data.shift();
            }

            pressureChart.update();
          }
        })
        .catch((error) => {
          console.error('Error fetching pressure data:', error);
        });
    }

   

    // Create an initial empty chart for pressure
    var pressureCtx = document.getElementById('myChart3').getContext('2d');
    var pressureChart = new Chart(pressureCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Pressure',
            backgroundColor: '#EAB308',
            data: [],
            borderColor: '#EAB308',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Pressure Chart',
        },
        scales: {
          x: {
            display: true,
            title: {
                color: '#FFFFFF',
              display: true,
              text: 'Time',
            },
            ticks: {
              maxTicksLimit: 10, 
              color: '#EAB308',
              // Set the maximum number of x-axis ticks
            },
          },
          y: {
            
            color: '#FFFFFF',
            beginAtZero: false,
            ticks: {
                color: "#EAB308",
              maxTicksLimit: 10, // Set the maximum number of x-axis ticks
            },
          },
        },
      },
    });

  
    setPressureChart(pressureChart);

    // Update charts periodically
    const updateInterval = setInterval(updateCharts, 30000); // Update every 30 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (

      
    
        <canvas id='myChart3' width="1500" height="220"></canvas>
    
  );
};

export default ChartPress;
