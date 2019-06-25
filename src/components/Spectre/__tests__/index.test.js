import React from 'react';
import 'jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import {Panel, Toast, Bar} from '../index'

afterEach(cleanup);

describe('<Panel/>', () => {
    it('renders and displays correctly', () => {
        const footer = <div>Footer</div>;
        const children = <div>Children</div>;

        const { getByTestId, getByRole, asFragment } = render(<Panel title="Fake title" footer={footer} children={children} />);
        expect(asFragment()).toMatchSnapshot();
        expect(getByRole('heading')).toHaveTextContent('Fake title');
        expect(getByTestId('panel-body')).toHaveTextContent('Children');
        expect(getByTestId('panel-footer')).toHaveTextContent('Footer');
    })
});

describe('<Toast/>', () => {
    it('renders and displays correctly', () => {
        const children = <div>Children</div>;
        const { getByText, getByTestId, asFragment } = render(<Toast status='fake-status' children={children} />);
        expect(getByText('Children')).not.toBeEmpty();
        expect(getByTestId('toast-element')).toHaveClass('toast-fake-status');
        expect(asFragment()).toMatchSnapshot();
    })
});

describe('<Bar/>', () => {
    it('renders and displays correctly', () => {
        const { getByTestId, asFragment } = render(<Bar indicatorClasses='test-class' percent='55' />);
        expect(getByTestId('bar-element')).toHaveAttribute('aria-valuenow', '55');
        expect(getByTestId('bar-element')).toHaveAttribute('style', 'width: 55%;');
        expect(asFragment()).toMatchSnapshot();
    })
});