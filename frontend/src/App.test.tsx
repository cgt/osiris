import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App, SignUpForm } from './App';

test('renders without crashing', () => {
    render(<App />);
});

describe('SignUpForm', () => {
    it('is empty by default', () => {
        render(<SignUpForm onSubmit={() => {}} />);
        expect(screen.getByTestId('sign-up-form')).toHaveFormValues({
            username: '',
            password: '',
        });
        expect(screen.getByRole('button')).toBeEnabled();
    });
    describe('when submitted', () => {
        it('emits onSubmit event with username and password', () => {
            const onSubmitHandler = jest.fn();
            render(<SignUpForm onSubmit={onSubmitHandler} />);

            userEvent.type(screen.getByLabelText(/username/i), 'entered-username');
            userEvent.type(screen.getByLabelText(/password/i), 'entered-password');
            screen.getByRole('button').click();

            expect(onSubmitHandler).toHaveBeenCalledWith({
                username: 'entered-username',
                password: 'entered-password',
            });
        });
    });
});