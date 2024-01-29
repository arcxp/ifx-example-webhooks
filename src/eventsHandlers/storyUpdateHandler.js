const { default: axios } = require("axios");

async function sendToThirdPartyIntegration(body) {
  const headers = { "Authorization": `Bearer 12345` };
  const myPost = await axios.post('https://YOURURL.m.pipedream.net', { body }, {
    headers: headers
  });
  const response = await myPost.data;
  console.log("------------response");
  console.log(response);
  return "we did it!";
}

const storyUpdateHandler = async (event) => {
  console.log(event.body);
  const result = await sendToThirdPartyIntegration(event.body);
  console.log(result)
  return result;
}
  
module.exports = storyUpdateHandler;