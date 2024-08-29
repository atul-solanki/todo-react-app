import { createContext, createRef, useContext, useState } from "react"
import { toast } from 'react-toastify';
import axios from "axios";


const TodosContext=createContext();
let uniqueId = 4;

export const useTodosContextValue=()=> useContext(TodosContext);

const CustomTodosContext=({children})=>{
      // State variables
  const [tasks, setTasks] = useState([]);  // Holds the list of tasks
  const [filter, setFilter] = useState('all'); // Holds the current filter type
  const [isLoading, setIsLoading] = useState(true); // Indicates whether the data is being loaded
  const [editTaskId, setEditTaskId] = useState(null);  // Holds the ID of the task being edited
    // Ref variable hold the input value
  const inputRef= createRef();

  // Add a new task
   const handleAddTask = async () => {
      try {
        const inputValue= inputRef.current.value;
  
        if (inputValue.trim() === '') {
          return;
        }
  
        const newTask = {
          title: inputValue,
          completed: false
        };
  
        // Send a POST request to the API endpoint with the new task data
        const response = await axios({
          method: 'post',
          url: 'https://jsonplaceholder.typicode.com/todos',
          data: JSON.stringify(newTask),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        console.log(response);
        response.data.id =Date.now();
        setTasks((prevTasks) => [...prevTasks, response.data]);
        inputRef.current.value = "";
        toast.success('Task added successfully');
      } 
      catch (error) {
        // Log the error to the console
        console.log('Error adding task:', error);
        // Display an error toast notification
        toast.error('Error adding task');
      }
  };

  // fetch todos data
  const fetchTodos = async (url) => {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
        );
      setTasks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching todos:', error);
      setIsLoading(false);
    }
  };
  
  // Update a task
   const handleUpdateTask = async () => {
    
      try {
        const inputValue = inputRef.current.value;
        if (inputValue.trim() === '') {
          return;
        }
  
        const updatedTask = {
          title: inputValue
        };
        const response = await axios({
          method: 'put',
          url: `https://jsonplaceholder.typicode.com/todos/${editTaskId}`,
          data: JSON.stringify(updatedTask),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId ? { ...task, title: response.data.title } : task
          )
        );
        inputRef.current.value = "";
        setEditTaskId(null);
        toast.success('Task updated successfully');
      } catch (error) {
        console.log('Error updating task:', error);
        toast.error('Error updating task');
      }
    };
  
  // Handle checkbox change for a task
   const handleTaskCheckboxChange = (taskId) => {
  setTasks((prevTasks) =>
      prevTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
      )
  );
  };
  
  // Delete a task
   const handleDeleteTask = async (taskId) => {
     await axios({
      method: 'delete',
      url: `https://jsonplaceholder.typicode.com/todos/${taskId}`,
    });
  setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  toast.success('Task deleted successfully');
  };
  
  // Edit a task
   const handleEditTask = (taskId) => {
  setEditTaskId(taskId);
  const taskToEdit = tasks.find((task) => task.id === taskId);
  inputRef.current.value= taskToEdit.title;
  };
  
  // Mark all tasks as completed
   const handleCompleteAll = () => {
  setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
  );
  };
  
  // Clear completed tasks
   const handleClearCompleted = () => {
  setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };
  
  // Handle filter change
   const handleFilterChange = (filterType) => {
  setFilter(filterType);
  };

    // Filter tasks based on the selected filter
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'uncompleted') {
            return !task.completed;
        }
        return true;
    });

    return (
      <TodosContext.Provider
        value={{
          tasks,
          setTasks,
          filter,
          setFilter,
          isLoading,
          setIsLoading,
          editTaskId, 
          setEditTaskId,
          inputRef,
          handleAddTask,
          handleUpdateTask,
          handleTaskCheckboxChange,
          handleDeleteTask,
          handleEditTask,
          handleCompleteAll,
          handleClearCompleted,
          handleFilterChange,
          filteredTasks,
          fetchTodos
        }}
      >
        {children}
    </TodosContext.Provider>
    )
}
 export default CustomTodosContext;