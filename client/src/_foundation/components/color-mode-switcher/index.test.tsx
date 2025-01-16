import useColorMode from '@/_foundation/hooks/useColorMode';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ColorModeSwitcher } from './index';

vi.mock('@/_foundation/hooks/useColorMode');

describe('ColorModeSwitcher', () => {
    it('renders the button', () => {
        vi.mocked(useColorMode).mockReturnValue({
            colorMode: 'light',
            toggleColorMode: vi.fn(),
        });

        render(<ColorModeSwitcher />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('displays the correct icon based on color mode', () => {
        vi.mocked(useColorMode).mockReturnValue({
            colorMode: 'light',
            toggleColorMode: vi.fn(),
        });

        render(<ColorModeSwitcher />);
        expect(
            screen.getByLabelText('Switch to dark mode')
        ).toBeInTheDocument();

        vi.mocked(useColorMode).mockReturnValue({
            colorMode: 'dark',
            toggleColorMode: vi.fn(),
        });

        render(<ColorModeSwitcher />);
        expect(
            screen.getByLabelText('Switch to light mode')
        ).toBeInTheDocument();
    });

    it('calls toggleColorMode on button click', () => {
        const toggleColorMode = vi.fn();
        vi.mocked(useColorMode).mockReturnValue({
            colorMode: 'light',
            toggleColorMode,
        });

        render(<ColorModeSwitcher />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(toggleColorMode).toHaveBeenCalledTimes(1);
    });
});
