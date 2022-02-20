const Authorization = process.env.AI_API;
const fetch = require('node-fetch');


const verify = async (data) => {
  try {
    const url = 'https://chat.ultimate.ai/api/intents';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization':"825765d4-7f8d-4d83-bb03-9d45ac9c27c0"
      },
      body: JSON.stringify(data)
    };
    const dataFromAPI = await fetch(url, options);
    const { status } = dataFromAPI;
    if (status !== 200) {
      return null;
      // return {
      //   statusCode: 400,
      //   body: JSON.stringify({
      //     error: 'BadRequest',
      //     message: 'Invalid data'
      //   })
      // };
    }
    const retorno = await dataFromAPI.json();
    return retorno;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports = {
  verify
}