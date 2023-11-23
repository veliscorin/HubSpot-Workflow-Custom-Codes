const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.KEY,
  });

  //Retrieve the contact id of the said contact object in the workflow
  const contact_id = event.fields.contact_id;
  
  try {
    //Get associated companies
    const apiGetCompaniesByContactId = await hubspotClient.apiRequest({
      method: 'GET',
      path: '/crm/v4/objects/contacts/' + contact_id + '/associations/company',
    });
	console.log(JSON.stringify(apiGetCompaniesByContactId.body, null, 2));
    const companies = apiGetCompaniesByContactId.body.results;
     
    //Search tasks by contact id
    const searchData = {
      "filterGroups": [
          {
              "filters": [
                  {
                      "operator": "EQ",
                      "propertyName": "associations.contact",
                      "value": contact_id
                  },
                  {
                      "operator": "NEQ",
                      "propertyName": "hs_task_status",
                      "value": "COMPLETED"
                  }
              ]
          }
      ]
    }
    const apiResponseGetTasksByContactId = await hubspotClient.apiRequest({
      method: 'POST',
      path: '/crm/v3/objects/task/search',
      body: searchData
    });
    console.log(JSON.stringify(apiResponseGetTasksByContactId.body, null, 2));
    const tasks = apiResponseGetTasksByContactId.body.results;
    
    let inputs = [];
    for(var i=0; i<tasks.length; i++)
   	{
      for(var k=0; k<companies.length; k++)
      {
        
          inputs.push({
            "from": {
              "id": tasks[i].id
            },
            "to": {
              "id": companies[k].toObjectId
            },
            "type": "task_to_company"
          });
      
   	   }
    }
    console.log(inputs);
    
    const associations = { inputs };
    const apiResponseAssociations = await hubspotClient.apiRequest({
      method: 'POST',
      path: '/crm/v3/associations/task/company/batch/create', 
      body: associations,
	})
   console.log(JSON.stringify(apiResponseAssociations.body, null, 2));
    
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }

}
