import React from 'react';
import 'jest-dom/extend-expect';
import {render, fireEvent, cleanup} from '@testing-library/react';
import SolidInput from '../index'

afterEach(cleanup);

// SolidInput.handleInputChange uses a setTimeout to avoid onSubmit calls before typing is finished
// Use fake timers to allow us to skip the wait and fetch output immediately.
jest.useFakeTimers();

let defaultProps = {
    inputKey: 'test-key',
    onSubmit: () => {},
    onDuplicate: () => {},
    onRemove: () => {},
    onNext: () => {},
    isDataValid: () => {},
    removeMayBeDisabled: true,
};

describe('<SolidInput/>', () => {
    it('handles input change events correctly', () => {
        const onSubmit = jest.fn();

        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            onSubmit={onSubmit}
        />);

        const emptySolid = {
            width: undefined,
            length: undefined,
            height: undefined,
            description: undefined
        };

        const input = getByLabelText('Solid input');

        fireEvent.change(input, {target: {value: 'a'}});
        expect(onSubmit).not.toBeCalled();
        jest.runAllTimers();
        expect(onSubmit).toBeCalled();
        expect(onSubmit.mock.calls[0][0]).toBe('test-key', null);
        expect(onSubmit.mock.calls[0][1]).toEqual(emptySolid);

        const expectedOnSubmitArgs = [
            ['1,1,', emptySolid],
            ['1,1,description', emptySolid],
            ['1,+1,1', emptySolid],
            ['1,"1",1', emptySolid],
            ['1,1,1', {width: 1, length: 1, height: 1, description: undefined}],
            ['1 , 1, 1', {width: 1, length: 1, height: 1, description: undefined}],
            ['1, 1, 1,', {width: 1, length: 1, height: 1, description: undefined}],
            ['2.1, 1, 0,', {width: 2.1, length: 1, height: 0, description: undefined}],
            ['1, 1, 1, description', {width: 1, length: 1, height: 1, description: 'description'}],
            ['1, 1, 1, description, 1', {width: 1, length: 1, height: 1, description: 'description, 1'}],
        ];

        for( let i=0, len = expectedOnSubmitArgs.length; i < len; i++){
            fireEvent.change(input, {target: {value: expectedOnSubmitArgs[i][0]}});
            jest.runAllTimers();
            expect(onSubmit.mock.calls[i+1][1]).toEqual(expectedOnSubmitArgs[i][1]);
        }
    });

    it('handles non-enter keypress correctly', () => {
        const onSubmit = jest.fn(),
            onNext = jest.fn();

        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            onSubmit={onSubmit}
            onNext={onNext}
        />);

        const input = getByLabelText('Solid input');

        // The typing timeout shouldn't be affected by non-enter key-presses
        fireEvent.change(input, {target: {value: '1,1,1'}});
        fireEvent.keyPress(input, { key: 'a', code: 1, charCode: 1 });
        expect(onSubmit).not.toBeCalled();
        jest.runAllTimers();
        expect(onSubmit).toBeCalled();
        expect(onNext).not.toBeCalled();
    });

    it('handles enter keypress correctly', () => {
        const onSubmit = jest.fn(),
            onNext = jest.fn();

        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            onSubmit={onSubmit}
            onNext={onNext}
        />);

        const input = getByLabelText('Solid input');

        fireEvent.change(input, {target: {value: '1,1,1'}});
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
        expect(onSubmit).toBeCalled();
        expect(onNext).toBeCalled();
        expect(onSubmit.mock.calls[0][1]).toEqual({width: 1, length: 1, height: 1, description: undefined});
    });

    it('handles remove correctly', () => {
        const onSubmit = jest.fn(),
            onRemove = jest.fn();

        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            onSubmit={onSubmit}
            onRemove={onRemove}
        />);

        const input = getByLabelText('Solid input');
        const removeButton = getByLabelText('Delete item');

        fireEvent.change(input, {target: {value: '1,1,1'}});
        fireEvent.click(removeButton);
        expect(onSubmit).not.toBeCalled();
        expect(onRemove).toBeCalled();

        expect(input).toBeEmpty();
    });

    it('handles duplicate button click correctly', () => {
        const onDuplicate = jest.fn();

        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            onDuplicate={onDuplicate}
        />);

        const input = getByLabelText('Solid input');
        const duplicateButton = getByLabelText('Duplicate item');

        fireEvent.change(input, {target: {value: '1,1,1'}});
        fireEvent.click(duplicateButton);

        expect(input).toBeEmpty();
    });

    it('handles remove button state correctly', () => {
        const {getByLabelText} = render(<SolidInput
            {...defaultProps}
            removeMayBeDisabled={false}
        />);
        expect(getByLabelText('Delete item')).toBeEnabled();

        cleanup();

        render(<SolidInput
            {...defaultProps}
            removeMayBeDisabled={true}
        />);
        expect(getByLabelText('Delete item')).toBeDisabled();
        fireEvent.change(getByLabelText('Solid input'), {target:{value:'test'}});
        expect(getByLabelText('Delete item')).toBeEnabled();
    });

});