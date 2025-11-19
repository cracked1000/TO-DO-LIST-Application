package com.ToDoList.ToDoList.Application.Service;

import com.ToDoList.ToDoList.Application.Model.Task;
import com.ToDoList.ToDoList.Application.Repository.TaskRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepo taskRepo;

    @InjectMocks
    private TaskService taskService;

    @Test
    void testGetRecentTasks() {
        Task task1 = new Task("Task 1", "Desc 1");
        Task task2 = new Task("Task 2", "Desc 2");
        when(taskRepo.findTop5ByCompletedFalseOrderByIdDesc()).thenReturn(Arrays.asList(task1, task2));
        List<Task> result = taskService.getRecentTasks();
        assertEquals(2, result.size());
        verify(taskRepo, times(1)).findTop5ByCompletedFalseOrderByIdDesc();
    }

    @Test
    void testAddTask() {
        Task task = new Task("New Task", "Desc");
        when(taskRepo.save(any(Task.class))).thenReturn(task);
        Task created = taskService.addTask(task);
        assertNotNull(created);
        assertFalse(created.isCompleted());
        verify(taskRepo, times(1)).save(task);
    }

    @Test
    void testUpdateTask_Success() {
        Task existingTask = new Task("Old Name", "Old Desc");
        existingTask.setId(1);
        Task updates = new Task("New Name", "New Desc");
        when(taskRepo.findById(1)).thenReturn(Optional.of(existingTask));
        when(taskRepo.save(any(Task.class))).thenReturn(existingTask);
        Task result = taskService.updateTask(1, updates);
        assertEquals("New Name", result.getName());
        assertEquals("New Desc", result.getDescription());
        verify(taskRepo, times(1)).save(existingTask);
    }

    @Test
    void testUpdateTask_NotFound() {
        when(taskRepo.findById(99)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            taskService.updateTask(99, new Task("Name", "Desc"));
        });
        assertEquals("Task not found with id: 99", exception.getMessage());
        verify(taskRepo, times(0)).save(any(Task.class));
    }

    @Test
    void testCompleteTask_Success() {
        Task task = new Task("Task", "Desc");
        task.setId(1);
        task.setCompleted(false);

        when(taskRepo.findById(1)).thenReturn(Optional.of(task));
        when(taskRepo.save(any(Task.class))).thenReturn(task);
        taskService.completeTask(1);
        assertTrue(task.isCompleted());
        verify(taskRepo, times(1)).save(task);
    }

    @Test
    void testCompleteTask_NotFound() {
        when(taskRepo.findById(99)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            taskService.completeTask(99);
        });
        assertEquals("Task not found with id: 99", exception.getMessage());
        verify(taskRepo, times(0)).save(any(Task.class));
    }
}