import React, { useState, useEffect } from 'react';
import './Reminder.css';

function Reminder({ medicines, onLogDose }) {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateReminders();
    }, 60000); // Update every minute

    updateReminders();

    return () => clearInterval(timer);
  }, [medicines]);

  const updateReminders = () => {
    const now = new Date();
    const reminders = [];

    medicines.forEach(medicine => {
      if (!medicine.reminderEnabled) return;

      medicine.times.forEach(time => {
        const [hours, minutes] = time.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Check if this reminder is upcoming (within next 2 hours)
        const timeDiff = reminderTime - now;
        if (timeDiff > 0 && timeDiff <= 2 * 60 * 60 * 1000) {
          reminders.push({
            medicineId: medicine._id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            time: reminderTime,
            timeString: time
          });
        }
      });
    });

    // Sort by time
    reminders.sort((a, b) => a.time - b.time);
    setUpcomingReminders(reminders);
  };

  const formatTimeRemaining = (reminderTime) => {
    const now = new Date();
    const diff = reminderTime - now;
    
    if (diff < 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    }
    return `in ${minutes}m`;
  };

  if (upcomingReminders.length === 0) {
    return (
      <div className="reminder-section">
        <h2>⏰ Upcoming Reminders</h2>
        <div className="no-reminders">
          <p>🎉 No upcoming reminders in the next 2 hours</p>
          <p className="current-time">Current time: {currentTime.toLocaleTimeString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reminder-section">
      <h2>⏰ Upcoming Reminders</h2>
      <p className="current-time">Current time: {currentTime.toLocaleTimeString()}</p>
      
      <div className="reminders-list">
        {upcomingReminders.map((reminder, index) => (
          <div key={index} className="reminder-card">
            <div className="reminder-time">
              <div className="time-badge">{reminder.timeString}</div>
              <div className="time-remaining">{formatTimeRemaining(reminder.time)}</div>
            </div>
            
            <div className="reminder-info">
              <h4>{reminder.medicineName}</h4>
              <p>{reminder.dosage}</p>
            </div>

            <div className="reminder-actions">
              <button
                onClick={() => onLogDose(reminder.medicineId, 'taken', reminder.time)}
                className="btn-quick-log"
                title="Mark as taken"
              >
                ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reminder;