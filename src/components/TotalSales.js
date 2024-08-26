import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../components/style/TotalSales.css'; // Import your CSS file for styling

// Register Chart.js components
Chart.register(...registerables);

function TotalSales({ interval }) {
    const [chartData, setChartData] = useState({});
    const [totalSales, setTotalSales] = useState(0);
    const [averageSales, setAverageSales] = useState(0);
    const [maxSalesMonth, setMaxSalesMonth] = useState('');
    const [maxSalesAmount, setMaxSalesAmount] = useState(0);
    const [minSalesMonth, setMinSalesMonth] = useState('');
    const [minSalesAmount, setMinSalesAmount] = useState(0);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders', {
                    params: { interval }
                });
                const sortedOrders = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                const processedData = processSalesData(sortedOrders);
                setChartData(processedData.data);
                setTotalSales(processedData.total);
                setAverageSales(processedData.average);
                setMaxSalesMonth(processedData.maxMonth);
                setMaxSalesAmount(processedData.maxAmount);
                setMinSalesMonth(processedData.minMonth);
                setMinSalesAmount(processedData.minAmount);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, [interval]);

    const processSalesData = (orders) => {
        const salesAggregation = {};

        orders.forEach(order => {
            const date = new Date(order.created_at);
            const quarter = Math.floor(date.getMonth() / 3) + 1; // Determine the quarter
            const quarterYear = `${date.getFullYear()}-Q${quarter}`;

            const totalPrice = parseFloat(order.total_price_set.shop_money.amount);
            salesAggregation[quarterYear] = (salesAggregation[quarterYear] || 0) + totalPrice;
        });

        const labels = Object.keys(salesAggregation).sort();
        const data = labels.map(label => salesAggregation[label]);
        const total = data.reduce((sum, value) => sum + value, 0);
        const average = parseFloat((total / data.length).toFixed(2));

        const maxAmount = Math.max(...data);
        const maxMonth = labels[data.indexOf(maxAmount)];

        const minAmount = Math.min(...data);
        const minMonth = labels[data.indexOf(minAmount)];

        return {
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sales Data Over Time',
                        data,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      
                        borderWidth: 1,
                        hoverBackgroundColor: '#FF6384', // Hover effect color
                        
                    },
                ],
            },
            total,
            average,
            maxMonth,
            maxAmount,
            minMonth,
            minAmount,
        };
    };

    return (
        <>
            <div className="sales-report-container">
                <h3>Major Sales Details</h3>
                <div className="sales-report">
                    <div className="sales-box" style={{ backgroundColor: '#CCFF99' }}
                     onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#99CC66';
                        e.currentTarget.style.color = 'white';  // Change text color on hover
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#CCFF99';
                        e.currentTarget.style.color = 'gray';  // Revert text color on hover out
                    }}
                     >
                        Highest Sales {maxSalesMonth}: ₹{maxSalesAmount.toFixed(2)}
                    </div>
                    <div className="sales-box" style={{ backgroundColor: '#CCCCFF' }}
                     onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#9999CC';
                        e.currentTarget.style.color = '#FFF';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#CCCCFF';
                        e.currentTarget.style.color = 'gray';
                    }}
                    >
                        Lowest Sales {minSalesMonth}: ₹{minSalesAmount.toFixed(2)}
                    </div>
                    <div className="sales-box" style={{ backgroundColor: '#99FFFF' }}
                     onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#66CCCC';
                        e.currentTarget.style.color = '#FFF';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#99FFFF';
                        e.currentTarget.style.color = 'gray';
                    }}
                    >
                        Average Sales: ₹{averageSales.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <h4>Total Sales: ₹{totalSales.toFixed(2)}</h4>
                {chartData && chartData.labels && chartData.labels.length > 0 ? (
                    <Bar
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                datalabels: {
                                    display: false, // Disable data labels
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </>
    );
}

export default TotalSales;
