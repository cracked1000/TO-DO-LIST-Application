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

  it("disables button if fields are empty", () => {
    render(<TaskForm onTaskAdded={() => {}} />);
    const button = screen.getByText("Add Task");
    expect(button).toBeDisabled();
  });

  it("enables button when fields are filled", () => {
    render(<TaskForm onTaskAdded={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "B" },
    });

    expect(screen.getByText("Add Task")).not.toBeDisabled();
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

    expect(screen.getByPlaceholderText("Enter task title").value).toBe("");
  });

  it("shows alert on failure (API responds with not ok)", async () => {
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
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to add task. Please try again."
      );
    });
  });

  it("handles network error (catch block)", async () => {
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
      expect(global.alert).toHaveBeenCalledWith("Failed to connect to server");
    });
  });

  it("shows alert if fields are empty (Defensive Check)", () => {
    render(<TaskForm onTaskAdded={() => {}} />);
    const button = screen.getByText("Add Task");
    fireEvent.click(button);

    expect(global.alert).toHaveBeenCalledWith(
      "Please fill in both title and description"
    );
  });
});
