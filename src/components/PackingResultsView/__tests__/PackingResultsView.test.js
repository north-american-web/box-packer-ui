import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import PackingResultsView from '../index'

afterEach(cleanup);

describe('<PackingResultsView/>', () => {
    it('renders and displays correctly', () => {
        const props = {
            apiLoadingTime: 0,
            apiResponse: {
                success: true,
                packed: [ {width: 1, length: 2, height: 3}],
                empty: [ {width: 4, length: 5, height: 6}],
                leftOverItems: [{width: 7, length: 8, height: 9}]
            },
            apiRequest: {label: 'api-request'}
        };

        const renderResult = render(<PackingResultsView {...props} />);

        expect(renderResult.getByTestId('loading-time')).toBeInTheDocument();

        const titles = renderResult.queryAllByTestId('packing-results-list-view__title');
        expect(titles[0]).toHaveTextContent('Packed boxes');
        expect(titles[1]).toHaveTextContent('Empty boxes');
        expect(titles[2]).toHaveTextContent('Left-over items');

        const contents = renderResult.queryAllByTestId('packing-results-list-view__contents');
        expect(contents[0].children.length).toBe(1);
        expect(contents[1].children.length).toBe(1);
        expect(contents[2].children.length).toBe(1);

        expect(renderResult.getByTestId('request-json')).toMatchSnapshot();
        expect(renderResult.getByTestId('response-json')).toMatchSnapshot();
    });

    it('handles packing failure and empty values correctly', () => {
        const props = {
            apiLoadingTime: 0,
            apiResponse: {
                success: false,
                packed: [],
                empty: [],
                leftOverItems: []
            },
            apiRequest: {label: 'api-request'}
        };
        const renderResult = render(<PackingResultsView {...props} />);

        const contents = renderResult.queryAllByTestId('packing-results-list-view__contents');
        expect(contents[0].children.length).toBe(0);
        expect(contents[1].children.length).toBe(0);
        expect(contents[2].children.length).toBe(0);
    });

    it('displays loading time correctly', () => {
        const props = {
            apiLoadingTime: 200,
            apiResponse: {
                success: false,
                packed: [],
                empty: [],
                leftOverItems: []
            },
            apiRequest: {label: 'api-request'}
        };
        const {getByTestId} = render(<PackingResultsView {...props} />);

        expect(getByTestId('loading-time')).toContainHTML('200');
    });

});