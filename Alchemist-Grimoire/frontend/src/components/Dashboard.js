import React from 'react';
import './Dashboard.css';

function Dashboard({ stats }) {
  if (!stats) return null;

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Medicines</h3>
            <p className="stat-value">{stats.totalMedicines}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Average Adherence</h3>
            <p className="stat-value">{stats.averageAdherence}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Doses</h3>
            <p className="stat-value">
              {stats.medicineStats.reduce((sum, s) => sum + s.totalDoses, 0)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Missed Doses</h3>
            <p className="stat-value">
              {stats.medicineStats.reduce((sum, s) => sum + s.missedDoses, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="adherence-chart">
        <h3>Medicine Adherence Rates</h3>
        <div className="chart-container">
          {stats.medicineStats.map((medicine, index) => (
            <div key={index} className="chart-bar">
              <div className="bar-label">{medicine.name}</div>
              <div className="bar-wrapper">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${medicine.adherenceRate}%`,
                    backgroundColor: medicine.adherenceRate >= 80 ? '#4caf50' : 
                                   medicine.adherenceRate >= 60 ? '#ff9800' : '#f44336'
                  }}
                >
                  <span className="bar-percentage">{medicine.adherenceRate}%</span>
                </div>
              </div>
              <div className="bar-stats">
                {medicine.takenDoses}/{medicine.totalDoses} doses
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;