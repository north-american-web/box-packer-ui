import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import PackingResultsListView from '../index';

afterEach(cleanup);

describe('<PackingResultsListView/>', () => {
    it('renders', () => {
        const fakeSolids = [
            {width: 1, length: 1, height: 1},
            {width: 1, length: 1, height: 1}
        ];

        const { queryByText, asFragment } = render(<PackingResultsListView solids={fakeSolids} title='Fake title' />);
        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('Fake title')).not.toBeNull();
    })
});