// const fetch = require('node-fetch');2
// import fetch from "node-fetch";
import fetcher from "node-fetch";
const Authorization = process.env.AI_API;

const chatApi = async (data) => {
  try {
    const url = 'https://chat.ultimate.ai/api/intents';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization
      },
      body: JSON.stringify(data),
    };

    return (await fetcher(url, options)).json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default chatApi;