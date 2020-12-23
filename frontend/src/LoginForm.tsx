import React, { useReducer } from 'react';
import { Button, Grid, makeStyles, TextField } from '@material-ui/core';

export interface LoginParams {
    username: string;
    password: string;
}

interface LoginFormState {
    username: string;
    password: string;
    usernameDirty: boolean;
    passwordDirty: boolean;
}

const initialLoginFormState: LoginFormState = {
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

const useStyles = makeStyles(theme => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
}));

export function LoginForm(props: { onLogin(data: LoginParams): void; }) {
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({type: 'dirty'});
        if (state.username !== '' && state.password !== '') {
            props.onLogin({username: state.username, password: state.password});
        }
    };
    const [state, dispatch] = useReducer(reducer, initialLoginFormState);
    const classes = useStyles();
    return <>
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
                    >
                        Log in
                    </Button>
                </Grid>
            </Grid>
        </form>
    </>;
}