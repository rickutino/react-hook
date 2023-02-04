const BASEURL = "https://api.github.com/users/";

export const fetchGithubUser = async (username) => {
  const response = await fetch(`${BASEURL}${username}`);
  if (!response.ok) {
    return Promise.reject("User not found");
  }
  return await response.json();
};