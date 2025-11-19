import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";

const mockTask = {
  id: 1,
  name: "Original Name",
  description: "Original Description",
  createdAt: "2023-01-01",
};

describe("TaskCard Component", () => {
  beforeEach(() => {
    global.alert = vi.fn();
  });

  it("renders task details in view mode", () => {
    render(
      <TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />
    );
    expect(screen.getByText("Original Name")).toBeInTheDocument();
  });

  it("switches to edit mode when Edit button is clicked", () => {
    render(
      <TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
  });

  it("calls onEdit with new values when Save is clicked", () => {
    const mockOnEdit = vi.fn();
    render(
      <TaskCard task={mockTask} onComplete={() => {}} onEdit={mockOnEdit} />
    );

    fireEvent.click(screen.getByText("Edit"));

    const titleInput = screen.getByPlaceholderText("Task title");
    const descInput = screen.getByPlaceholderText("Task description");

    fireEvent.change(titleInput, { target: { value: "Updated Name" } });
    fireEvent.change(descInput, { target: { value: "Updated Description" } });

    fireEvent.click(screen.getByText("Save"));

    expect(mockOnEdit).toHaveBeenCalledWith({
      ...mockTask,
      name: "Updated Name",
      description: "Updated Description",
    });
  });

  it("shows error message and prevents save if fields are empty", () => {
    render(
      <TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />
    );

    fireEvent.click(screen.getByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText("Task title"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Task description"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(
      screen.getByText("Title and description are required")
    ).toBeInTheDocument();
    expect(global.alert).not.toHaveBeenCalled();
  });

  it("clears error message when user types", () => {
    render(
      <TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />
    );
    fireEvent.click(screen.getByText("Edit"));

    fireEvent.change(screen.getByPlaceholderText("Task title"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Save"));
    expect(
      screen.getByText("Title and description are required")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Task title"), {
      target: { value: "A" },
    });

    expect(
      screen.queryByText("Title and description are required")
    ).not.toBeInTheDocument();
  });

  it("handles missing description in task prop gracefully", () => {
    const taskNoDesc = { ...mockTask, description: undefined };
    render(
      <TaskCard task={taskNoDesc} onComplete={() => {}} onEdit={() => {}} />
    );
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByPlaceholderText("Task description").value).toBe("");
  });

  it("calls onComplete when Done is clicked", () => {
    const mockOnComplete = vi.fn();
    render(
      <TaskCard task={mockTask} onComplete={mockOnComplete} onEdit={() => {}} />
    );
    fireEvent.click(screen.getByText("Done"));
    expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id);
  });
});
