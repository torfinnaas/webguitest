// API service for database operations
import axios from 'axios';

// Define the base URL for your API
// In production, this would point to your AWS API Gateway or other backend service
// For development, you might use a local server or mock API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Define the User interface based on database schema
export interface User {
  id: string;
  name: string;
  age: number;
}

// Create a new user
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get a specific user by ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
