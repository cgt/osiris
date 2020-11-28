import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Awaiting communication with backend');
    const [todo, setTodo] = useState('');
    useEffect(() => {
        fetch('/api/it-works')
            .then(res => {
                if (res.status === 418) {
                    return res.text().then(message => {
                        setMessage(`Connected to backend: ${message}`);
                    });
                } else {
                    setMessage(`Unexpected response from backend: ${res.statusText}`);
                }
            })
            .catch(err => {
                setMessage(`Error connecting to backend: ${err}`);
            });
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    {message}
                </p>

                <input type="text" id="new-item" value={todo} onChange={event => setTodo(event.target.value)} />
                <div id="todos">{todo}</div>
            </header>
        </div>
    );
}

export default App;
