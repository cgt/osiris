import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('Awaiting communication with backend');
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
        <p>{message}</p>
    );
}

export default App;
