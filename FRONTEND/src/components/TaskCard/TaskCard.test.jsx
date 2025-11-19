import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from './TaskCard'

const mockTask = {
  id: 1,
  name: 'Original Name',
  description: 'Original Description',
  createdAt: '2023-01-01'
}

describe('TaskCard Component', () => {
  
  it('renders task details in view mode', () => {
    render(<TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />)
    
    expect(screen.getByText('Original Name')).toBeInTheDocument()
    expect(screen.getByText('Original Description')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Task title')).not.toBeInTheDocument()
  })

  it('switches to edit mode when Edit button is clicked', () => {
    render(<TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />)
    
    fireEvent.click(screen.getByText('Edit'))
    
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Task title').value).toBe('Original Name')
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onEdit with new values when Save is clicked', () => {
    const mockOnEdit = vi.fn()
    render(<TaskCard task={mockTask} onComplete={() => {}} onEdit={mockOnEdit} />)
    
    fireEvent.click(screen.getByText('Edit'))
    
    const titleInput = screen.getByPlaceholderText('Task title')
    const descInput = screen.getByPlaceholderText('Task description')
    
    fireEvent.change(titleInput, { target: { value: 'Updated Name' } })
    fireEvent.change(descInput, { target: { value: 'Updated Description' } })
    
    fireEvent.click(screen.getByText('Save'))
    
    expect(mockOnEdit).toHaveBeenCalledWith({
      ...mockTask,
      name: 'Updated Name',
      description: 'Updated Description'
    })
  })

  it('resets values and exits edit mode on Cancel', () => {
    render(<TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />)
    
    fireEvent.click(screen.getByText('Edit'))
    
    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'Wrong Name' } })
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(screen.getByText('Original Name')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Wrong Name')).not.toBeInTheDocument()
  })
})