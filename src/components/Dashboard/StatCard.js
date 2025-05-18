import React from 'react';

const StatCard = ({ title, value, description, color }) => {
  return (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <div className="text-4xl font-bold mb-2">{value}</div>
      {description && <p className="text-sm opacity-80">{description}</p>}
    </div>
  );
};

export default StatCard;