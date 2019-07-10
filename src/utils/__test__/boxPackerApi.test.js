import {attemptPack} from "../boxPackerAPI";

global.fetch = jest.fn(() => {
    return new Promise(resolve => resolve(new Response(JSON.stringify({label:'response-data'})),
        reject => reject()));
});

describe('boxPackerApi', () => {
    it('calls fetch with the right parameters', () => {
        const request = {
            label: 'request-data'
        };
        const actualFetchRequest = {
            _method: 'GET',
            ...request
        };
        const init = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'boxpackerui',
            body: JSON.stringify(actualFetchRequest)
        };


        const response = attemptPack(request);

        expect(fetch).toHaveBeenCalledWith(expect.any(String), init);

        response.then(response => {
            expect(response).toEqual({
                loadingTime: expect.any(Number),
                request: {label: 'request-data'},
                response: {label: 'response-data'}
            });
        });
    });

    it('handles errors correctly', () => {
        fetch.mockReturnValueOnce(
            new Promise(resolve => resolve(new Response(JSON.stringify({message:'error-message'}))),
            reject => reject()));

        const response = attemptPack({label: 'request-data'});

        response.catch( (error) => {
            expect(error).toEqual(new Error('error-message'));
        });
    });
});