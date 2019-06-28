import React from 'react';
import 'jest-dom/extend-expect';
import {cleanup, fireEvent, render} from "@testing-library/react";
import {AppView} from '../App';
import SolidInputManager from "../components/SolidInputManager";
import PackingResultsView from "../components/PackingResultsView";
import {Toast} from "../components/Spectre";

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

jest.mock('../components/PackingResultsView', () => jest.fn(() => null));
jest.mock('../components/SolidInputManager', () => jest.fn(() => null));
jest.mock('../components/Spectre', () => ({ Toast: jest.fn(() => null) }));

const defaultProps = {
    onBoxInputsChange: () => {},
    onItemInputsChange: () => {},
};

describe('<AppView/>', () => {
    it('renders without crashing', () => {
        render(<AppView {...defaultProps} />);
    });

    it('attempts to pass SolidInputManagers the correct props', async () => {
        const handleBoxInputsChange = jest.fn(),
            handleItemInputsChange = jest.fn(),
            props = {
                onBoxInputsChange: handleBoxInputsChange,
                onItemInputsChange: handleItemInputsChange,
        };
        render(<AppView {...props} />);

        expect(SolidInputManager).toHaveBeenCalledWith({
            title: 'Boxes',
            onChange: handleBoxInputsChange,
            exampleItemName: 'Small box'
        }, {});

        expect(SolidInputManager).toHaveBeenCalledWith({
            title: 'Items',
            onChange: handleItemInputsChange,
            exampleItemName: 'Coasters 2-pack'
        }, {});
    });

    it('handles error properly when present', async () => {
        render(<AppView {...defaultProps} error='Fake error' />);
        expect(Toast).toHaveBeenCalledWith({
            status: 'error',
            children: 'Fake error'
        }, {});
    });

    it('ignores error prop when falsy', async () => {
        render(<AppView {...defaultProps} />);
        expect(Toast).not.toHaveBeenCalled();
    });

    it('attempts to pass PackingResultsListView the correct props', async () => {
        const moreProps = {
            apiResponse: {
                success: true,
                packed: 'packed',
                empty: 'empty',
                leftOverItems: 'left-over-items'
            },
            apiRequest: {label: 'api-request'},
        };
        render(<AppView {...defaultProps} {...moreProps} />);

        expect(PackingResultsView).toHaveBeenCalledWith({
            apiRequest: moreProps.apiRequest,
            apiResponse: moreProps.apiResponse
        }, {});
    });

    it('prevent solid inputs form submission', () => {
        const {getByTestId} = render(<AppView {...defaultProps} />);
        const preventDefault = jest.fn();
        const submitEvent = new Event('submit');
        Object.assign(submitEvent, {preventDefault, hi: 'hi!'});
        fireEvent(getByTestId('solid-inputs-form'), submitEvent);

        expect(preventDefault).toHaveBeenCalled();
    })
});