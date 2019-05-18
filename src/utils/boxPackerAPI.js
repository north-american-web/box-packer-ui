const API_URL = 'https://boxpackerapi.northamericanweb.com/v1/packing_attempt';

export function attemptPack({items, boxes}){
    return fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'boxpackerui',
            body: JSON.stringify({
                boxes, items
            })
        })
        .then(response => response.json() )
        .then(response => {
            if( response.message){
                throw new Error(response.message)
            }

            return response;
        })
}