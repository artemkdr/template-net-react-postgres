import {
    AuthContext,
    AuthContextType,
} from '@/_foundation/contexts/auth-context';
import { LoadingIndicator } from '@/features/layout/loading-indicator';
import { NavBar } from '@/features/layout/nav-bar';
import { Outlet, useNavigation } from 'react-router';

interface LayoutProps {
    authContext: AuthContextType;
}

export const Layout: React.FC<LayoutProps> = (props) => {
    const navigation = useNavigation();

    return (
        <AuthContext.Provider value={props.authContext}>
            <div className="w-full">
                <NavBar />
                <div className="w-full p-4">
                    <div
                        aria-busy={
                            navigation.state === 'loading' ? 'true' : 'false'
                        }
                        className={`${navigation.state === 'loading' ? 'visible' : 'invisible'} pointer-events-none`}
                    >
                        <LoadingIndicator />
                    </div>
                    <Outlet />
                </div>
            </div>
        </AuthContext.Provider>
    );
};
