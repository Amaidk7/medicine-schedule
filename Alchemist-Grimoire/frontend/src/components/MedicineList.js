import React, { useState } from 'react';
import './MedicineList.css';

function MedicineList({ medicines, onUpdate, onDelete, onLogDose }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (medicine) => {
    setEditingId(medicine._id);
    setEditData({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      times: medicine.times,
      notes: medicine.notes,
      reminderEnabled: medicine.reminderEnabled
    });
  };

  const handleSave = async (id) => {
    await onUpdate(id, editData);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...editData.times];
    newTimes[index] = value;
    setEditData({ ...editData, times: newTimes });
  };

  const getAdherenceColor = (logs) => {
    if (logs.length === 0) return '#4caf50';
    const takenCount = logs.filter(log => log.status === 'taken').length;
    const rate = (takenCount / logs.length) * 100;
    if (rate >= 80) return '#4caf50';
    if (rate >= 60) return '#ff9800';
    return '#f44336';
  };

  if (medicines.length === 0) {
    return (
      <div className="medicine-list">
        <h2>Your Medicines</h2>
        <div className="empty-state">
          <p>📋 No medicines added yet</p>
          <p>Click "Add Medicine" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-list">
      <h2>Your Medicines</h2>
      <div className="medicines-grid">
        {medicines.map((medicine) => (
          <div key={medicine._id} className="medicine-card">
            {editingId === medicine._id ? (
              // Edit Mode
              <div className="edit-mode">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Medicine name"
                />
                <input
                  type="text"
                  value={editData.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  placeholder="Dosage"
                />
                <select
                  value={editData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                >
                  <option value="once-daily">Once Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="three-times-daily">Three Times Daily</option>
                  <option value="four-times-daily">Four Times Daily</option>
                </select>
                
                <div className="times-edit">
                  {editData.times.map((time, index) => (
                    <input
                      key={index}
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                  ))}
                </div>

                <textarea
                  value={editData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Notes"
                  rows="2"
                />

                <div className="edit-actions">
                  <button onClick={() => handleSave(medicine._id)} className="btn-save">
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="medicine-header">
                  <h3>{medicine.name}</h3>
                  <div 
                    className="adherence-badge"
                    style={{ backgroundColor: getAdherenceColor(medicine.doseLogs) }}
                  >
                    {medicine.doseLogs.length > 0 
                      ? `${Math.round((medicine.doseLogs.filter(l => l.status === 'taken').length / medicine.doseLogs.length) * 100)}%`
                      : '100%'
                    }
                  </div>
                </div>

                <div className="medicine-info">
                  <p><strong>Dosage:</strong> {medicine.dosage}</p>
                  <p><strong>Frequency:</strong> {medicine.frequency.replace('-', ' ')}</p>
                  <p><strong>Times:</strong> {medicine.times.join(', ')}</p>
                  {medicine.notes && (
                    <p><strong>Notes:</strong> {medicine.notes}</p>
                  )}
                </div>

                <div className="medicine-stats">
                  <div className="stat">
                    <span className="stat-label">Total Doses</span>
                    <span className="stat-value">{medicine.doseLogs.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Taken</span>
                    <span className="stat-value taken">
                      {medicine.doseLogs.filter(l => l.status === 'taken').length}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Missed</span>
                    <span className="stat-value missed">
                      {medicine.doseLogs.filter(l => l.status === 'missed').length}
                    </span>
                  </div>
                </div>

                <div className="medicine-actions">
                  <button 
                    onClick={() => onLogDose(medicine._id, 'taken')}
                    className="btn-action btn-taken"
                  >
                    ✓ Taken
                  </button>
                  <button 
                    onClick={() => handleEdit(medicine)}
                    className="btn-action btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => onDelete(medicine._id)}
                    className="btn-action btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineList;