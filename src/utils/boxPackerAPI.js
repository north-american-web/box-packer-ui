export function attemptPack({items, boxes}){
    return fetch(process.env.REACT_APP_API_URL, {
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