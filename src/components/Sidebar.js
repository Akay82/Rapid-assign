import React from 'react';

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h4 style={styles.text}>Dashboard</h4>
      {/* Add more options here */}
    </div>
  );
}

const styles = {
  sidebar: {
    position: 'sticky',
    top: '0',
    zIndex: 1000,
    width: '15%',
    height: '100vh', // Make the sidebar the full height of the viewport
    backgroundColor: 'white',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
  },
  text: {
    color: 'grey',
    marginTop: '20px',
    backgroundColor: 'white',
    padding: '8px 35px',
    borderRadius: '10px',
    border: '1px solid lightgrey',
    cursor: 'pointer',
  },
};

export default Sidebar;
