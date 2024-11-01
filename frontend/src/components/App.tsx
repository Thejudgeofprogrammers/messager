import React from "react"
import { useState, useEffect, useRef } from "react"

import { ITelegramm } from "../types/data"

const App: React.FC = () => {
    const [value, setValue] = useState('');
    const [todos, setTodos] = useState<ITelegramm[]>([]);

    const addTodo = () => {
        setTodos([...todos, {
            id: Date.now(),
            title: value,
        }])
    }

    return <div>
        <div>
            <input value={value} onChange={e => setValue(e.target.value)}/>
            <button onClick={addTodo}>Add</button>
        </div>
    </div>
}

export { App }
