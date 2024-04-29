const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function numberOfJobs (address) {
    //Gather data from site and add to a DOM
    const dom = await JSDOM.fromURL(address)
    //Find total jobs listed from page, is contained in <span class="at-facet-header-total-results">20</span>
    const element = dom.window.document.querySelector('span.at-facet-header-total-results')
    try{
        return parseInt(element.innerHTML.replace(/,/g, ''))
    } catch {
        return 0
    }
}

export default async function handler(req, res) {
    const { pid } = req.query
    const jobTitle = pid

    try{ //Added to try so can catch any api calls without a .titles in the POST body
        let site

        if(jobTitle === "all") {
            site = `https://www.cwjobs.co.uk/jobs/in-south-east`
        } else {
            site = `https://www.cwjobs.co.uk/jobs/${jobTitle}/in-south-east`
        }

        numberOfJobs(site) //Gets all jobs listed for a total so can work out percentage
        .then(data => {
            const finalDataToSend = {'label': jobTitle, 'value': data}
            return res.status(200).json(finalDataToSend)
        })
        .catch(error => res.status(500).json({error: error}))

    } catch {
        return res.status(500)
    }
    return res.end
  }