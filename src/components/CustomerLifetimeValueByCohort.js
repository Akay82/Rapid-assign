import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Ensure this plugin is installed and correctly imported
import '../components/style/CustomerLifetimeValueByCohort.css'; 

// Register Chart.js components and plugins
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

function CustomerLifetimeValueByCohort() {
    const [cohortData, setCohortData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                const orders = response.data;
                const clvData = processOrdersData(orders);
                setCohortData(clvData);
            } catch (error) {
                console.error('Error fetching orders data:', error);
            }
        };

        fetchOrdersData();
    }, []);

    const processOrdersData = (orders) => {
        const cohorts = {};
        const revenueByMonth = {};

        orders.forEach(order => {
            const email = order.email;
            const date = new Date(order.created_at);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const revenue = parseFloat(order.total_price);

            if (!cohorts[email]) {
                cohorts[email] = month;
            }

            if (!revenueByMonth[month]) {
                revenueByMonth[month] = 0;
            }

            revenueByMonth[month] += revenue;
        });

        const labels = Object.keys(revenueByMonth);
        const data = labels.map(label => revenueByMonth[label]);

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Customer Lifetime Value by Cohort',
                data: data,
                backgroundColor: '#36A2EB',
                hoverBackgroundColor: '#FF6384',
            }],
        };

        return chartData;
    };

    const options = {
        plugins: {
            datalabels: {
                formatter: function (value, context) {
                    return '₹' + value.toFixed(1);
                },
                color: 'gray',
                anchor: 'end',
                align: 'end',
                offset: 13,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.label + ': $' + tooltipItem.raw.toFixed(1);
                    }
                }
            },
            legend: {
                display: false, // Hide the legend to keep the chart clean
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Cohort (Year-Month)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Customer Lifetime Value (CLV)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="cohort-container">
            <h2>Customer Lifetime Value by Cohort</h2>
            <Bar data={cohortData} options={options} className="bar-chart" />
        </div>
    );
}

export default CustomerLifetimeValueByCohort;
