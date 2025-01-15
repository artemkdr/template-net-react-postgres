import { render, screen } from '@testing-library/react';
import { SimpleSuspense } from './simple-suspense';

describe('SimpleSuspense', () => {
    it('renders fallback when children is undefined', () => {
        render(<SimpleSuspense fallback={<div>Loading...</div>} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders emptyText when children is an empty array', () => {
        render(
            <SimpleSuspense fallback="Loading..." emptyText="No data available">
                {[]}
            </SimpleSuspense>
        );
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders emptyText when children is null and fallback is provided', () => {
        render(
            <SimpleSuspense fallback="Loading..." emptyText="No data">
                {null}
            </SimpleSuspense>
        );
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('renders children when children is not empty', () => {
        render(
            <SimpleSuspense fallback="Loading..." emptyText="No data available">
                <div>Data loaded</div>
            </SimpleSuspense>
        );
        expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
});
