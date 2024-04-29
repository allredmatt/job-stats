export default async function postData(titles) { //Function for sending POST JSON data via fetch

    const finalData = 
    {
        "total": 0,
        "values": []
    }
    /* Expecting data to look like this before being returned:
        {
            "total": 738,
            "values": [
                {
                    "label": "Frontend",
                    "value": 29
                },
                {
                    "label": "Backend",
                    "value": 26
                },
                {
                    "label": "Node",
                    "value": 20
                }
            ]
        }
    */
   try {
    finalData.total = await gatherDataFromAPI('/api/jobstats/all').value

    for (const title of titles) { //Iterate over all keywords in POST body getting number of ads
        const site = `/api/jobstats/${title}` //API end point address
        const result = await gatherDataFromAPI(site)
        finalData.values.push( result )
    }

    async function gatherDataFromAPI (url) {
        const response = await fetch(url, {
        method: 'GET',
        });
        return response.json();
    }

    }
    catch {
        return {error: "Incorrect response from server", ...finalData}
    }

    return finalData
}