import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
import { LoginForm, LoginParams } from './LoginForm';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

interface User {
    username: string;
}

export function App() {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [backendMessage, setBackendMessage] = useState<string>('Connecting to backend…');
    const onLogin = async (data: LoginParams) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            setUser({username: data.username});
            const responseBody = await response.json();
            setToken(responseBody.token);
        } else {
            alert(`Something evil happened: ${response.status} ${response.statusText}`);
        }
    };
    useEffect(() => {
        if (token !== undefined) {
            fetch('/api/it-works', {headers: {'Authorization': `Bearer ${token}`}}).then(response => {
                response.text().then(msg => {
                    setBackendMessage(msg);
                });
            });
        }
    }, [token]);
    const classes = useStyles();
    return (
        <BrowserRouter>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Switch>
                        <Route path="/">
                            {
                                user === undefined
                                    ? <LoginForm onLogin={onLogin} />
                                    : <p>Welcome, {user.username}! {backendMessage}</p>
                            }
                        </Route>
                    </Switch>
                </div>
            </Container>
        </BrowserRouter>
    );
}