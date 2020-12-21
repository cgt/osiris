import React, { useReducer, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Button, Container, Grid, makeStyles, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
}));

interface LoginParams {
    username: string;
    password: string;
}

interface LoginFormState {
    username: string;
    password: string;
    usernameDirty: boolean;
    passwordDirty: boolean;
}

const initialState: LoginFormState = {
    username: '',
    password: '',
    usernameDirty: false,
    passwordDirty: false,
};

type LoginFormAction =
    | { type: 'setUsername', value: string }
    | { type: 'setPassword', value: string }
    | { type: 'dirty' }

function unreachable(_: never): never {
    throw new Error('unreachable');
}

function reducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
    switch (action.type) {
        case 'setUsername':
            return {...state, username: action.value, usernameDirty: true};
        case 'setPassword':
            return {...state, password: action.value, passwordDirty: true};
        case 'dirty':
            return {...state, usernameDirty: true, passwordDirty: true};
        default:
            return unreachable(action);
    }
}

export function LoginForm(props: { onLogin(data: LoginParams): void; }) {
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({type: 'dirty'});
        if (state.username !== '' && state.password !== '') {
            props.onLogin({username: state.username, password: state.password});
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const classes = useStyles();
    return <>
        <Typography component="h1" variant="h5">
            Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit} data-testid="login-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        autoFocus
                        variant="outlined"
                        id="username-input"
                        data-testid="username-input"
                        name="username"
                        label="Username"
                        value={state.username}
                        onChange={event => dispatch({type: 'setUsername', value: event.target.value})}
                        error={state.usernameDirty && state.username === ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        type="password"
                        id="password-input"
                        data-testid="password-input"
                        name="password"
                        label="Password"
                        value={state.password}
                        onChange={event => dispatch({type: 'setPassword', value: event.target.value})}
                        error={state.passwordDirty && state.password === ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        data-testid="sign-up-button"
                    >
                        Sign up
                    </Button>
                </Grid>
            </Grid>
        </form>
    </>;
}

interface User {
    username: string;
}

export function App() {
    const [user, setUser] = useState<User | undefined>(undefined);
    const onSignUp = (data: LoginParams) => {
        setUser({username: data.username});
    };
    const classes = useStyles();
    return (
        <BrowserRouter>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Switch>
                        <Route path="/">
                            {
                                user === undefined
                                    ? <LoginForm onLogin={onSignUp} />
                                    : <p>Welcome, {user.username}!</p>
                            }
                        </Route>
                    </Switch>
                </div>
            </Container>
        </BrowserRouter>
    );
}