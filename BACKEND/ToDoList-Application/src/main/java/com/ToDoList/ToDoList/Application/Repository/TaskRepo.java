package com.ToDoList.ToDoList.Application.Repository;

import com.ToDoList.ToDoList.Application.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    List<Task> findTop5ByCompletedFalseOrderByIdDesc();

    long countByCompletedTrue();

    long countByCompletedFalse();
}
