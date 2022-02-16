const fetch = require('node-fetch');
const Authorization = process.env.AI_API;


async function verify(data) {
    try {
      const url = 'https://chat.ultimate.ai/api';
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization
        },
        body: JSON.stringify(data),
      };
  
      return (await fetch(url, options)).json();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }