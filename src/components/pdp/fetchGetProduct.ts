export async function fetchGetProducts(id: string): Promise<any> {
  const clientId = "your-client-id";
  const clientSecret = "your-client-secret";
  const authUrl = "https://auth.europe-west1.gcp.commercetools.com/oauth/token";

  let token: string;
  if (localStorage.getItem("token")) {
    token = JSON.parse(localStorage.getItem("token")).token;
  } else {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    const data = await response.json();
    token = data.access_token;
    localStorage.setItem("token", JSON.stringify({ token }));
  }

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const fetchInput = `https://api.europe-west1.gcp.commercetools.com/commerce-app/products/${id}`;
    const response = await fetch(fetchInput, config);
    if (response.ok) {
      const answer = await response.json();
      console.log(answer, "по id");
      return answer;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return false;
  }
  return false;
}
