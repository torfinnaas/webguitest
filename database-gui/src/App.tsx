import React from 'react';
import './App.css';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <header className="container mx-auto px-4 mb-8">
        <h1 className="text-3xl font-bold text-center">Database Management System</h1>
        <p className="text-center text-gray-600 mt-2">A simple interface for managing user records</p>
      </header>
      
      <main className="container mx-auto px-4">
        <UserManagement />
      </main>
      
      <footer className="container mx-auto px-4 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>Database GUI Project &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
