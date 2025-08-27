import React from 'react';

const ProfileCard = () => {
  return (
    <div style={styles.card}>
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        style={styles.image}
      />
      <h2 style={styles.name}>Zaid Ali</h2>
      <p style={styles.title}>Creative Developer</p>
      <p style={styles.bio}>
        Passionate about expressive design, modular builds, and cinematic UI.
      </p>
    </div>
  );
};

const styles = {
  card: {
    width: '250px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    backgroundColor: '#fff',
  },
  image: {
    borderRadius: '50%',
    marginBottom: '10px',
  },
  name: {
    margin: '10px 0 5px',
  },
  title: {
    color: '#555',
    marginBottom: '10px',
  },
  bio: {
    fontSize: '14px',
    color: '#777',
  },
};

export default ProfileCard;
