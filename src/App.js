// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old data format to new format with subcategories
        return parsed.map(cat => ({
          ...cat,
          subcategories: cat.subcategories || [],
          tasks: cat.tasks || []
        }));
      } catch (e) {
        console.error('Error loading categories:', e);
        return [
          { name: 'Personal', subcategories: [], tasks: [] },
          { name: 'Work', subcategories: [], tasks: [] }
        ];
      }
    }
    return [
      { name: 'Personal', subcategories: [], tasks: [] },
      { name: 'Work', subcategories: [], tasks: [] }
    ];
  });
  const [newCategory, setNewCategory] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = localStorage.getItem('layoutMode');
    return saved || 'horizontal';
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  // Save to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Save to localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save to localStorage whenever layoutMode changes
  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, { name: newCategory.trim(), subcategories: [], tasks: [] }]);
      setNewCategory('');
    }
  };

  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index, newName) => {
    if (newName.trim() === '') return;
    const newCategories = [...categories];
    newCategories[index].name = newName.trim();
    setCategories(newCategories);
    setEditingCategory(null);
  };

  const addSubcategory = (catIndex, subName) => {
    if (subName.trim() === '') return;
    const newCategories = [...categories];
    newCategories[catIndex].subcategories.push({ name: subName.trim(), tasks: [] });
    setCategories(newCategories);
  };

  const deleteSubcategory = (catIndex, subIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].subcategories.splice(subIndex, 1);
    setCategories(newCategories);
  };

  const updateSubcategoryName = (catIndex, subIndex, newName) => {
    if (newName.trim() === '') return;
    const newCategories = [...categories];
    newCategories[catIndex].subcategories[subIndex].name = newName.trim();
    setCategories(newCategories);
    setEditingSubcategory(null);
  };

  const addTask = (catIndex, task, subIndex = null) => {
    if (task.trim() === '') return;
    const newCategories = [...categories];
    const newTask = { text: task.trim(), completed: false };
    
    if (subIndex !== null) {
      newCategories[catIndex].subcategories[subIndex].tasks.push(newTask);
    } else {
      newCategories[catIndex].tasks.push(newTask);
    }
    setCategories(newCategories);
  };

  const removeTask = (catIndex, taskIndex, subIndex = null) => {
    const newCategories = [...categories];
    if (subIndex !== null) {
      newCategories[catIndex].subcategories[subIndex].tasks.splice(taskIndex, 1);
    } else {
      newCategories[catIndex].tasks.splice(taskIndex, 1);
    }
    setCategories(newCategories);
  };

  const toggleTask = (catIndex, taskIndex, subIndex = null) => {
    const newCategories = [...categories];
    if (subIndex !== null) {
      newCategories[catIndex].subcategories[subIndex].tasks[taskIndex].completed = 
        !newCategories[catIndex].subcategories[subIndex].tasks[taskIndex].completed;
    } else {
      newCategories[catIndex].tasks[taskIndex].completed = 
        !newCategories[catIndex].tasks[taskIndex].completed;
    }
    setCategories(newCategories);
  };

  const updateTaskText = (catIndex, taskIndex, newText, subIndex = null) => {
    if (newText.trim() === '') return;
    const newCategories = [...categories];
    if (subIndex !== null) {
      newCategories[catIndex].subcategories[subIndex].tasks[taskIndex].text = newText.trim();
    } else {
      newCategories[catIndex].tasks[taskIndex].text = newText.trim();
    }
    setCategories(newCategories);
    setEditingTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTaskDragStart = (catIndex, taskIndex, subIndex = null) => {
    setDraggedTask({ catIndex, taskIndex, subIndex });
  };

  const handleTaskDrop = (targetCatIndex, targetTaskIndex, targetSubIndex = null) => {
    if (!draggedTask) return;
    
    const newCategories = [...categories];
    let sourceTask;
    
    // Get source task
    if (draggedTask.subIndex !== null) {
      sourceTask = newCategories[draggedTask.catIndex].subcategories[draggedTask.subIndex].tasks[draggedTask.taskIndex];
      newCategories[draggedTask.catIndex].subcategories[draggedTask.subIndex].tasks.splice(draggedTask.taskIndex, 1);
    } else {
      sourceTask = newCategories[draggedTask.catIndex].tasks[draggedTask.taskIndex];
      newCategories[draggedTask.catIndex].tasks.splice(draggedTask.taskIndex, 1);
    }
    
    // Add to target
    if (targetSubIndex !== null) {
      if (targetTaskIndex === null) {
        newCategories[targetCatIndex].subcategories[targetSubIndex].tasks.push(sourceTask);
      } else {
        newCategories[targetCatIndex].subcategories[targetSubIndex].tasks.splice(targetTaskIndex, 0, sourceTask);
      }
    } else {
      if (targetTaskIndex === null) {
        newCategories[targetCatIndex].tasks.push(sourceTask);
      } else {
        newCategories[targetCatIndex].tasks.splice(targetTaskIndex, 0, sourceTask);
      }
    }
    
    setCategories(newCategories);
    setDraggedTask(null);
  };

  const handleCategoryDragStart = (index) => {
    setDraggedCategory(index);
  };

  const handleCategoryDrop = (targetIndex) => {
    if (draggedCategory === null || draggedCategory === targetIndex) return;
    
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(draggedCategory, 1);
    newCategories.splice(targetIndex, 0, movedCategory);
    
    setCategories(newCategories);
    setDraggedCategory(null);
  };

  const getTotalTaskCount = (category) => {
    let total = category.tasks ? category.tasks.length : 0;
    if (category.subcategories) {
      category.subcategories.forEach(sub => {
        total += sub.tasks ? sub.tasks.length : 0;
      });
    }
    return total;
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <div className="top-bar-left">
          <h1>📋 Task Manager</h1>
          <div className="button-group">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="layout-toggle"
              onClick={() => setLayoutMode(layoutMode === 'horizontal' ? 'grid' : 'horizontal')}
              title="Toggle layout"
            >
              {layoutMode === 'horizontal' ? '📊' : '📏'}
            </button>
          </div>
        </div>
        
        <div className="category-input-wrapper">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="New category name..."
            className="category-input"
          />
          <button onClick={addCategory} className="add-category-btn">
            + Add Category
          </button>
        </div>
      </div>

      <div className={`categories-container ${layoutMode}`}>
        {categories.map((category, catIndex) => (
          <div
            key={catIndex}
            draggable
            onDragStart={() => handleCategoryDragStart(catIndex)}
            onDragOver={handleDragOver}
            onDrop={() => handleCategoryDrop(catIndex)}
            className={`category-card ${draggedCategory === catIndex ? 'dragging' : ''}`}
          >
            <div className="category-header">
              <div className="category-title-wrapper">
                {editingCategory === catIndex ? (
                  <input
                    type="text"
                    defaultValue={category.name}
                    autoFocus
                    onBlur={(e) => updateCategoryName(catIndex, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateCategoryName(catIndex, e.target.value);
                      if (e.key === 'Escape') setEditingCategory(null);
                    }}
                    className="category-name-edit"
                  />
                ) : (
                  <>
                    <h2 
                      className="category-name"
                      onDoubleClick={() => setEditingCategory(catIndex)}
                      title="Double-click to edit"
                    >
                      {category.name}
                    </h2>
                    <span className="task-count">{getTotalTaskCount(category)}</span>
                  </>
                )}
              </div>
              <button
                onClick={() => deleteCategory(catIndex)}
                className="delete-category"
                title="Delete category"
              >
                🗑️
              </button>
            </div>

            <TaskInput 
              onAdd={(task) => addTask(catIndex, task)}
              darkMode={darkMode}
              placeholder="Add task to category..."
            />

            <div 
              className="task-list"
              onDragOver={handleDragOver}
              onDrop={() => handleTaskDrop(catIndex, null)}
            >
              {category.tasks.length === 0 && category.subcategories.length === 0 ? (
                <p className="empty-state">No tasks or subcategories yet</p>
              ) : (
                <>
                  {category.tasks.map((task, taskIndex) => (
                    <TaskItem
                      key={taskIndex}
                      task={task}
                      onToggle={() => toggleTask(catIndex, taskIndex)}
                      onDelete={() => removeTask(catIndex, taskIndex)}
                      onDragStart={() => handleTaskDragStart(catIndex, taskIndex)}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleTaskDrop(catIndex, taskIndex);
                      }}
                      onEdit={(newText) => updateTaskText(catIndex, taskIndex, newText)}
                      isEditing={editingTask?.catIndex === catIndex && editingTask?.taskIndex === taskIndex && editingTask?.subIndex === null}
                      setEditing={() => setEditingTask({ catIndex, taskIndex, subIndex: null })}
                      isDragging={draggedTask?.catIndex === catIndex && draggedTask?.taskIndex === taskIndex && draggedTask?.subIndex === null}
                      darkMode={darkMode}
                    />
                  ))}

                  {category.subcategories.map((subcategory, subIndex) => (
                    <div key={`sub-${subIndex}`} className="subcategory">
                      <div className="subcategory-header">
                        <div className="subcategory-title-wrapper">
                          {editingSubcategory?.catIndex === catIndex && editingSubcategory?.subIndex === subIndex ? (
                            <input
                              type="text"
                              defaultValue={subcategory.name}
                              autoFocus
                              onBlur={(e) => updateSubcategoryName(catIndex, subIndex, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') updateSubcategoryName(catIndex, subIndex, e.target.value);
                                if (e.key === 'Escape') setEditingSubcategory(null);
                              }}
                              className="subcategory-name-edit"
                            />
                          ) : (
                            <>
                              <h3 
                                className="subcategory-name"
                                onDoubleClick={() => setEditingSubcategory({ catIndex, subIndex })}
                                title="Double-click to edit"
                              >
                                📁 {subcategory.name}
                              </h3>
                              <span className="subcategory-count">{subcategory.tasks.length}</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => deleteSubcategory(catIndex, subIndex)}
                          className="delete-subcategory"
                          title="Delete subcategory"
                        >
                          ✕
                        </button>
                      </div>

                      <TaskInput 
                        onAdd={(task) => addTask(catIndex, task, subIndex)}
                        darkMode={darkMode}
                        placeholder="Add task to subcategory..."
                        small
                      />

                      <div 
                        className="subcategory-tasks"
                        onDragOver={handleDragOver}
                        onDrop={() => handleTaskDrop(catIndex, null, subIndex)}
                      >
                        {subcategory.tasks.length === 0 ? (
                          <p className="empty-state-small">No tasks</p>
                        ) : (
                          subcategory.tasks.map((task, taskIndex) => (
                            <TaskItem
                              key={taskIndex}
                              task={task}
                              onToggle={() => toggleTask(catIndex, taskIndex, subIndex)}
                              onDelete={() => removeTask(catIndex, taskIndex, subIndex)}
                              onDragStart={() => handleTaskDragStart(catIndex, taskIndex, subIndex)}
                              onDrop={(e) => {
                                e.stopPropagation();
                                handleTaskDrop(catIndex, taskIndex, subIndex);
                              }}
                              onEdit={(newText) => updateTaskText(catIndex, taskIndex, newText, subIndex)}
                              isEditing={editingTask?.catIndex === catIndex && editingTask?.taskIndex === taskIndex && editingTask?.subIndex === subIndex}
                              setEditing={() => setEditingTask({ catIndex, taskIndex, subIndex })}
                              isDragging={draggedTask?.catIndex === catIndex && draggedTask?.taskIndex === taskIndex && draggedTask?.subIndex === subIndex}
                              darkMode={darkMode}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <SubcategoryInput 
              onAdd={(name) => addSubcategory(catIndex, name)}
              darkMode={darkMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskInput({ onAdd, darkMode, placeholder = "Add a task...", small = false }) {
  const [task, setTask] = useState('');

  const handleAdd = () => {
    if (task.trim()) {
      onAdd(task);
      setTask('');
    }
  };

  return (
    <div className={`task-input-wrapper ${small ? 'small' : ''}`}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
        }}
        placeholder={placeholder}
        className="task-input"
      />
      <button onClick={handleAdd} className="add-task-btn">
        +
      </button>
    </div>
  );
}

function SubcategoryInput({ onAdd, darkMode }) {
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name);
      setName('');
      setShowInput(false);
    }
  };

  if (!showInput) {
    return (
      <button 
        className="add-subcategory-btn"
        onClick={() => setShowInput(true)}
      >
        + Add Subcategory
      </button>
    );
  }

  return (
    <div className="subcategory-input-wrapper">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') {
            setShowInput(false);
            setName('');
          }
        }}
        placeholder="Subcategory name..."
        className="subcategory-input"
        autoFocus
      />
      <button onClick={handleAdd} className="add-task-btn">
        +
      </button>
      <button 
        onClick={() => {
          setShowInput(false);
          setName('');
        }} 
        className="cancel-btn"
      >
        ✕
      </button>
    </div>
  );
}

function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onDragStart, 
  onDrop, 
  onEdit, 
  isEditing, 
  setEditing, 
  isDragging,
  darkMode 
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-content">
        <button
          onClick={onToggle}
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        >
          {task.completed && <span className="checkmark">✓</span>}
        </button>
        {isEditing ? (
          <input
            type="text"
            defaultValue={task.text}
            autoFocus
            onBlur={(e) => onEdit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEdit(e.target.value);
              if (e.key === 'Escape') setEditing(null);
            }}
            className="task-text-edit"
          />
        ) : (
          <span 
            className="task-text"
            onDoubleClick={setEditing}
            title="Double-click to edit"
          >
            {task.text}
          </span>
        )}
      </div>
      <button
        onClick={onDelete}
        className="delete-task"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}

export default App;