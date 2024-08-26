import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import '../components/style/GraphicCustomer.css'; // Import your CSS

// Fix for default icon issues in Leaflet when using with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function GraphicCustomer() {
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchAddresses = async () => {
            const addressData = await extractAddresses(customers);
            setAddresses(addressData);
        };

        fetchAddresses();
    }, [customers]);

    const extractAddresses = async (customers) => {
        // Extract cities and ensure they are unique
        const cities = [...new Set(customers.map(customer => customer.addresses.city).filter(city => city))];
        console.log("Cities to be geocoded:", cities); // Log cities to verify

        // Fetch coordinates for each city
        const addressesWithCoords = await Promise.all(cities.map(async (city) => {
            const latLng = await getLatLng(city + ', USA'); // Adding 'USA' or another country/state as needed
            console.log(`Coordinates for ${city}:`, latLng); // Log coordinates to verify
            return {
                city,
                latLng,
                fullAddress: city,
                customerCount: customers.filter(customer => customer.addresses.city === city).length, // Count customers in each city
            };
        }));
        return addressesWithCoords;
    };

    const getLatLng = async (city) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`);
            console.log(`Geocoding response for ${city}:`, response.data); // Log the full response
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return [parseFloat(lat), parseFloat(lon)];
            } else {
                console.warn(`No data found for city: ${city}`);
                return [37.0902, -95.7129]; // Default coordinates (center of the USA)
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            return [37.0902, -95.7129]; // Fallback coordinates (center of the USA)
        }
    };

    return (
        <div className="map-container">
            <h2>Geographical Distribution of Customers</h2>
            <MapContainer center={[37.0902, -95.7129]} zoom={4} className="leaflet-container">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {addresses.map((address, index) => (
                    <Marker key={index} position={address.latLng}>
                        <Popup>
                            <strong>{address.city}</strong><br />
                            Number of Customers: {address.customerCount}<br />
                            {address.fullAddress}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default GraphicCustomer;
