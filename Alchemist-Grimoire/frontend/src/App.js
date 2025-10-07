import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddMedicine from './components/AddMedicine';
import MedicineList from './components/MedicineList';
import Reminder from './components/Reminder';
import { medicineApi } from './api/medicineApi';
import './App.css';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
    
    // Set up browser notifications permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for reminders every minute
    const reminderInterval = setInterval(() => {
      checkReminders();
    }, 60000);

    return () => clearInterval(reminderInterval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicinesData, statsData] = await Promise.all([
        medicineApi.getAllMedicines(),
        medicineApi.getAdherenceStats()
      ]);
      setMedicines(medicinesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const checkReminders = async () => {
    try {
      const reminders = await medicineApi.getUpcomingReminders();
      const now = new Date();
      
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.time);
        const timeDiff = reminderTime - now;
        
        // Show notification 5 minutes before
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
          showNotification(reminder);
        }
      });
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const showNotification = (reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medicine Reminder', {
        body: `Time to take ${reminder.medicine} - ${reminder.dosage}`,
        icon: '/pill-icon.png',
        tag: reminder.medicine
      });
    }
  };

  const handleAddMedicine = async (medicineData) => {
    try {
      await medicineApi.createMedicine(medicineData);
      await loadData();
      setShowAddForm(false);
      alert('Medicine added successfully!');
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine. Please try again.');
    }
  };

  const handleUpdateMedicine = async (id, medicineData) => {
    try {
      await medicineApi.updateMedicine(id, medicineData);
      await loadData();
      alert('Medicine updated successfully!');
    } catch (error) {
      console.error('Error updating medicine:', error);
      alert('Failed to update medicine. Please try again.');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineApi.deleteMedicine(id);
        await loadData();
        alert('Medicine deleted successfully!');
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine. Please try again.');
      }
    }
  };

  const handleLogDose = async (medicineId, status, scheduledTime) => {
    try {
      await medicineApi.logDose(medicineId, {
        status,
        scheduledTime: scheduledTime || new Date()
      });
      await loadData();
    } catch (error) {
      console.error('Error logging dose:', error);
      alert('Failed to log dose. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💊 Medicine Scheduler</h1>
        <p>Never miss a dose again</p>
      </header>

      <main className="app-main">
        <Dashboard stats={stats} />
        
        <Reminder 
          medicines={medicines} 
          onLogDose={handleLogDose}
        />

        <div className="action-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Medicine'}
          </button>
        </div>

        {showAddForm && (
          <AddMedicine 
            onSubmit={handleAddMedicine}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <MedicineList 
          medicines={medicines}
          onUpdate={handleUpdateMedicine}
          onDelete={handleDeleteMedicine}
          onLogDose={handleLogDose}
        />
      </main>

      <footer className="app-footer">
        <p>© 2024 Medicine Scheduler. Stay healthy! 🏥</p>
      </footer>
    </div>
  );
}

export default App;