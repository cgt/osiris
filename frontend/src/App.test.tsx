import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { SignUpForm } from './App';

test('renders without crashing', () => {
    render(<App />);
});

describe('SignUpForm', () => {
    it('is empty by default', () => {
        render(<SignUpForm onSubmit={() => {}} />);
        expect(screen.getByTestId('username-input')).not.toHaveValue();
        expect(screen.getByTestId('password-input')).not.toHaveValue();
    });
    describe('submit button', () => {
        it('is enabled by default', () => {
            render(<SignUpForm onSubmit={() => {}} />);
            expect(screen.getByRole('button')).toBeEnabled();
        });
    });
});