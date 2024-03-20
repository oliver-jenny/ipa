const HELLO_WORLD_URL = 'http://localhost:9000/hello-world';

export const getHelloWorld = async () => {
  try {
    const response = await fetch(`${HELLO_WORLD_URL}/`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = response.ok ? await response.text() : response.statusText;

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
