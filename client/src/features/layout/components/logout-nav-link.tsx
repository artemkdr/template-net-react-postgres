import { LinkHTMLAttributes } from 'react';
import { MdLogout } from 'react-icons/md';
import { Link } from 'react-router';

interface LogoutNavLinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    link: string;
}

export const LogoutNavLink: React.FC<LogoutNavLinkProps> = (props) => {
    const { link, ...rest } = props;

    return (
        <Link to={link} aria-label="logout" {...rest}>
            <MdLogout size={'1.2rem'} />
        </Link>
    );
};
