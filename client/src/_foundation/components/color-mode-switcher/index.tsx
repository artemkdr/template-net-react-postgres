import useColorMode from '@/_foundation/hooks/useColorMode';
import { FaMoon } from 'react-icons/fa';
import { MdSunny } from 'react-icons/md';

export const ColorModeSwitcher: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <button
            className="text-current text-md p-2"
            onClick={() => {
                toggleColorMode();
            }}
            aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
            {...props}
        >
            {colorMode === 'light' ? <FaMoon /> : <MdSunny />}
        </button>
    );
};
