package com.ToDoList.ToDoList.Application.Repository;

import com.ToDoList.ToDoList.Application.Model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TaskRepoTest {

    @Autowired
    private TaskRepo taskRepo;

    @BeforeEach
    void setUp() {
        taskRepo.deleteAll();
    }

    @Test
    void testFindTop5ByCompletedFalseOrderByIdDesc() {
        for (int i = 1; i <= 7; i++) {
            Task task = new Task("Task " + i, "Description " + i);
            taskRepo.save(task);
        }

        List<Task> tasks = taskRepo.findTop5ByCompletedFalseOrderByIdDesc();

        assertEquals(5, tasks.size());
        assertEquals("Task 7", tasks.get(0).getName());
    }

    @Test
    void testFindTop5ReturnsOnlyIncompleteTasks() {
        Task task1 = new Task("Task 1", "Description 1");
        Task task2 = new Task("Task 2", "Description 2");
        task2.setCompleted(true);
        Task task3 = new Task("Task 3", "Description 3");

        taskRepo.save(task1);
        taskRepo.save(task2);
        taskRepo.save(task3);

        List<Task> tasks = taskRepo.findTop5ByCompletedFalseOrderByIdDesc();

        assertEquals(2, tasks.size());
        assertFalse(tasks.stream().anyMatch(Task::isCompleted));
    }
}