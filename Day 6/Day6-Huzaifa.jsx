import React from "react";

function ProfileCard() {
  return (
    <div style={containerStyle}>
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        style={avatarStyle}
      />
      <h2 style={headingStyle}>Huzaifa</h2>
      <p style={subtitleStyle}>React Beginner</p>
      <p style={textStyle}>
        Learning how to build simple and useful components with React.
      </p>
    </div>
  );
}

// Simple inline styles
const containerStyle = {
  width: "200px",
  padding: "12px",
  border: "1px solid lightgray",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const avatarStyle = {
  borderRadius: "50%",
  marginBottom: "8px",
};

const headingStyle = {
  fontSize: "16px",
  margin: "6px 0",
};

const subtitleStyle = {
  fontSize: "13px",
  color: "#555",
};

const textStyle = {
  fontSize: "11px",
  color: "#777",
};

export default ProfileCard;
