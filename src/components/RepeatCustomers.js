import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import '../components/style/RepeatCustomers.css'; // Import the CSS file

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

function RepeatCustomers() {
    const [repeatCustomers, setRepeatCustomers] = useState({ daily: 0, monthly: 0, quarterly: 0, yearly: 0 });

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                const orders = response.data;
                const repeatCounts = processOrdersData(orders);
                setRepeatCustomers(repeatCounts);
            } catch (error) {
                console.error('Error fetching orders data:', error);
            }
        };

        fetchOrdersData();
    }, []);

    const processOrdersData = (orders) => {
        const groupedByEmail = {};

        // Group orders by email
        orders.forEach(order => {
            const email = order.email;
            const date = new Date(order.created_at);
            const day = date.toISOString().split('T')[0];
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const quarter = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
            const year = date.getFullYear();

            if (!groupedByEmail[email]) {
                groupedByEmail[email] = { days: new Set(), months: new Set(), quarters: new Set(), years: new Set() };
            }

            groupedByEmail[email].days.add(day);
            groupedByEmail[email].months.add(month);
            groupedByEmail[email].quarters.add(quarter);
            groupedByEmail[email].years.add(year);
        });

        const counts = { daily: 0, monthly: 0, quarterly: 0, yearly: 0 };

        // Count repeat customers for each time frame
        Object.values(groupedByEmail).forEach(customer => {
            if (customer.days.size > 1) counts.daily++;
            if (customer.months.size > 1) counts.monthly++;
            if (customer.quarters.size > 1) counts.quarterly++;
            if (customer.years.size > 1) counts.yearly++;
        });

        return counts;
    };

    // Prepare data for Pie chart
    const chartData = {
        labels: ['Daily', 'Monthly', 'Quarterly', 'Yearly'],
        datasets: [{
            label: 'Number of Repeat Customers',
            data: [repeatCustomers.daily, repeatCustomers.monthly, repeatCustomers.quarterly, repeatCustomers.yearly],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: '#fff',
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        plugins: {
            datalabels: {
                display: true,
                formatter: (value, context) => ` ${value}`,
                color: 'white', // Text color inside the pie chart
                font: {
                    weight: 'bold',
                    size: 14, // Adjust the font size if needed
                },
                anchor: 'center',
                align: 'center',
            },
        },
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart maintains a good aspect ratio
    };

    return (
        <div className="repeat-customers-container">
            <h2>Number of Repeat Customers</h2>
            <div className="pie-chart-container">
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default RepeatCustomers;
