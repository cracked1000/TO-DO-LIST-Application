import React, { useState } from "react";
import "./TaskCard.css";

function TaskCard({ task, onComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!editedName.trim() || !editedDescription.trim()) {
      setError("Title and description are required");
      return;
    }
    onEdit({
      ...task,
      name: editedName.trim(),
      description: editedDescription.trim(),
    });
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
    setError("");
  };

  const handleComplete = () => {
    onComplete(task.id);
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          className="edit-input"
          value={editedName}
          onChange={(e) => {
            setEditedName(e.target.value);
            if (error) setError("");
          }}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          className="edit-textarea"
          value={editedDescription}
          onChange={(e) => {
            setEditedDescription(e.target.value);
            if (error) setError("");
          }}
          placeholder="Task description"
          rows="3"
        />

        {}
        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "0.875rem",
              marginBottom: "8px",
            }}
          >
            {error}
          </div>
        )}

        <div className="task-actions">
          <button onClick={handleSave} className="btn-save">
            Save
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.name}</h3>
        <span className="task-date">{formatDate(task.createdAt)}</span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-actions">
        <button onClick={handleComplete} className="btn-done">
          Done
        </button>
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Edit
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
