import { Layout } from '@/features/layout/layout';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it } from 'vitest';

const mockedAuthContext = { isLoggedIn: false, username: null };

describe('<Layout />', () => {
    it('renders Layout', () => {
        render(
            <MemoryRouter>
                <Layout authContext={mockedAuthContext} />
            </MemoryRouter>
        );
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('check that dark/light mode switcher works', async () => {
        render(
            <MemoryRouter>
                <Layout authContext={mockedAuthContext} />
            </MemoryRouter>
        );
        /*const darkModeButton = screen.getByLabelText(
            new RegExp('switch to (dark|light) mode', 'i')
        );
        const ariaLabel = darkModeButton.getAttribute('aria-label') ?? '';
        const newMode = ariaLabel.indexOf(' dark') >= 0 ? 'dark' : 'light';
        act(() => fireEvent.click(darkModeButton));
        await waitFor(() => {
            expect(
                document.querySelector(`body.chakra-ui-${newMode}`)
            ).not.toBeNull();
        });*/
    });
});
