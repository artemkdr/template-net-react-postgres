import { LinkHTMLAttributes } from 'react';
import { NavLink } from 'react-router';

interface CustomNavLinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    link: string;
    text: string;
}

export const CustomNavLink: React.FC<CustomNavLinkProps> = (props) => {
    const { link, text, ...rest } = props;
    return (
        <NavLink
            to={link}
            className={({ isActive, isPending }) =>
                (isPending ? 'pending' : isActive ? 'active' : '') +
                ' underline'
            }
            aria-label={text}
            {...rest}
        >
            <span>{text}</span>
        </NavLink>
    );
};
