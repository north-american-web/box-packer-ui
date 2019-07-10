import {ContainerSolidInterface, SolidInterface} from "../components/Solid";

export interface PackApiRequest {
    items: SolidInterface[];
    boxes: SolidInterface[];
}

export interface PackApiResponse {
    packed: ContainerSolidInterface[];
    empty: SolidInterface[];
    leftOverItems: SolidInterface[];
}

export interface PackAttemptResponse {
    loadingTime: number;
    request: PackApiRequest;
    response: PackApiResponse;
}

export function attemptPack(request: PackApiRequest): Promise<PackAttemptResponse> {
    const startTime = Date.now();
    let endTime: number;
    let apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
        throw new Error('process.env.REACT_APP_API_URL is undefined.');
    }
    //const requestWithMethod = Object.assign({_method: 'GET'}, request);
    return fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'boxpackerui',
        body: JSON.stringify({_method: 'GET', ...request})
    })
        .then((response) => {
            endTime = Date.now(); // Do this here to avoid adding json parsing time
            return response;
        })
        .then(response => response.json())
        .then(response => {
            const loadingTime = endTime - startTime;
            if (response.message) {
                throw new Error(response.message)
            }

            return {loadingTime, request, response};
        });
}