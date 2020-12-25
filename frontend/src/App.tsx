import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
import { LoginForm, LoginParams } from './LoginForm';
import { Service } from './Service';

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
    const service = new Service('');
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [backendMessage, setBackendMessage] = useState<string>('Connecting to backend…');
    const onLogin = async (data: LoginParams) => {
        try {
            const {token} = await service.login(data);
            setUser({username: data.username});
            setToken(token);
        } catch (e) {
            alert(e);
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