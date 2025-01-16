import { useAuthContext } from '@/_foundation/contexts/auth-context';
import { ColorModeSwitcher } from '@/features/layout/components/color-mode-switcher';
import { CustomNavLink } from '@/features/layout/components/custom-nav-link';
import { LogoutNavLink } from '@/features/layout/components/logout-nav-link';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const NavBar = (): ReactElement => {
    const colorMode = 'light';
    const { t, i18n } = useTranslation();
    const { isLoggedIn, username } = useAuthContext();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div
            data-testid="navbar"
            className="flex items-center justify-between border-b border-solid shadow-sm  text-xs w-full overflow-x-auto sm:px-4 sm:py-4 sm:text-sm"
            style={{
                borderColor: colorMode === 'light' ? 'gray.100' : 'gray.900',
            }}
        >
            <div className="flex overflow-auto space-x-2 sm:space-x-4">
                <CustomNavLink
                    link={'/welcome'}
                    text={t('Navigation.Home')}
                    className="no-underline"
                />
                <CustomNavLink
                    link={'/users'}
                    text={t('Navigation.Users')}
                    className="no-underline"
                />
            </div>

            <div className="flex space-x-2 overflow-auto items-center">
                <label htmlFor="language-select" className="sr-only">
                    {t('Navigation.Language')}
                </label>
                <select
                    id="language-select"
                    value={i18n.language}
                    onChange={changeLanguage}
                    className="w-14 border-none outline-none"
                    aria-label={t('Navigation.Language')}
                >
                    {['en', 'fr'].map((item, index) => {
                        return (
                            <option value={item} key={index}>
                                {item?.toUpperCase()}
                            </option>
                        );
                    })}
                </select>
                <ColorModeSwitcher />
                {isLoggedIn ? (
                    <div className="flex space-x-1">
                        <span>
                            {t('Navigation.CurrentUser', { user: username })}
                        </span>
                        <LogoutNavLink link="/logout" />
                    </div>
                ) : (
                    <CustomNavLink link="/login" text={t('Login.Button')} />
                )}
            </div>
        </div>
    );
};
