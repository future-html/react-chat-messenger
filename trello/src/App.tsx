
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Modal from 'react-modal';
// make it waey
// event.stopprop
if (Modal.defaultStyles.overlay) {
  Modal.defaultStyles.overlay.backgroundColor = '#0009'; 
}

interface Column {
  id: number;
  title: string;
  todos: Todo[];
  AddBtn: boolean;
  EditTitleChange: boolean;
}

interface Todo {
  id: number;
  content: string;
  date: Date | null;
  edited: boolean;
}

const TodoList: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnTitle, setColumnTitle] = useState('');
  const [columnInputValues, setColumnInputValues] = useState<{ [columnId: number]: string }>({});
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoContent, setEditTodoContent] = useState('');
  const [editTodoDate, setEditTodoDate] = useState<Date | null>(null); 

  const [showAddButton, setShowAddButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0); 
   
 document.body.style.overflowX = showModal ? 'hidden' : 'scroll';

  const handleAddTask = () => {
    setShowAddButton((prev) => !prev);
  };

  const handleToggleModal = (todoId: number | null, content: String, date: Date | null, columnTitle:string, isButton:boolean) => {
    
    const updatecolumns = [...columns]; 
    console.log(updatecolumns, 'columns');
    
    for (const column of updatecolumns) {
      if (column.title === columnTitle) {
        const Todos = column.todos; 
        for (const Todo of Todos) {
          if (Todo.content === content && Todo.id === todoId && (Todo.date === date)) {
            Todo.edited = !Todo.edited; 
            setEditTodoContent(Todo.content)
          }
        }
     }
    }

    setColumns(updatecolumns); 
    setShowModal(prev => !prev); 
    setEditTodoId(todoId);
    setEditTodoDate(date);
    if (showDatePicker) {
      setShowDatePicker(false); 
    }
    if (isButton) {
      console.log(event); 

      console.log(event?.clientX);
      console.log(event?.clientY);
      
      console.log(event?.target.closest('li').getBoundingClientRect()); 
      setTop(event?.target.closest('li').getBoundingClientRect().top -15); 
      setLeft(event?.target.closest('li').getBoundingClientRect().left -15); 
    }
  };


  const handleColumnTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setColumnTitle(event.target.value);
  };

  const handleAddColumn = () => {
    if (columnTitle.trim() === '') {
      return;
    }

    const newColumn: Column = {
      id: Date.now(),
      title: columnTitle,
      todos: [],
      AddBtn: false,
      EditTitleChange: false,
    };

    setColumns([...columns, newColumn]);
    setColumnTitle('');
    handleAddTask();
     
  };

  const handleCloseAddColumn = () => {
    setShowAddButton(false);
  };

  const handleAddTodo = (columnId: number) => {
    const columnIndex = columns.findIndex((column) => column.id === columnId);

    if (columnIndex === -1) {
      return;
    }

    const content = columnInputValues[columnId] || '';
    if (content) {
      const newTodo: Todo = {
        id: Date.now(),
        content: content,
        date: null,
        edited: false,
      };

      const updatedColumns = [...columns];
      updatedColumns[columnIndex].todos.push(newTodo);
      updatedColumns[columnIndex].AddBtn = false;
      setColumns(updatedColumns);

      console.log(columns);
      setColumnInputValues((prevInputValues) => ({
        ...prevInputValues,
        [columnId]: '',
      }));
    }
    
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLTextAreaElement>, columnId: number) => {
    const content = event.target.value;

    setColumnInputValues((prevInputValues) => ({
      ...prevInputValues,
      [columnId]: content,
    }));
  };

  const handleDeleteTodo = (columnId: number, todoId: number) => {
    const columnIndex = columns.findIndex((column) => column.id === columnId);
    if (columnIndex === -1) {
      return;
    }

    const updatedColumns = [...columns];
    updatedColumns[columnIndex].todos = updatedColumns[columnIndex].todos.filter((todo) => todo.id !== todoId);
    setColumns(updatedColumns);

  };

  const handleOpenDateForm = () => {
    console.log('ok clicked');
    setShowDatePicker(prev => !prev); 
  }

  const handleEditTodo = () => {
    if (!(editTodoContent || editTodoDate)) {
      return; 
    }

    
    const updatedColumns = [...columns];
    for (const column of updatedColumns) {

      const todo = column.todos.find((todo) => todo.id === editTodoId);
      
      console.log(todo, 'todoeditmode'); 
      if (todo) {
        todo.content = editTodoContent;
        todo.edited = !todo.edited; 
        if (editTodoDate) {
          todo.date = editTodoDate;
        }
       
      }
    }

    
     setShowModal(false); 
    
    setColumns(updatedColumns);
    console.log(columns, 'colimnns'); 
    setEditTodoId(null);
    setShowDatePicker(prev => !prev);
  };

  

  

  const handleDragEnd = (result: any) => {
    

    if (!result.destination) return;

    if (result.type === 'column') {
      const updatedColumns = [...columns];
      const [draggedColumn] = updatedColumns.splice(result.source.index, 1);
      updatedColumns.splice(result.destination.index, 0, draggedColumn);
      setColumns(updatedColumns);
    } else if (result.type === 'todo') {
      const sourceColumnIndex = columns.findIndex((column) => `column-${column.id}` === result.source.droppableId);
      const destinationColumnIndex = columns.findIndex((column) => `column-${column.id}` === result.destination.droppableId);
      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) {
        return;
      }

      const sourceColumn = columns[sourceColumnIndex];
      const destinationColumn = columns[destinationColumnIndex];

      const [draggedTodo] = sourceColumn.todos.splice(result.source.index, 1);
      destinationColumn.todos.splice(result.destination.index, 0, draggedTodo);

      const updatedColumns = [...columns];
      updatedColumns[sourceColumnIndex] = sourceColumn;
      updatedColumns[destinationColumnIndex] = destinationColumn;

      setColumns(updatedColumns);
    }
  };

  const handleCloseFormAddTodo = (columnId: number) => {
    const updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex((column) => column.id === columnId);
    updatedColumns[columnIndex].AddBtn = false;
    setColumns(updatedColumns);
  };

  const toggleEditMode = (columnId: number) => {
    const index = columns.findIndex((column) => column.id === columnId);
    const updatedColumns = [...columns];
    updatedColumns[index].EditTitleChange = !updatedColumns[index].EditTitleChange;
    setColumns(updatedColumns);
  };

  const handleAddActivity = (columnId: number) => {
    const updatedColumns = [...columns];
    const columnIndex = updatedColumns.findIndex((column) => column.id === columnId);

    if (columnIndex === -1) {
      return;
    }

    const column = updatedColumns[columnIndex];
    column.AddBtn = true;

    setColumns(updatedColumns);
    console.log(columns);
  };
  console.log(columns); 
  // const allColumnsDroppableId = columns.length > 0 ? columns[0]?.id.toString() : 'all-columns';

  // get index so that it can target the list element 

  return (
    <div id = 'wrap_all'>
      <DragDropContext onDragEnd={handleDragEnd} >
        {<Droppable droppableId={columns[0]?.id.toString()} direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="columns">
              {columns.map((column, columnIndex) => (
                <Draggable key={column.id.toString()} draggableId={`column-${column.id}`} index={columnIndex}>
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div {...provided.dragHandleProps}>
                        {column.EditTitleChange ? (
                          <div id = 'textarea'>
                          <textarea
                            value={column.title}
                            onChange={(e) => {
                              const updatedColumns = [...columns];
                              updatedColumns[columnIndex].title = e.target.value;
                              setColumns(updatedColumns);
                            }}
                            onBlur={() => toggleEditMode(column.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                handleAddTodo(column.id);
                                event.preventDefault(); // Prevent form submission on Enter key press
                              }
                            }}
                          />
                            </div>
                        ) : (
                          <h3 onClick={() => toggleEditMode(column.id)}>{column.title}</h3>
                        )}
                      </div>

                      <Droppable droppableId={`column-${column.id}`} type="todo" direction='vertical'>
                        {(provided) => (
                          <ul {...provided.droppableProps} ref={provided.innerRef} style = {{overflowY:'scroll'}}>
                            {column.todos.map((todo, index) => (
                              <Draggable key={todo.id.toString()} draggableId={`todo-${todo.id}`} index={index}>
                                {(provided) => (
                                  <li 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div id = 'content'
                                      
                                    >
                                      <span>{todo.content}</span>
                                      <div>
                                        {todo.date && <span>{todo.date.toLocaleDateString('en-US')}</span>}
                                        </div>
                                    </div>
                                    {<button onClick={() =>handleToggleModal(todo.id, todo.content, todo.date, column.title, true)} id='click'>Click for mode</button>}
                                    

                                    {todo.edited && <Modal  style={{
                                          content: {
                                           width:'500px', height:'500px',
                                            background: 'transparent', 
                                        border: 'none'
                                        , color: 'white'
                                        , overflowY: 'scroll', 'top': top , 'left':left
                                            
            }
          }} ariaHideApp={false}isOpen={true} onRequestClose={() =>handleToggleModal(todo.id, todo.content, todo.date, column.title, false)}>
                                      
                                      
                                        <textarea value={editTodoContent} onChange={(e) => {
                                          setEditTodoContent(e.target.value)
                                         
                                      }} />   
                                      
                                        <button id='button_two_choices' onClick={handleOpenDateForm}>Edit date</button>
                                        <button onClick={() => handleDeleteTodo(column.id, todo.id)} id='button_two_choices'> Delete</button>
                                      {showDatePicker && <div id='wrap_edit_form'><DatePicker selected={editTodoDate} onChange={(date: Date | null) => setEditTodoDate(date)} minDate={new Date()} placeholderText='Add a date....' />
                                        
                                          
                                          
             </div>}    
                                      
                                        
                                      <div>
                                        <button onClick={handleEditTodo} id = 'button_two_choices'>Save</button>
                                        </div>
                                    </Modal>}
                                    
                                      
                                  
                                   
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {column.AddBtn && (
                              <div id = 'textarea'> 
                              <textarea
                                value={columnInputValues[column.id] || ''}
                                placeholder="Add Todo"
                                onChange={(event) => handleChangeValue(event, column.id)}
                                />
                                </div>
                            )}
                            <div>
                              {column.AddBtn && <button onClick={() => handleAddTodo(column.id)} id = 'button_two_choices'>Add task</button>}
                              {column.AddBtn && <button onClick={() => handleCloseFormAddTodo(column.id)} id = 'button_two_choices'>Cancel</button>}
                            </div>
                            {!column.AddBtn && (
                              <button id='Add_a_card' onClick={() => handleAddActivity(column.id)}>
                                <div id = 'column_add_a_card'> 
                                  <span>+</span> Add a card
                                </div>
                              </button>
                            )}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>}
      </DragDropContext>

      
        

      
      <div className="column-input">
        {showAddButton && <div id = 'textarea'><textarea placeholder=' '  value={columnTitle} onChange={handleColumnTitleChange} /></div>}
        {showAddButton && <button onClick={handleAddColumn} id = 'button_two_choices'>Submit</button>}
        {showAddButton && <button onClick={handleCloseAddColumn} id = 'button_two_choices'>Cancel</button>}
        {!showAddButton &&
          <button onClick={handleAddTask} id='Add_column'>
            <div id = 'column_addtitle'>
              <span>+</span> Add column
            </div>
          
        </button>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <h1>Todo List Trello Clone</h1>
      <TodoList />
    </div>
  );
};

export default App;


// change switch modal to some that only one element will show modal 
// editTitleChange 


