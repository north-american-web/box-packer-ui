import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import PackingResultsView from '../index'

afterEach(cleanup);

describe('<PackingResultsView/>', () => {
    it('renders and displays correctly', () => {
        const packed = [ {width: 1, length: 2, height: 3}];
        const empty = [ {width: 4, length: 5, height: 6}];
        const leftOverItems = [{width: 7, length: 8, height: 9}];
        const apiRequest = {label: 'api-request'};
        const apiResponse = {label: 'api-response'};

        const renderResult = render(<PackingResultsView
                                        success={true}
                                        empty={empty}
                                        packed={packed}
                                        leftOverItems={leftOverItems}
                                        apiResponse={apiResponse}
                                        apiRequest={apiRequest} />);
        expect(renderResult.queryByText('The item(s) fit into the box(es)!')).not.toBeNull();
        expect(renderResult.getByTestId('toast-element')).toHaveClass('toast-success');

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
        const renderResult = render(<PackingResultsView
            success={false}
            apiResponse={{label: 'api-request'}}
            apiRequest={{label: 'api-response'}} />);

        expect(renderResult.queryByText('The item(s) won\'t fit into the box(es)!')).not.toBeNull();

        const contents = renderResult.queryAllByTestId('packing-results-list-view__contents');
        expect(contents[0].children.length).toBe(0);
        expect(contents[1].children.length).toBe(0);
        expect(contents[2].children.length).toBe(0);
    })

});