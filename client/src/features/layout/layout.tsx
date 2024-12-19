import { AuthContext, AuthContextType } from '@/contexts/auth-context';
import { LoadingIndicator } from '@/features/layout/loading-indicator';
import { NavBar } from '@/features/layout/nav-bar';
import { Box, BoxProps } from '@chakra-ui/react';
import { Outlet, useNavigation } from 'react-router-dom';

interface LayoutProps extends BoxProps {
    authContext: AuthContextType;
}

export const Layout: React.FC<LayoutProps> = (props) => {
    const navigation = useNavigation();

    return (
        <AuthContext.Provider value={props.authContext}>
            <Box width={'100%'}>
                <NavBar />
                <Box p={[4, 8]} width="100%">
                    <LoadingIndicator
                        opacity={navigation.state === 'loading' ? 1 : 0}
                        pointerEvents={'none'}
                    />
                    <Outlet />
                </Box>
            </Box>
        </AuthContext.Provider>
    );
};
