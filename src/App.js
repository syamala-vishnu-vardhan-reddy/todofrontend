import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null); // Track which todo is being edited
  const [editTask, setEditTask] = useState(''); // Track the edited text
  const apiUrl = 'http://localhost:5000/api/todos'; // Change if your backend URL is different

  // Fetch all tasks from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle adding a new todo
  const addTodo = async () => {
    if (!newTask.trim()) return; // ignore empty input
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask }),
      });
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle completed status
  const toggleCompleted = async (id, completed) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: todoToUpdate.task, 
          completed: !completed 
        }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete a todo by id
  const deleteTodo = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: 500, margin: 'auto' }}>
      <h2>My To-Do List</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: '8px', width: '70%', marginRight: '10px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {todos.map(({ _id, task, completed }) => (
          <li
            key={_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: '#f3f3f3',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={() => toggleCompleted(_id, completed)}
              style={{ marginRight: '10px' }}
            />
            {editId === _id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={e => setEditTask(e.target.value)}
                  style={{ flexGrow: 1, marginRight: '10px', padding: '6px' }}
                />
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`${apiUrl}/${_id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ task: editTask, completed }),
                      });
                      const updatedTodo = await response.json();
                      setTodos(todos.map(todo => todo._id === _id ? updatedTodo : todo));
                      setEditId(null);
                      setEditTask('');
                    } catch (error) {
                      console.error('Error editing todo:', error);
                    }
                  }}
                  style={{
                    backgroundColor: '#2ecc40',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginRight: '5px',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditTask('');
                  }}
                  style={{
                    backgroundColor: '#aaa',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    flexGrow: 1,
                    textDecoration: completed ? 'line-through' : 'none',
                  }}
                >
                  {task}
                </span>
                <button
                  onClick={() => {
                    setEditId(_id);
                    setEditTask(task);
                  }}
                  style={{
                    backgroundColor: '#f1c40f',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginRight: '5px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(_id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
