import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../components/style/SampleList.css'; // Import the CSS file

Chart.register(...registerables);

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [chartData, setChartData] = useState({});
    const [totalCustomers, setTotalCustomers] = useState(0); // State to hold the total number of customers

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                const sortedCustomers = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setCustomers(sortedCustomers);
                
                const { data, total } = processCustomerData(sortedCustomers);
                setChartData(data);
                setTotalCustomers(total); // Set the total number of customers
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
      
        fetchCustomers();
    }, []);

    const processCustomerData = (customers) => {
        const counts = {};
        let total = 0; // Variable to hold the total number of customers
        customers.forEach(customer => {
            const date = new Date(customer.created_at);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format as YYYY-MM

            counts[monthYear] = (counts[monthYear] || 0) + 1;
            total += 1; // Increment the total number of customers
        });

        const labels = Object.keys(counts);
        const data = Object.values(counts);

        return {
            data: {
                labels,
                datasets: [
                    {
                        label: 'New Customers Added per Month',
                        data,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light background color
                        tension: 0.2,
                    },
                ],
            },
            total, // Return the total number of customers
        };
    };

    return (
        <div className="customer-chart-container">
            <h5>Total Number of Customers: {totalCustomers}</h5> {/* Display the total number of customers */}
            {chartData && chartData.labels && chartData.labels.length > 0 ? (
                <Line data={chartData} options={{
                    maintainAspectRatio: false, // Disable the aspect ratio to control the chart size
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }} />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
}

export default CustomerList;
