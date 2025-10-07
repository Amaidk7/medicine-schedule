import axios from 'axios';

const API_URL = '/api/medicines';

export const medicineApi = {
  // Get all medicines
  getAllMedicines: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get single medicine
  getMedicine: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new medicine
  createMedicine: async (medicineData) => {
    const response = await axios.post(API_URL, medicineData);
    return response.data;
  },

  // Update medicine
  updateMedicine: async (id, medicineData) => {
    const response = await axios.put(`${API_URL}/${id}`, medicineData);
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Log a dose
  logDose: async (id, doseData) => {
    const response = await axios.post(`${API_URL}/${id}/log`, doseData);
    return response.data;
  },

  // Get upcoming reminders
  getUpcomingReminders: async () => {
    const response = await axios.get(`${API_URL}/reminders/upcoming`);
    return response.data;
  },

  // Get adherence statistics
  getAdherenceStats: async () => {
    const response = await axios.get(`${API_URL}/stats/adherence`);
    return response.data;
  }
};