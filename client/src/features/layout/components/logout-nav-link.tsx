import { Link as ChakraLink, LinkProps } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { NavLink as ReactRouterLink } from 'react-router-dom';

interface LogoutNavLinkProps extends LinkProps {
    link: string;
}

export const LogoutNavLink: React.FC<LogoutNavLinkProps> = (props) => {
    const { link, ...rest } = props;

    return (
        <ChakraLink
            as={ReactRouterLink}
            to={link}
            aria-label="logout"
            {...rest}
        >
            <MdLogout size={'1.2rem'} />
        </ChakraLink>
    );
};
