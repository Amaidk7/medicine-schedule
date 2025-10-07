import React, { useState } from 'react';
import './AddMedicine.css';

function AddMedicine({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once-daily',
    times: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    reminderEnabled: true
  });

  const frequencyOptions = {
    'once-daily': 1,
    'twice-daily': 2,
    'three-times-daily': 3,
    'four-times-daily': 4
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'frequency') {
      const numTimes = frequencyOptions[value] || 1;
      const defaultTimes = [];
      
      if (value === 'once-daily') defaultTimes.push('09:00');
      else if (value === 'twice-daily') defaultTimes.push('09:00', '21:00');
      else if (value === 'three-times-daily') defaultTimes.push('08:00', '14:00', '20:00');
      else if (value === 'four-times-daily') defaultTimes.push('08:00', '12:00', '16:00', '20:00');
      
      setFormData({
        ...formData,
        frequency: value,
        times: defaultTimes
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || formData.times.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="add-medicine">
      <h2>Add New Medicine</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Medicine Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Aspirin"
              required
            />
          </div>

          <div className="form-group">
            <label>Dosage *</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Frequency *</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
            >
              <option value="once-daily">Once Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="three-times-daily">Three Times Daily</option>
              <option value="four-times-daily">Four Times Daily</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Times *</label>
          {formData.times.map((time, index) => (
            <input
              key={index}
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional instructions..."
            rows="3"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={handleChange}
            />
            Enable reminders
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Medicine
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMedicine;