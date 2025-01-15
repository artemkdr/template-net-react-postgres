import { loadingGif } from '@/_foundation/assets/loading-gif';
import { Box, InputAddonProps } from '@chakra-ui/react';

export const LoadingIndicator: React.FC<InputAddonProps> = (props) => {
    const { ...rest } = props;
    return (
        <Box
            position={'fixed'}
            top={'45%'}
            left={'50%'}
            padding={'1em 2em'}
            borderRadius={'6px'}
            backgroundRepeat={'no-repeat'}
            transition={'all 0.3s ease-out'}
            minWidth={'32px'}
            minHeight={'32px'}
            backgroundColor={'#ffffff99'}
            backgroundImage={loadingGif}
            {...rest}
        >
            &nbsp;
        </Box>
    );
};
