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

function SignUpForm(props: { onSubmit(): void; }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        props.onSubmit();
        event.preventDefault();
    };
    const classes = useStyles();
    return <>
        <Typography component="h1" variant="h5">
            Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        autoFocus
                        variant="outlined"
                        name="username"
                        label="Username"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        type="password"
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
                    >
                        Sign up
                    </Button>
                </Grid>
            </Grid>
        </form>
    </>;
}

function App() {
    const onSignUp = () => {
        alert('Form submitted.');
    };

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <SignUpForm onSubmit={onSignUp} />
            </div>
        </Container>
    );
}

export default App;
