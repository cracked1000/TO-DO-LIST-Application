package com.ToDoList.ToDoList.Application.Service;

import com.ToDoList.ToDoList.Application.Model.Task;
import com.ToDoList.ToDoList.Application.Repository.TaskRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepo taskRepo;

    public TaskService(TaskRepo taskRepo) {
        this.taskRepo = taskRepo;
    }

    public List<Task> getRecentTasks() {
        return taskRepo.findTop5ByCompletedFalseOrderByIdDesc();
    }

    @Transactional
    public Task addTask(Task task) {
        task.setCompleted(false);
        return taskRepo.save(task);
    }

    @Transactional
    public Task updateTask(int id, Task task) {
        Task existingTask = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        existingTask.setName(task.getName());
        existingTask.setDescription(task.getDescription());

        return taskRepo.save(existingTask);
    }

    @Transactional
    public void completeTask(int id) {
        Task task = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setCompleted(true);
        taskRepo.save(task);
    }
}