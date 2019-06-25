import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import {FillProgress} from '../index'

afterEach(cleanup);

describe('<FillProgress/>', () => {
    it('renders and displays correctly', () => {
        const { queryByTestId, asFragment } = render(<FillProgress percent={90}/>);
        expect(queryByTestId('bar-element')).toHaveAttribute('aria-valuenow', '90');
        expect(queryByTestId('toast-element')).toBeNull();
        expect(asFragment()).toMatchSnapshot();
    });

    it('handles more than 100% correctly', () => {
        const { getByTestId, asFragment } = render(<FillProgress percent={110}/>);
        expect(getByTestId('bar-element')).toHaveAttribute('aria-valuenow', '110');
        expect(getByTestId('toast-element')).toHaveClass('toast-error');
        expect(asFragment()).toMatchSnapshot();
    })
});