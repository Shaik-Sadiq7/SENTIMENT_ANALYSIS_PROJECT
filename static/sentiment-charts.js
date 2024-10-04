document.addEventListener("DOMContentLoaded", function () {
    if (resultData) {
        createBarChart(resultData);
        createPieChart(resultData);
        createlineChart(resultData);
    }
});

function createBarChart(resultData) {
    var ctx = document.getElementById('barChart').getContext('2d');
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [
                    resultData.positive,
                    resultData.negative,
                    resultData.neutral 
                ],
                backgroundColor: ['#4CAF50', '#FF5733', '#FFC300'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Set canvas size to cover the whole webpage
    setCanvasSize(barChart, window.innerWidth, window.innerHeight * 0.3);
}

function createPieChart(resultData) {
    var ctx = document.getElementById('pieChart').getContext('2d');
    var pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                data: [
                    resultData.positive,
                    resultData.negative,
                    resultData.neutral 
                ],
                backgroundColor: ['#4CAF50', '#FF5733', '#FFC300'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: {
                    display: true, // Change to true to display legend
                    position: 'bottom', // Change the position as per your preference
                    labels: {
                        boxWidth: 15, // Adjust box width as needed
                        fontColor: 'black', // Adjust font color as needed
                        generateLabels: function (chart) {
                            var data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function (label, i) {
                                    var meta = chart.getDatasetMeta(0);
                                    var ds = data.datasets[0];
                                    var arc = meta.data[i];
                                    var value = ds.data[i];
                                    var percentage = value + '%';
                                    return {
                                        text: label + ': ' + percentage,
                                        fillStyle: ds.backgroundColor[i],
                                        hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });

    // Set canvas size to cover the whole webpage
    setCanvasSize(pieChart, window.innerWidth, window.innerHeight * 0.3);
}



// Function to set canvas size
function setCanvasSize(chart, width, height) {
    chart.canvas.parentNode.style.width = width + 'px';
    chart.canvas.parentNode.style.height = height + 'px';
    chart.canvas.width = width;
    chart.canvas.height = height;
}
