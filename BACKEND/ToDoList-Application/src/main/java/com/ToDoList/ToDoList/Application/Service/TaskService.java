package com.ToDoList.ToDoList.Application.Service;

import com.ToDoList.ToDoList.Application.Model.Task;
import com.ToDoList.ToDoList.Application.Repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepo taskRepo;

    public List<Task> getRecentTasks() {
        return taskRepo.findTop5ByCompletedFalseOrderByIdDesc();
    }

    public Task addTask(Task task) {
        task.setCompleted(false);
        return taskRepo.save(task);
    }

    public Task updateTask(int id, Task task) {
        Optional<Task> existingTaskOptional = taskRepo.findById(id);

        if (existingTaskOptional.isPresent()) {
            Task existingTask = existingTaskOptional.get();
            existingTask.setName(task.getName());
            existingTask.setDescription(task.getDescription());
            
            return taskRepo.save(existingTask);
        } else {
            throw new RuntimeException("Task not found with id: " + id);
        }
    }

    public void completeTask(int id) {
        Optional<Task> taskOptional = taskRepo.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setCompleted(true);
            taskRepo.save(task);
        } else {
            throw new RuntimeException("Task not found with id: " + id);
        }
    }
}