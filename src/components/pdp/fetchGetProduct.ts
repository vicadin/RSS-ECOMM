
async function getAccessToken() {
  const config = {
    method: "POST",
    headers: {
      Authorization:
        "Basic TEhfelo0VlRtN2ZtQ3BHYzJETWlPejJWOjBnRnkyVl9EbWNyTGw4NUJhUXVWU0dPYV9iYUlaT2dm",
    },
  };
  try {
    const response = await fetch(
      `${process.env.AUTH_URL}/oauth/token?grant_type=client_credentials`,
      config,
    );
    if (response.ok) {
      return await response.json();
    }
    return response;
  } catch (err) {
    return err;
  }
}

export async function fetchGetProducts(id?: string) {
  let token;
  if (localStorage.getItem("token")) {
    token = JSON.parse(<string>localStorage.getItem("token")).token;
  } else {
    const answer = await getAccessToken();
    token = answer.access_token;
  }
  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const fetchInput = id
      ? `${process.env.HOST}/${process.env.PROJECT_KEY}/products/${id}`
      : `${process.env.HOST}/${process.env.PROJECT_KEY}/products/`;
    const response = await fetch(fetchInput, config);
    if (response.ok) {
      const answer = await response.json();
      console.log(answer,"по id")
      return answer;
    }
  } catch {
    return false;
  }
  return false;
}

