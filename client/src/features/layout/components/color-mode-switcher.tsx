import * as React from 'react';
import { FaMoon } from 'react-icons/fa';

export const ColorModeSwitcher: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
    const text = 'light'; //useColorModeValue('dark', 'light');
    const SwitchIcon = FaMoon; //useColorModeValue(FaMoon, FaSun);

    return (
        <button
            className="text-current text-md p-2"
            //onClick={() => {}}
            aria-label={`Switch to ${text} mode`}
            {...props}
        >
            <SwitchIcon />
        </button>
    );
};
