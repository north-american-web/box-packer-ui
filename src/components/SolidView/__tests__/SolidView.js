import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import SolidView from '../index';

afterEach(cleanup);

describe('<SolidView/>', () => {
    it('renders', () => {
        const fakeSolid = {
            description: 'Fake item',
            width: 2,
            length: 3,
            height: 4
        };
        const { getByText, asFragment } = render(<SolidView fallbackDescription='Fallback' solid={fakeSolid} />);
        expect(asFragment()).toMatchSnapshot();
        expect(getByText('Fake item')).toHaveClass('solid-view__description');
        expect(getByText('(2x3x4)')).toHaveClass('solid-view__dimensions');
    });

    it('falls back to a default title', () => {
        const fakeSolid = {
            width: 2,
            length: 3,
            height: 4
        };
        const { getByText } = render(<SolidView fallbackDescription='Fallback' solid={fakeSolid} />);
        expect(getByText('Fallback')).toHaveClass('solid-view__description');
    });

    it('renders children when appropriate', () => {
        const fakeSolid = {
            description: 'Fake item',
            width: 2,
            length: 3,
            height: 4,
            contents: [
                {width: 1, length: 1, height: 1},
            ]
        };

        const {getByText, asFragment} = render(<SolidView fallbackDescription='Fallback' solid={fakeSolid}/>);
        expect(asFragment()).toMatchSnapshot();
        expect(getByText('(1x1x1)')).toHaveClass('solid-view__dimensions');
    })
});