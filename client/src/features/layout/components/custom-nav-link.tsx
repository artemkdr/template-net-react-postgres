import { Link as ChakraLink, LinkProps, Text } from '@chakra-ui/react';
import { NavLink as ReactRouterLink } from 'react-router-dom';

interface CustomNavLinkProps extends LinkProps {        
    link : string;
    text: string;
}

export const CustomNavLink: React.FC<CustomNavLinkProps> = (props) => {
    const { link, text, ...rest } = props;
    const activeStyle = {fontWeight: 'bold'};

    return (
        <ChakraLink as={ReactRouterLink} to={link} _activeLink={activeStyle} textDecoration={"underline"} {...rest}>
            <Text>{text}</Text>																
        </ChakraLink>
    )
}