import { useState } from "react";

const initialList = [
  { id: 1, text: "this is first list" },
  { id: 1, text: "this is first list" }
]

export default function ToDoApp() {
  const [list, setList] = useState(initialList);
  const [input, setInput] = useState("");

  const addToDo = () => {
    setList([
      ...list,
      { id: Date.now(), text: input }
    ])
  }

  return (
    <div>
      <h1>to do list</h1>
      <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.vakue)} style={{
          flex: 1, padding: "10px 14px",
          fontSize: 15, border: "1px solid #ddd", borderRadius: 8, outline: "none"
        }} />
        <button onClick={addToDo}>+ Add</button>
      </div>
      <div>
        {list.map((task) =>  <div key={task.id}>{task.text}</div>)}
      </div>
    </div>
  )



}