import Login from '@/app/pages/login';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { mockedUseNavigate } from '@/tests/setup';
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it } from 'vitest';

describe('<Login />', () => {
    it('renders Login page', async () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const loginInput = container.querySelector('#login');
        const passwordInput = container.querySelector('#password');
        const button = await screen.getByRole('button');
        expect(loginInput).not.toBeNull();
        expect(passwordInput).not.toBeNull();
        expect(button).not.toBeNull();
    });

    it('shows a login error on other than 401 error', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const button = await screen.getByRole('button');

        await act(() => {
            fireEvent.click(button);
        });
        const error = await screen.getByText('Message.LoginError');
        expect(error).not.toBeNull();
    });

    it('shows a credentials error on wrong credentials', async () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const loginInput = container.querySelector('#login');
        const passwordInput = container.querySelector('#password');
        const button = await screen.getByRole('button');

        fireEvent.change(loginInput as Element, { target: { value: 'test' } });
        fireEvent.change(passwordInput as Element, {
            target: { value: 'test' },
        });
        await act(() => {
            fireEvent.click(button);
        });
        const error = await screen.getByText(
            'Message.LoginErrorWrongCredentials'
        );
        expect(error).not.toBeNull();
    });

    it('logins user on correct credentials', async () => {
        const { container } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        const loginInput = container.querySelector('#login');
        const passwordInput = container.querySelector('#password');
        const button = await screen.getByRole('button');

        fireEvent.change(loginInput as Element, { target: { value: 'user1' } });
        fireEvent.change(passwordInput as Element, {
            target: { value: 'password1' },
        });
        await act(() => {
            fireEvent.click(button);
        });
        await waitFor(() => {
            expect(mockedUseNavigate).toHaveBeenCalledWith(
                document.location.pathname + document.location.search
            );
            expect(useAuthStore.getState().isLoggedIn).toEqual(true);
            expect(useAuthStore.getState().getUserName()).toEqual('user1');
        });
    });
});
