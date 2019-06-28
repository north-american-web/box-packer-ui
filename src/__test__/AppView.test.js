import React from 'react';
import 'jest-dom/extend-expect';
import {cleanup, render} from "@testing-library/react";
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

describe('<AppView/>', () => {
    it('renders without crashing', () => {
        const props = {
            onBoxInputsChange: () => {},
            onItemInputsChange: () => {},
        };
        render(<AppView {...props} />);
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
        const props = {
            onBoxInputsChange: () => {},
            onItemInputsChange: () => {},
            error: 'Fake error'
        };
        render(<AppView {...props} />);

        expect(Toast).toHaveBeenCalledWith({
            status: 'error',
            children: 'Fake error'
        }, {});
    });

    it('ignores error prop when falsy', async () => {
        const props = {
            onBoxInputsChange: () => {},
            onItemInputsChange: () => {},
        };
        render(<AppView {...props} />);

        expect(Toast).not.toHaveBeenCalled();
    });

    it('attempts to pass PackingResultsListView the correct props', async () => {
        const props = {
            onBoxInputsChange: () => {},
            onItemInputsChange: () => {},
            apiResponse: {
                success: true,
                packed: 'packed',
                empty: 'empty',
                leftOverItems: 'left-over-items'
            },
            apiRequest: {label: 'api-request'},
        };
        render(<AppView {...props} />);

        expect(PackingResultsView).toHaveBeenCalledWith({
            apiRequest: props.apiRequest,
            apiResponse: props.apiResponse
        }, {});
    });
});