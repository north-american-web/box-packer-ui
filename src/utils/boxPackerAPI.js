export function attemptPack(request){
    const startTime = Date.now();
    let endTime;
    return fetch(process.env.REACT_APP_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'boxpackerui',
            body: JSON.stringify(request)
        })
        .then((response) => {
            endTime = Date.now(); // Do this here to avoid adding json parsing time
            return response;
        })
        .then(response => response.json() )
        .then(response => {
            const loadingTime = endTime - startTime;
            if( response.message){
                throw new Error(response.message)
            }

            return { loadingTime, request, response };
        });
}