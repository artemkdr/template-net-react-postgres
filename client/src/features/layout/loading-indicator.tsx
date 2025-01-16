import { loadingGif } from '@/_foundation/assets/loading-gif';

export const LoadingIndicator: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { ...rest } = props;
    return (
        <div
            style={{ backgroundImage: `url(${loadingGif})` }}
            className="fixed top-1/2 left-1/2 p-4 rounded-lg bg-white bg-opacity-60 bg-no-repeat transition-all duration-300 ease-out min-w-[32px] min-h-[32px]"
            {...rest}
        >
            &nbsp;
        </div>
    );
};
