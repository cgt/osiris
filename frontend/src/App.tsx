import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [message, setMessage] = useState('Awaiting communication with backend');
    useEffect(() => {
        fetch('/api/it-works')
            .then(res => {
                if (res.ok) {
                    setMessage(`Connected to backend: ${res.statusText}`);
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
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    {message}
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
