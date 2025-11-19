import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

const mockTasks = [
  { id: 1, name: 'Buy Groceries', description: 'Milk and Eggs', createdAt: '2023-10-01T10:00:00' },
  { id: 2, name: 'Walk Dog', description: 'In the park', createdAt: '2023-10-01T12:00:00' }
]

describe('App Integration', () => {
  const mockFetch = (data, ok = true) => {
    return vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(data),
    })
  }

  beforeEach(() => {
    global.fetch = mockFetch(mockTasks)
    global.alert = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and renders tasks on mount', async () => {
    render(<App />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Buy Groceries')).toBeInTheDocument()
      expect(screen.getByText('Walk Dog')).toBeInTheDocument()
    })
  })

  it('adds a new task and refreshes list', async () => {
    render(<App />)

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument())

    // 2. Fill out inputs
    const nameInput = screen.getByPlaceholderText('Enter task title')
    const descInput = screen.getByPlaceholderText('Enter task description')
    const addButton = screen.getByText('Add Task')

    fireEvent.change(nameInput, { target: { value: 'New Task' } })
    fireEvent.change(descInput, { target: { value: 'New Desc' } })

    global.fetch
      .mockImplementationOnce(mockFetch({ id: 3, name: 'New Task' })) 
      .mockImplementationOnce(mockFetch([...mockTasks, { id: 3, name: 'New Task', description: 'New Desc', createdAt: new Date().toISOString() }]))
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })

  it('completes a task and refreshes list', async () => {
    render(<App />)
    
    await waitFor(() => expect(screen.getByText('Buy Groceries')).toBeInTheDocument())

    global.fetch
        .mockImplementationOnce(mockFetch({})) 
        .mockImplementationOnce(mockFetch([mockTasks[1]])) 

    const doneButtons = screen.getAllByText('Done')
    fireEvent.click(doneButtons[0])

    await waitFor(() => {
      expect(screen.queryByText('Buy Groceries')).not.toBeInTheDocument()
    })
  })
})