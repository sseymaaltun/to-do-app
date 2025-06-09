import './App.css';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  // todos değiştiğinde localStorage'a kaydet
  useEffect(() => {
    console.log("todos güncellendi:", todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() === "") return; // boşsa eklemesin

    setTodos([...todos, { text: input, completed: false }]); // mevcut todos dizisine yenisini ekle
    setInput(""); // input'u temizle
    toast.success("Todo added!");
  }

  function deleteTodo(indexToDelete){
    const newTodos = todos.filter((_,index) => index !== indexToDelete); // Yani "silmek istediğim eleman değilse, listede tut. filter() ile bir elemanı index’e göre listeden çıkarıyoruz.
    setTodos(newTodos); //todos listesi güncelleniyor
    toast.warning("Todo deleted!");
  }

// 1. Her todo elemanına bak.
// 2. Eğer tıklanan index’teki eleman ise:
//   - completed değerini tersine çevir.
// 3. Değilse olduğu gibi bırak.
// 4. Yeni diziyi state’e ata.

//toggleComplete, belirli bir index’teki todo’nun tamamlandı durumunu tersine çeviriyor.
// Yani mesela completed değeri:
// false ise → true yapıyor
// true ise → false yapıyor
  function toggleCompleted(indexToToggle) {
    const updateTodos = todos.map((todo, index) =>{
      if (index === indexToToggle) {
        return {...todo, completed: !todo.completed}
      } 
      return todo;
    })
    setTodos(updateTodos);
    toast.info("Todo done!");
  }

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input 
      type='text'
      value={input} 
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addTodo()}
      placeholder='To do...' /> 
      {/* onChange eventi, kullanıcı her yazdığında yeni değeri bir event nesnesi içinde gönderir. Senin bu değeri e.target.value ile yakalaman gerekiyor. e = event nesnesi e.target = hangi element tetiklendiyse (burada input) e.target.value = input’un içindeki yeni yazılan değer*/}

      <button onClick={addTodo}>ADD</button>
      
      <ul>
        {/* (todo, index) => (...)map içindeki fonksiyon iki parametre alır:todo → o anki eleman (örneğin 'Kitap oku')index → o elemanın listedeki sırası (örneğin 0, 1, 2...) */}
          {
            todos.map((todo,index) => {
              return (<li key={index}>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => toggleCompleted(index)} />
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(index)}>DELETE</button> 
                {/* Böylece index parametresini istediğimiz şekilde dinamik olarak göndermiş oluyoruz.Parametreli fonksiyon çağırmak için mutlaka ok fonksiyonu kullanılır. */}
              </li>)
            })
          }
      </ul>
      {<ToastContainer />}
    </div>
  );
}

export default App;
