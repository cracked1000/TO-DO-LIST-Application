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
    void testCompleteTask() {
        Task task = new Task("Task", "Desc");
        task.setId(1);
        when(taskRepo.findById(1)).thenReturn(Optional.of(task));
        when(taskRepo.save(any(Task.class))).thenReturn(task);

        taskService.completeTask(1);

        assertTrue(task.isCompleted());
        verify(taskRepo, times(1)).save(task);
    }
}