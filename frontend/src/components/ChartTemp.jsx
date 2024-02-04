import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
const ChartTemp = () => {
  const [tempChart, setTempChart] = useState(null);


  useEffect(() => {
    function updateCharts() {
      // Fetch new data for temperature, humidity, and pressure
      axios.get('https://api.thingspeak.com/channels/2309020/fields/1.json?api_key=I2TWU0ISG1JNAJDI&results=1')
        .then((response) => {
          const data = response.data.feeds[0];
          const timestampUTC = new Date(data.created_at);
          const istOptions = { timeZone: 'Asia/Kolkata' , hour12: false};
          const timestamp = timestampUTC.toLocaleTimeString('en-US', istOptions);

          const temperature = parseFloat(data.field1);


          // Update temperature chart
          if (tempChart) {
            tempChart.data.labels.push(timestamp);
            tempChart.data.datasets[0].data.push(temperature);

            // Remove the oldest entry if the number of entries exceeds 5
            if (tempChart.data.labels.length > 10) {
              tempChart.data.labels.shift();
              tempChart.data.datasets[0].data.shift();
            }

            tempChart.update();
            
          }
        })
        .catch((error) => {
          console.error('Error fetching temperature data:', error);
        });

     

      
        
    }

    // Create an initial empty chart for temperature
    var tempCtx = document.getElementById('myChart1').getContext('2d');
    if (tempChart) {
        tempChart.destroy();
      }
    var tempChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperature',
            backgroundColor: '#EF4444',
            data: [],
            borderColor: '#EF4444',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: 'Temperature Chart',
        },
        plugins: {  // 'legend' now within object 'plugins {}'
            legend: {
              labels: {
                color: "#EF4444",  // not 'fontColor:' anymore
                // fontSize: 18  // not 'fontSize:' anymore 
              }
            }
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
                color: '#EF4444',
              maxTicksLimit: 10, // Set the maximum number of x-axis ticks
            },
          },
          y: {
            title: {
                color: '#111111',
                display: true,
                text: 'Temperature'
            },
            ticks: {
                color: '#EF4444',
              maxTicksLimit: 10, // Set the maximum number of x-axis ticks
            },
            color: '#FFFFFF',
            min: 25, // Set the minimum y-axis value to 70
            max: 36, // Set the maximum y-axis value to 100
            beginAtZero: false, // You may want to set this to false to explicitly start from 70
          },
        },
      },
    });
    

  


    // Set the initial chart instances
    setTempChart(tempChart);
    

    // Update charts periodically
    const updateInterval = setInterval(updateCharts, 30000); // Update every 30 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  return (
    
      
     
        <canvas id='myChart1' width="1500" height="220" ></canvas>
     
   
  );
};

export default ChartTemp;
