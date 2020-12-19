import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App, SignUpForm } from './App';

test('renders without crashing', () => {
    render(<App />);
});

describe('SignUpForm', () => {
    it('is empty by default', () => {
        render(<SignUpForm onSignUp={() => {}} />);
        expect(screen.getByTestId('sign-up-form')).toHaveFormValues({
            username: '',
            password: '',
        });
        expect(screen.getByLabelText(/username/i)).toHaveAttribute('aria-invalid', 'false');
        expect(screen.getByRole('button')).toBeEnabled();
    });
    describe('when submitted', () => {
        it('emits onSignUp event with username and password', () => {
            const handler = jest.fn();
            render(<SignUpForm onSignUp={handler} />);

            userEvent.type(screen.getByLabelText(/username/i), 'entered-username');
            userEvent.type(screen.getByLabelText(/password/i), 'entered-password');
            screen.getByRole('button').click();

            expect(handler).toHaveBeenCalledWith({
                username: 'entered-username',
                password: 'entered-password',
            });
        });
        describe('given username is empty', () => {
            it('does not emit onSignUp', () => {
                const handler = jest.fn();
                render(<SignUpForm onSignUp={handler} />);

                screen.getByRole('button').click();

                expect(handler).not.toHaveBeenCalled();
            });

            it('shows error', async () => {
                render(<SignUpForm onSignUp={() => {}} />);

                screen.getByRole('button').click();

                await waitFor(() =>
                    expect(screen.getByLabelText(/username/i)).toHaveAttribute('aria-invalid', 'true')
                );
            });
        });
        describe('given password is empty', () => {
            it('does not emit onSignUp', () => {
                const handler = jest.fn();
                render(<SignUpForm onSignUp={handler} />);
                userEvent.type(screen.getByLabelText(/username/i), 'entered-username');

                screen.getByRole('button').click();

                expect(handler).not.toHaveBeenCalled();
            });

            it('shows error', async () => {
                render(<SignUpForm onSignUp={() => {}} />);

                screen.getByRole('button').click();

                await waitFor(() =>
                    expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-invalid', 'true')
                );
            });
        });
    });

    describe('when username entered and then removed', () => {
        it('shows error', async () => {
            render(<SignUpForm onSignUp={() => {}} />);

            const usernameField = screen.getByLabelText(/username/i);
            userEvent.type(usernameField, 'entered-username');
            userEvent.clear(usernameField);

            await waitFor(() =>
                expect(screen.getByLabelText(/username/i)).toHaveAttribute('aria-invalid', 'true')
            );
        });
    });

    describe('when password entered and then removed', () => {
        it('shows error', async () => {
            render(<SignUpForm onSignUp={() => {}} />);

            const passwordField = screen.getByLabelText(/password/i);
            userEvent.type(passwordField, 'entered-password');
            userEvent.clear(passwordField);

            await waitFor(() =>
                expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-invalid', 'true')
            );
        });
    });
});