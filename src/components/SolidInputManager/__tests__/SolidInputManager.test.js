import React from 'react';
import 'jest-dom/extend-expect';
import { render, fireEvent, cleanup, waitForDomChange } from '@testing-library/react';
import SolidInputManager from '../index';

afterEach(cleanup);

const defaultProps = {
    title: 'dummy title',
    onChange: () => {}
};

describe('<SolidInputManager/>', () => {
    it('renders and displays correctly', () => {
        const { getByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const addButton = getByLabelText('Add solid');
        expect(addButton).not.toBeEnabled();
        expect(getByLabelText('Solid input')).toBeInTheDocument();
    });

    it('toggles inclusion of the add button correctly', async () => {
        const { getAllByLabelText, queryByLabelText, getByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const addButton = getByLabelText('Add solid');
        const firstSolidInput = queryByLabelText('Solid input');

        // Enter invalid solid input
        fireEvent.change(firstSolidInput, { target: { value: '1,2'}});
        expect(addButton).not.toBeEnabled();

        // Enter valid solid input
        fireEvent.change(firstSolidInput, { target: { value: '1,2,2'}});
        await waitForDomChange({container: addButton});
        expect(addButton).toBeEnabled();

        // Add a new solid input
        fireEvent.click(addButton);
        expect(addButton).not.toBeEnabled();
        fireEvent.change(getAllByLabelText('Solid input')[1], { target: { value: '1,2,2'}});
        await waitForDomChange({container: addButton});
        expect(addButton).toBeEnabled();

        // Clear second input
        fireEvent.change(getAllByLabelText('Solid input')[1], { target: { value: ''}});
        await waitForDomChange({container: addButton});
        expect(addButton).not.toBeEnabled();
    });

    it('add button adds solid inputs correctly', async () => {
        const { getByLabelText, queryAllByLabelText } = render(<SolidInputManager {...defaultProps} />);

        let addButton = getByLabelText('Add solid');

        // Add valid input value
        fireEvent.change(queryAllByLabelText('Solid input')[0], {target: { value: '1,1,1'}});
        await waitForDomChange({container: addButton});

        // Click to add another solid input
        fireEvent.click(addButton);
        expect(queryAllByLabelText('Solid input').length).toEqual(2);
    });

    it('clears single solid input correctly on remove click', () => {
        const { getByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const solidInput = getByLabelText('Solid input');

        fireEvent.change(solidInput, {target: { value: '1,1,1'}});
        fireEvent.click(getByLabelText('Delete item'));

        expect(solidInput).toHaveValue('');
    });

    it('removes solid inputs on remove click', async () => {
        const { getByLabelText, queryAllByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const addButton = getByLabelText('Add solid');

        // Add valid input
        fireEvent.change(getByLabelText('Solid input'), {target: { value: '1,1,1'}});
        await waitForDomChange({container: addButton});

        // Add another input
        fireEvent.click(addButton);
        expect(queryAllByLabelText('Solid input').length).toEqual(2);

        // Delete the newly added input
        fireEvent.click(queryAllByLabelText('Delete item')[1]);
        expect(queryAllByLabelText('Solid input').length).toEqual(1);
    });

    it('sends onChange the right solid input values', async () => {
        const onChange = jest.fn();
        const { container, getByLabelText, queryAllByLabelText } = render(<SolidInputManager {...defaultProps}
            onChange={onChange}
        />);

        fireEvent.change(getByLabelText('Solid input'), {target: { value: '1,1,1'}});
        await waitForDomChange({container});
        expect(onChange.mock.calls[0][0]).toEqual([
            { width: 1, length: 1, height: 1, description: undefined },
        ]);
        fireEvent.click(getByLabelText('Add solid'));
        fireEvent.change(queryAllByLabelText('Solid input')[1], {target: { value: '2,2,2,fake description'}});
        await waitForDomChange({container});

        expect(onChange.mock.calls[1][0]).toEqual([
            { width: 1, length: 1, height: 1, description: undefined },
            { width: 2, length: 2, height: 2, description: 'fake description' },
        ])
    });

    it('duplicates field correctly on duplicate button click', async() => {
        const { container, getByLabelText, getAllByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const firstInput = getByLabelText('Solid input');
        fireEvent.change(firstInput, {target:{value:'1,2,3'}});

        const duplicateButton = getByLabelText('Duplicate item');
        fireEvent.click(duplicateButton);

        //await waitForDomChange(container);

        const inputs = getAllByLabelText('Solid input');
        expect(inputs.length).toEqual(2);
        expect(inputs[0].value).toEqual('1,2,3');
        expect(inputs[1].value).toEqual('1,2,3');
    });

    it('includes SolidInputs with only first having a disabled remove button initial state', () => {
        const { container, getByLabelText, getAllByLabelText } = render(<SolidInputManager {...defaultProps} />);

        const firstInput = getByLabelText('Solid input');
        expect(getByLabelText('Delete item')).toBeDisabled();

        fireEvent.change(firstInput, {target:{value:'1,2,3'}});
    });
});