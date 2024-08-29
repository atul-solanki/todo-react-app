import React from 'react';
import TodosList from './Component/TodosList';
import CustomTodosContext from './Context';

function App() {
  return (
    <CustomTodosContext>
      <TodosList/>
    </CustomTodosContext>
  );
}

export default App;
