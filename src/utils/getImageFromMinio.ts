// export const getImageFromMinio = async (filename:string) => {
//     // eslint-disable-next-line no-useless-catch
//     try {
//       let res = await axios.get(`https://bff.staging.anamaya.samagra.io/upload/${filename}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return res?.data;
//     } catch (err) {
//       throw err;
//     }
//   }

export const getImageFromMinio = async (filename: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let response = await fetch(`${import.meta.env.VITE_BACKEND_SERVICE_URL}/upload/${filename}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.text();

    return data;
  } catch (err) {
    // Re-throwing the error to the caller
    throw err;
  }
}