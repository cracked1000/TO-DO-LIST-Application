import React, { useState, useEffect } from 'react';
import Navbar from './components/NavBar/NavBar';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskList/TaskList';
import './App.css';

const API_BASE_URL = "/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error("Backend not ready");
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task');
    }
  };

  const handleTaskEdit = async (updatedTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-container">
        <TaskForm onTaskAdded={fetchTasks} />

        <div className="tasks-section">
          <h2>Recent Tasks</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Connection Error: </strong>
              <p className="block sm:inline">{error}</p>
              <button 
                onClick={fetchTasks}
                className="Retry-btn">
                Retry Connection
              </button>
            </div>
          )}

          {loading ? (
            <p className="loading-message">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskComplete={handleTaskComplete}
              onTaskEdit={handleTaskEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;