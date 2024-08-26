import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TotalSales from './TotalSales';
import CustomerList from './CustomerList';
import GraphicCustomer from './GraphicCustomer';
import RepeatCustomers from './RepeatCustomers';
import CustomerLifetimeValueByCohort from './CustomerLifetimeValueByCohort';

function Dashboard() {
  return (<>   
    <div style={{
      backgroundColor: 'whiteSmoke',
      paddingBottom:'20px',
      height:'fit-content',
      width:'100%',
    }}>
      {/* Content goes here */}
    <Navbar />
    <Sidebar />
   
    <TotalSales />
    <CustomerList />
    <GraphicCustomer />
    <RepeatCustomers />
    <CustomerLifetimeValueByCohort />
    </div>
    </>
  );
}

export default Dashboard;
