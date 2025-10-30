import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [{ name: 'Category1', tasks: [] }];
  });

  const [newCategory, setNewCategory] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, { name: newCategory.trim(), tasks: [] }]);
      setNewCategory('');
    }
  };

  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addTask = (index, task) => {
    if (task.trim() === '') return;
    const newCategories = [...categories];
    newCategories[index].tasks.push(task.trim());
    setCategories(newCategories);
  };

  const removeTask = (catIndex, taskIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].tasks.splice(taskIndex, 1);
    setCategories(newCategories);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <div className="theme-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <div className="input-group category-input">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="New category..."
          />
          <button onClick={addCategory}>+</button>
        </div>
      </div>

      <div className="categories-container">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="category-card">
            <div className="category-header">
              <h2>{category.name}</h2>
              <button
                className="delete-category"
                onClick={() => deleteCategory(catIndex)}
              >
                🗑️
              </button>
            </div>

            <TaskInput onAdd={(task) => addTask(catIndex, task)} />

            <ul className="task-list">
              {category.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  {task}{' '}
                  <button onClick={() => removeTask(catIndex, taskIndex)}>✅</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskInput({ onAdd }) {
  const [task, setTask] = useState('');
  return (
    <div className="input-group task-input">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAdd(task);
            setTask('');
          }
        }}
        placeholder="Add task..."
      />
      <button
        onClick={() => {
          onAdd(task);
          setTask('');
        }}
      >
        +
      </button>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import './App.css';

const themes = {
  light: { name: 'Light', className: 'theme-light' },
  dark: { name: 'Dark', className: 'theme-dark' },
  spring: { name: 'Spring', className: 'theme-spring' },
  summer: { name: 'Summer', className: 'theme-summer' },
  autumn: { name: 'Autumn', className: 'theme-autumn' },
  winter: { name: 'Winter', className: 'theme-winter' },
  candy: { name: 'Candy', className: 'theme-candy' },
  ocean: { name: 'Ocean', className: 'theme-ocean' },
};

function App() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [{ name: 'Category1', tasks: [] }];
  });

  const [newCategory, setNewCategory] = useState('');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, { name: newCategory.trim(), tasks: [] }]);
      setNewCategory('');
    }
  };

  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addTask = (index, task) => {
    if (task.trim() === '') return;
    const newCategories = [...categories];
    newCategories[index].tasks.push(task.trim());
    setCategories(newCategories);
  };

  const removeTask = (catIndex, taskIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].tasks.splice(taskIndex, 1);
    setCategories(newCategories);
  };

  return (
    <div className={`App ${themes[theme].className}`}>
      <div className="top-bar">
        <div className="theme-selector">
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            {Object.entries(themes).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group category-input">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="New category..."
          />
          <button onClick={addCategory}>+</button>
        </div>
      </div>

      <div className="categories-container">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="category-card">
            <div className="category-header">
              <h2>{category.name}</h2>
              <button
                className="delete-category"
                onClick={() => deleteCategory(catIndex)}
              >
                🗑️
              </button>
            </div>

            <TaskInput onAdd={(task) => addTask(catIndex, task)} />

            <ul className="task-list">
              {category.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  {task}{' '}
                  <button onClick={() => removeTask(catIndex, taskIndex)}>✅</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskInput({ onAdd }) {
  const [task, setTask] = useState('');
  return (
    <div className="input-group task-input">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAdd(task);
            setTask('');
          }
        }}
        placeholder="Add task..."
      />
      <button
        onClick={() => {
          onAdd(task);
          setTask('');
        }}
      >
        +
      </button>
    </div>
  );
}

export default App;









