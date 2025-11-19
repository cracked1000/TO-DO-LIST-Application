import React, { useState } from "react";
import "./TaskForm.css";

const API_URL = "/tasks";

function TaskForm({ onTaskAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      setError("Please fill in both title and description");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (response.ok) {
        setName("");
        setDescription("");
        onTaskAdded();
      } else {
        setError("Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">Add a Task</h2>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Title
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          className="form-input"
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError("");
          }}
          className="form-textarea"
          placeholder="Enter task description"
          rows="4"
        />
      </div>

      {}
      {error && (
        <div
          style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            marginBottom: "12px",
          }}
        >
          {error}
        </div>
      )}

      <button onClick={handleSubmit} className="form-button" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
}

export default TaskForm;
