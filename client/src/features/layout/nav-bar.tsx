import { useAuthContext } from '@/_foundation/contexts/auth-context';
import { ColorModeSwitcher } from '@/features/layout/components/color-mode-switcher';
import { CustomNavLink } from '@/features/layout/components/custom-nav-link';
import { LogoutNavLink } from '@/features/layout/components/logout-nav-link';
import { Flex, HStack, Select, Text, useColorMode } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const NavBar = (): ReactElement => {
    const { colorMode } = useColorMode();
    const { t, i18n } = useTranslation();
    const { isLoggedIn, username } = useAuthContext();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <Flex
            data-testid="navbar"
            alignItems={'center'}
            justifyContent={'space-between'}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
            shadow={'sm'}
            px={[2, 4, 8]}
            py={[2, 4]}
            fontSize={['xs', 'xs', 'xs', 'sm']}
            width="100%"
            overflowX={'auto'}
        >
            <HStack overflow={'auto'} spacing={[2, 4]}>
                <CustomNavLink
                    link={'/welcome'}
                    text={t('Navigation.Home')}
                    textDecoration={'none'}
                />
                <CustomNavLink
                    link={'/users'}
                    text={t('Navigation.Users')}
                    textDecoration={'none'}
                />
            </HStack>

            <HStack spacing={1} overflow={'auto'}>
                <Select
                    value={i18n.language}
                    onChange={changeLanguage}
                    width={'3.5em'}
                    size={'inherit'}
                    border={'none'}
                    outline={'none'}
                >
                    {['en', 'fr'].map((item, index) => {
                        return (
                            <option value={item} key={index}>
                                {item?.toUpperCase()}
                            </option>
                        );
                    })}
                </Select>
                <ColorModeSwitcher />
                {isLoggedIn ? (
                    <HStack>
                        <Text>
                            {t('Navigation.CurrentUser', { user: username })}
                        </Text>
                        <LogoutNavLink link="/logout" />
                    </HStack>
                ) : (
                    <CustomNavLink
                        link="/login"
                        text={t('Login.Button')}
                        aria-label="login"
                    />
                )}
            </HStack>
        </Flex>
    );
};
