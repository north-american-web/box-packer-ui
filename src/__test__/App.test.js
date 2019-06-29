import React from 'react';
import {cleanup, fireEvent, render, wait} from "@testing-library/react";
import App from '../App';
import {attemptPack} from '../utils/boxPackerAPI';
import PackingResultsView from '../components/PackingResultsView';

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

jest.mock('../components/PackingResultsView', () => jest.fn(() => <div>packing-results-view</div>));
jest.mock('../utils/boxPackerAPI', () => {
    return {
        attemptPack: jest.fn(() => {
                            return new Promise(resolve => resolve({
                                request: {label: 'request-data'},
                                response: {label: 'response-data'}
                            }));
                        })
    };
});

describe('<App/>', () => {
    it('renders without crashing', () => {
        render(<App/>);
    });

    it('handles box input changes correctly', async () => {
        const { getAllByLabelText } = render(<App/>);

        const inputs = getAllByLabelText('Solid input');

        fireEvent.change(inputs[0], {target:{value: '2,2,2'}});
        fireEvent.change(inputs[1], {target:{value: '1,1,1'}});

        await wait(() => expect(attemptPack).toHaveBeenCalled() );

        expect(attemptPack).toHaveBeenCalledWith({
            items: [
                { width: 1, length: 1, height: 1, description: undefined }
            ],
            boxes: [
                { width: 2, length: 2, height: 2, description: undefined }
            ],
        });
        expect(PackingResultsView).toHaveBeenCalledWith({
                apiRequest: {label:'request-data'},
                apiResponse: {label: 'response-data'}
            },
            expect.any(Object)
        );

        jest.clearAllMocks();

        fireEvent.change(inputs[1], {target:{value: '3,3,3, description'}});
        await wait(() => expect(attemptPack).toHaveBeenCalled() );
        expect(attemptPack).toHaveBeenCalledWith({
            items: [
                { width: 3, length: 3, height: 3, description: 'description'}
            ],
            boxes: [
                { width: 2, length: 2, height: 2, description: undefined }
            ],
        });
        expect(PackingResultsView).toHaveBeenCalledWith(
            {
                apiRequest: {label:'request-data'},
                apiResponse: {label: 'response-data'}
            },
            expect.any(Object)
        );
    });

    it('fire successful trackable event correctly', async() => {
        const eventTracker = jest.fn();
        const { getAllByLabelText } = render(<App onTrackableEvent={eventTracker}/>);

        const inputs = getAllByLabelText('Solid input');

        fireEvent.change(inputs[0], {target:{value: '2,2,2'}});
        fireEvent.change(inputs[1], {target:{value: '1,1,1'}});

        await wait(() => expect(attemptPack).toHaveBeenCalled() );
        expect(eventTracker).toHaveBeenCalledWith({
            category: 'Packing attempt',
            action: 'Received API response'
        });
    });

    it('fire error trackable event correctly', async() => {
        attemptPack.mockImplementationOnce(() => {
            return new Promise( () => {
                throw new Error('test error');
            });
        });
        console.warn = jest.fn();

        const eventTracker = jest.fn();
        const { getAllByLabelText } = render(<App onTrackableEvent={eventTracker}/>);

        const inputs = getAllByLabelText('Solid input');

        fireEvent.change(inputs[0], {target:{value: '2,2,2'}});
        fireEvent.change(inputs[1], {target:{value: '1,1,1'}});

        await wait(() => expect(attemptPack).toHaveBeenCalled() );
        expect(eventTracker).toHaveBeenCalledWith({
            category: 'API Error',
            action: 'API call failed'
        });
        expect(console.warn).toHaveBeenCalled();
    });



});
