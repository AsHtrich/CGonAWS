import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
const ChartHum = () => {
  const [humidityChart, setHumidityChart] = useState(null);
  useEffect(() => {
    function updateCharts() {
   
     

      axios.get('https://api.thingspeak.com/channels/2309020/fields/2.json?api_key=I2TWU0ISG1JNAJDI&results=1')
        .then((response) => {
          const data = response.data.feeds[0];
          const timestampUTC = new Date(data.created_at);
          const istOptions = { timeZone: 'Asia/Kolkata' , hour12: false};
          const timestamp = timestampUTC.toLocaleTimeString('en-US', istOptions);

          const humidity = parseFloat(data.field2);

          // Update humidity chart
          if (humidityChart) {
            humidityChart.data.labels.push(timestamp);
            humidityChart.data.datasets[0].data.push(humidity);

            // Remove the oldest entry if the number of entries exceeds 5
            if (humidityChart.data.labels.length > 10) {
              humidityChart.data.labels.shift();
              humidityChart.data.datasets[0].data.shift();
            }

            humidityChart.update();
          }
        })
        .catch((error) => {
          console.error('Error fetching humidity data:', error);
        });

    }

    // Create an initial empty chart for temperature
   

    // Create an initial empty chart for humidity
    var humidityCtx = document.getElementById('myChart2').getContext('2d');
    var humidityChart = new Chart(humidityCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humidity',
            backgroundColor: '#1D4ED8',
            data: [],
            borderColor: '#1D4ED8',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
       
        scales: {
          x: {
            display: true,
            title: {
                color: '#FFFFFF',
              display: true,
              text: 'Time',
            },
            ticks: {
                color: "#1D4ED8",
              maxTicksLimit: 10, // Set the maximum number of x-axis ticks
            },
          },
          y: {
            title: {
                color: '#111111',
                display: true,
                text: 'Humidity'
            },
            beginAtZero: true,
            min: 50,
            max: 100,
            color: '#FFFFFF',
            ticks: {
                color: "#1D4ED8",
              maxTicksLimit: 10, // Set the maximum number of x-axis ticks
            },
          },
          
        },
      },
    });

   


    setHumidityChart(humidityChart);
   

    // Update charts periodically
    const updateInterval = setInterval(updateCharts, 30000); // Update every 30 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <canvas id='myChart2' width="1500" height="220" ></canvas>
  );
};

export default ChartHum;
