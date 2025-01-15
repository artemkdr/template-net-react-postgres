import {
    AuthContext,
    AuthContextType,
    useAuthContext,
} from '@/_foundation/contexts/auth-context';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

describe('useAuthContext', () => {
    it('should be able to use context in a component wrapped by AuthContext.Provider', () => {
        const authContext: AuthContextType = {
            isLoggedIn: true,
            username: 'test-user',
        };
        const TestComponent = () => {
            const context = useAuthContext();
            return context.isLoggedIn && <div>{context.username}</div>;
        };
        render(
            <AuthContext.Provider value={authContext}>
                <TestComponent />
            </AuthContext.Provider>
        );
        expect(screen.getByText('test-user')).toBeInTheDocument();
    });

    it('throws an error on useAuthContext where there is no AuthContext.Provider', () => {
        const TestComponent = () => {
            const context = useAuthContext();
            return context.isLoggedIn && <div>{context.username}</div>;
        };
        expect(() => render(<TestComponent />)).toThrow(
            'useAuthContext must be used within an AuthContext.Provider'
        );
    });
});
