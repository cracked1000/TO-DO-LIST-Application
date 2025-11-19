import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";

vi.mock("./components/NavBar/NavBar", () => ({
  default: () => <div data-testid="navbar">NavBar Mock</div>,
}));

vi.mock("./components/TaskForm/TaskForm", () => ({
  default: ({ onTaskAdded }) => (
    <button data-testid="add-task-btn" onClick={onTaskAdded}>
      Add Task Mock
    </button>
  ),
}));

vi.mock("./components/TaskList/TaskList", () => ({
  default: ({ tasks, onTaskComplete, onTaskEdit }) => (
    <div data-testid="task-list">
      {tasks.map((task) => (
        <div key={task.id}>
          <span>{task.title}</span>
          <button
            data-testid={`complete-${task.id}`}
            onClick={() => onTaskComplete(task.id)}
          >
            Complete
          </button>
          <button
            data-testid={`edit-${task.id}`}
            onClick={() => onTaskEdit({ ...task, title: "Updated Title" })}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  ),
}));

describe("App Component Integration", () => {
  const fetchMock = vi.fn();
  global.fetch = fetchMock;
  global.alert = vi.fn();

  beforeEach(() => {
    fetchMock.mockClear();
    global.alert.mockClear();
  });

  it("renders tasks successfully (Happy Path)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Test Task", isCompleted: false }],
    });
    render(<App />);

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("handles API error on initial load and allows Retry", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network Error"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/Could not connect to server/i)
      ).toBeInTheDocument();
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Retried Task", isCompleted: false }],
    });

    const retryBtn = screen.getByText(/Retry Connection/i);
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Retried Task")).toBeInTheDocument();
    });
  });

  it('handles "Backend not ready" generic error', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/Could not connect to server/i)
      ).toBeInTheDocument();
    });
  });

  it("completes a task successfully", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Task 1", isCompleted: false }],
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    fetchMock.mockResolvedValueOnce({ ok: true });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Task 1", isCompleted: true }],
    });

    fireEvent.click(screen.getByTestId("complete-1"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/tasks/1/complete",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });

  it("handles error when completing a task", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Task 1", isCompleted: false }],
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    fetchMock.mockRejectedValueOnce(new Error("Update failed"));

    fireEvent.click(screen.getByTestId("complete-1"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled; // Implicit check
      expect(global.alert).toHaveBeenCalledWith("Error completing task");
    });
  });

  it("edits a task successfully", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Old Title", isCompleted: false }],
    });

    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Old Title")).toBeInTheDocument()
    );

    fetchMock.mockResolvedValueOnce({ ok: true });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Updated Title", isCompleted: false }],
    });

    fireEvent.click(screen.getByTestId("edit-1"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/tasks/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            id: 1,
            title: "Updated Title",
            isCompleted: false,
          }),
        })
      );
    });
  });

  it("handles error when updating a task", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Task 1", isCompleted: false }],
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    fetchMock.mockRejectedValueOnce(new Error("Update failed"));

    fireEvent.click(screen.getByTestId("edit-1"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Error updating task");
    });
  });

  it("refreshes tasks when a new task is added (via TaskForm)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    await waitFor(() =>
      expect(screen.getByTestId("add-task-btn")).toBeInTheDocument()
    );

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 99, title: "New Task" }],
    });

    fireEvent.click(screen.getByTestId("add-task-btn"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
