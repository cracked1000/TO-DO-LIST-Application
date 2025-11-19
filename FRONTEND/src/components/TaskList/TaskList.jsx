import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './TaskList.css';

function TaskList({ tasks, onTaskComplete, onTaskEdit }) {
  if (tasks.length === 0) {
    return (
      <p className="empty-message">
        No tasks yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={onTaskComplete}
          onEdit={onTaskEdit}
        />
      ))}
    </div>
  );
}

export default TaskList;