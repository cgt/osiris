import React, { useState } from 'react';
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

interface SignUpParams {
    username: string;
    password: string;
}

export function SignUpForm(props: { onSignUp(data: SignUpParams): void; }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dirty, setDirty] = useState(false);
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setDirty(true);
        if (username !== '') {
            props.onSignUp({username, password});
        }
        event.preventDefault();
    };
    const classes = useStyles();
    return <>
        <Typography component="h1" variant="h5">
            Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit} data-testid="sign-up-form">
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
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                        error={dirty && username === ''}
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
                        value={password}
                        onChange={event => setPassword(event.target.value)}
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

export function App() {
    const onSignUp = (data: SignUpParams) => {
        alert(`Sign up with ${JSON.stringify(data)}`);
    };

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <SignUpForm onSignUp={onSignUp} />
            </div>
        </Container>
    );
}