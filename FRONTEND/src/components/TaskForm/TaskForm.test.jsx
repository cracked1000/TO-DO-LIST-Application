import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "./TaskForm";

describe("TaskForm Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  it("updates input values on change", () => {
    render(<TaskForm onTaskAdded={() => {}} />);
    const nameInput = screen.getByPlaceholderText("Enter task title");
    fireEvent.change(nameInput, { target: { value: "Test Task" } });
    expect(nameInput.value).toBe("Test Task");
  });

  it("button is enabled even if fields are empty (validation happens on click)", () => {
    render(<TaskForm onTaskAdded={() => {}} />);
    const button = screen.getByText("Add Task");
    expect(button).not.toBeDisabled();
  });

  it("shows error message if submitted empty", () => {
    render(<TaskForm onTaskAdded={() => {}} />);

    fireEvent.click(screen.getByText("Add Task"));

    expect(
      screen.getByText("Please fill in both title and description")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls fetch and onTaskAdded on valid submit", async () => {
    const mockOnTaskAdded = vi.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<TaskForm onTaskAdded={mockOnTaskAdded} />);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "Task 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "Desc 1" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockOnTaskAdded).toHaveBeenCalled();
    });
  });

  it("shows error message on API failure", async () => {
    global.fetch.mockResolvedValue({ ok: false });
    render(<TaskForm onTaskAdded={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "Desc" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to add task. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("shows error message on network failure (catch block)", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    render(<TaskForm onTaskAdded={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "Desc" },
    });
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to connect to server")
      ).toBeInTheDocument();
    });
  });
});
