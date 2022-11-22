/**
 * Example: Get associated companies by contact 
 */

const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

  const hubspotClient = new hubspot.Client({ accessToken: process.env.KEY });

  let contactId = event.object.objectId;

  try {

    //Get associated companies
    const apiGetCompaniesByContactId = await hubspotClient.apiRequest({
      method: 'GET',
      path: '/crm/v4/objects/contacts/' + contactId + '/associations/company',
    });

    const companies = apiGetCompaniesByContactId.body.results;

    for (var k = 0; k < companies.length; k++) {
      //do something
    }

  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }

}