import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';

vi.mock('../TaskCard/TaskCard', () => ({
  default: ({ task, onComplete, onEdit }) => (
    <div data-testid="task-card">
      <span>{task.name}</span>
      <button onClick={() => onComplete(task.id)}>Complete</button>
      <button onClick={() => onEdit(task)}>Edit</button>
    </div>
  ),
}));

const mockTasks = [
  { id: 1, name: 'Task 1', description: 'Desc 1' },
  { id: 2, name: 'Task 2', description: 'Desc 2' },
];

describe('TaskList Component', () => {
  it('renders the empty message when no tasks are provided', () => {
    render(<TaskList tasks={[]} onTaskComplete={() => {}} onTaskEdit={() => {}} />);
    
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders a list of TaskCards when tasks are provided', () => {
    render(<TaskList tasks={mockTasks} onTaskComplete={() => {}} onTaskEdit={() => {}} />);
    
    const cards = screen.getAllByTestId('task-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('passes onTaskComplete handler correctly', () => {
    const mockOnComplete = vi.fn();
    render(<TaskList tasks={mockTasks} onTaskComplete={mockOnComplete} onTaskEdit={() => {}} />);
    
    const completeButtons = screen.getAllByText('Complete');
    fireEvent.click(completeButtons[0]);

    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  it('passes onTaskEdit handler correctly', () => {
    const mockOnEdit = vi.fn();
    render(<TaskList tasks={mockTasks} onTaskComplete={() => {}} onTaskEdit={mockOnEdit} />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[1]);
  });
});