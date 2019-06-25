import React from 'react';
import 'jest-dom/extend-expect';
import { render, fireEvent, cleanup } from '@testing-library/react';
import {SolidInputManagerView} from '../index';

afterEach(cleanup);

describe('<SolidInputManagerView/>', () => {
    it('renders and displays correctly', () => {
        const { getByTestId, getByRole, getByLabelText, asFragment } = render(<SolidInputManagerView
            inputs={[<div key='i1' data-testid='input-id'>input</div>]}
            allowAdd={true}
            addClickHandler={() => {}}
            title='Dummy title'
            exampleItemName='Example item'
        />);

        const addButton = getByLabelText('Add solid');
        expect(getByRole('heading')).toHaveTextContent('Dummy title');
        expect(addButton).toBeEnabled();
        expect(getByTestId('example-item-name')).toHaveTextContent('Example item');
        expect(getByTestId('input-id')).toHaveTextContent('input');
    })

    it('renders and displays correctly with disabled button', () => {
        const { getByLabelText } = render(<SolidInputManagerView
            inputs={['input']}
            title='Dummy title'
            allowAdd={false}
            addClickHandler={() => {}}
        />);

        const addButton = getByLabelText('Add solid');
        expect(addButton).not.toBeEnabled();
    })

    it('handles add button clicks correctly', () => {
        const onClick = jest.fn();
        const {getByLabelText } = render(<SolidInputManagerView
            inputs={['input']}
            title='Dummy title'
            allowAdd={true}
            addClickHandler={onClick}
        />);

        fireEvent.click(getByLabelText('Add solid'));

        expect(onClick).toHaveBeenCalled();
    })
})