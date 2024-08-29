import React from 'react';
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { useTodosContextValue } from '../Context';

const ToDoTask = ({task}) => {
    const {
      handleDeleteTask, 
      handleEditTask, 
      handleTaskCheckboxChange}=useTodosContextValue();
    return(
      <>
        <li key={task.id}>
          <input
            type="checkbox"
            id={`task-${task.id}`}
            data-id={task.id}
            className="custom-checkbox"
            checked={task.completed}
            onChange={() => handleTaskCheckboxChange(task.id)}
          />
          <label htmlFor={`task-${task.id}`}>{task.title}</label>
          <div>
            < TbEdit 
              className="edit"
              size={32}
              color='blue'
              data-id={task.id}
              onClick={() => handleEditTask(task.id)}
            />
            < MdDelete
              className="delete"
              color='red'
              data-id={task.id}
              onClick={() => handleDeleteTask(task.id)}
            />
          </div>
        </li>
      </>
    )
}
export default ToDoTask;