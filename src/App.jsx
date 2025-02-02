import React, { useEffect, useState } from 'react'
import config from './db_setup/configuration';
import { getDatabase, ref, onValue, get, set, push, update, remove } from "firebase/database";
import {useRecoilState } from 'recoil';
import { todoState } from './atom/toDoState';

function App() {
  const [todo,setTodos] = useRecoilState(todoState);
  const [updateTod,setUpdateTodo] = useState({});
  const[updateText,setUpdateText]=useState('')
 const [text,setText] =useState('');
 const database = getDatabase(config);
 const collectionRef = ref(database, "toDos");
 useEffect(() => {
 fetchData();
}, []);
const fetchData =()=>{
  try {
    get(collectionRef).then((snapshot)=>{
      if (snapshot.exists()) {
        Object.values(snapshot.val()).map((project) => {
          console.log(snapshot.val());
       
          setTodos((projects) => [...projects,project]);
        });
      }
        })
    
  } catch (error) {
    console.log(error)
    
  }
}

 
const handleDragStart = (e, item, sourceList) => {
  
  e.dataTransfer.setData('item', JSON.stringify(item)); 
  e.dataTransfer.setData('sourceList', sourceList);  
};
const handleDrop = (e, targetList) => {
  e.preventDefault();

  const draggedItem = JSON.parse(e.dataTransfer.getData('item'));  
   
  const sourceList = e.dataTransfer.getData('sourceList');  
  
  if (sourceList === 'progress') {
    update(ref(database,"toDos/"+updateTod.id), {
      text : draggedItem.text,
      status : 'completed',
      id : draggedItem.id
  
    })
      .then((res) => {
        setTodos(todo.filter((item) => item.id !== draggedItem.id));  
      
        setTodos(
          todo.map((item)=>item.id===draggedItem.id ? {
            text : draggedItem.text,
            status : 'completed',
            id  :draggedItem.id
          } : item)
         )
      })
    
    
  } else if (sourceList === 'pending') {
    update(ref(database,"toDos/"+updateTod.id), {
      text : draggedItem.text,
      status : 'completed',
      id : draggedItem.id
  
    })
      .then((res) => {
        setTodos(todo.filter((item) => item.id !== draggedItem.id));  
      
        setTodos(
          todo.map((item)=>item.id===draggedItem.id ? {
            text : draggedItem.text,
            status : 'progress',
            id  :draggedItem.id
          } : item)
         )
      })
  
  }else if(sourceList==='completed'){
    update(ref(database,"toDos/"+updateTod.id), {
      text : draggedItem.text,
      status : 'pending',
      id : draggedItem.id
  
    })
      .then((res) => {
        setTodos(todo.filter((item) => item.id !== draggedItem.id));  
      
        setTodos(
          todo.map((item)=>item.id===draggedItem.id ? {
            text : draggedItem.text,
            status : 'progress',
            id  :draggedItem.id
          } : item)
         )
      })
  
   
  }
};


const handleDragOver = (e) => {
  e.preventDefault();
};
 

const handleUpdate=()=>{
  update(ref(database,"toDos/"+updateTod.id), {
    text : updateText,
    status : updateTod.status,
    id : updateTod.id

  })
    .then((res) => {
      console.log(res)
    
   setTodos(
    todo.map((item)=>item.id===updateTod.id ? {
      text : updateText,
      status : 'pending',
      id : updateTod.id
    } : item)
   )
     setUpdateText('');
    
    })
    .catch((error) => {
      console.error("Error updating data: ", error);
    });
   

}
   
  const handleClick=()=>{
   
    const key = Math.floor(Math.random() * 1000000);
   if(text!=''){
    set(ref(database,"toDos/"+key), {
      text : text,
      status : 'pending',
      id : key
    })
    .then((res) => {
      console.log(res)
      
      console.log("User data has been saved!");
     setTodos((prev)=>[...prev,{
      text : text,
      status : 'pending',
      id : key
    }])
    })
    .catch((error) => {
      console.error("Error writing data: ", error);
    });

      
   }
setText('');
 
   
  }


   

  const deleteTodo=(id)=>{

  

  remove(ref(database,"toDos/"+id))
    .then(() => {
      setTodos((prev)=>prev.filter((item)=>item.id!==id))
      console.log(`success deleted`);
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });

  }

   
  return (
   <div className=' p-10  w-[90vw} mx-auto'>

    <div className='flex flex-col md:flex-row gap-4 justify-around items-center'>
    <div className=' flex gap-2'>
      <input className=' border-1 p-3 rounded-lg border-gray-300' value={text} placeholder='Enter Something' onChange={(e)=>setText(e.target.value)}/>
      <button className=' bg-red-200 p-3 rounded-lg ' onClick={handleClick}>
        Submit
      </button>
    </div>

    <div className=' flex gap-2'>
      <input className=' border-1 p-3 rounded-lg border-gray-300' onChange={(e)=>setUpdateText(e.target.value)} placeholder='Go For Update' defaultValue={updateTod.text}/>
      <button className=' bg-blue-200 p-3 rounded-lg ' onClick={handleUpdate}>
        Update
      </button>
    </div>
    </div>

    <div className='flex flex-col  md:flex-row  justify-between items-center mt-32'> 
      <div className= 'w-[300px]'>
        <div className='text-white bg-purple-400 py-3 text-center rounded-lg'>
To Do List
        </div>

        <div className=' border gap-5 border-gray-400 min-h-[400px] mt-4 rounded-lg p-4' onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'pending')}>
   {
    todo?.map((item,index)=>{
      return (
        item.status === 'pending' && <div draggable key={index} onDragStart={(e)=>handleDragStart(e,item,'pending')}   className=' flex gap-3 cursor-pointer p-2 bg-purple-300 mt-3 rounded-lg' onClick={()=>setUpdateTodo(item)}>
        <div>
         {item.text}
         </div>
         <div onClick={()=>deleteTodo(item.id)}>
          🗑️
           </div>
         </div>
      )
    })
   }
        </div>

      </div>

      <div className= 'w-[300px]'>
        <div className='text-white bg-yellow-400 py-3 text-center rounded-lg'>
In Progress
        </div>

        <div className=' border border-gray-400 min-h-[400px] mt-4 rounded-lg p-4' onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'pending')}>
        {
    todo?.map((item,index)=>{
      return (
        item.status === 'progress' && <div draggable  key={index}  onDragStart={(e) => handleDragStart(e, item, 'progress')} className=' flex gap-3 cursor-pointer p-2 bg-yellow-300 mt-3 rounded-lg' onClick={()=>setUpdateTodo(item)}>
        <div>
         {item.text}
         </div>
         <div onClick={()=>deleteTodo(item.id)}>
          🗑️
           </div>
         </div>
      )
    })
   }
        </div>

      </div>

      <div className= 'w-[300px]'>
        <div className=' text-white bg-green-400 py-3 text-center rounded-lg p-4'>
Completed
        </div>

        <div className=' border border-gray-400 min-h-[400px] mt-4 rounded-lg p-4' onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'pending')}  >
        {
    todo?.map((item,index)=>{
      return (
        item.status === 'completed' && <div draggable key={index}   onDragStart={(e) => handleDragStart(e, item, 'completed')} className=' flex gap-3 cursor-pointer p-2 bg-green-300 mt-3 rounded-lg' onClick={()=>setUpdateTodo(item)}>
        <div>
         {item.text}
         </div>
         <div onClick={()=>deleteTodo(item.id)}>
          🗑️
           </div>
         </div>
      )
    })
   }
        </div>

      </div>
    </div>


   </div>
  )
}

export default App