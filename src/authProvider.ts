import { AuthProvider } from "react-admin";


/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const authProvider: AuthProvider = {
  login: ({ username, password }) => {

    const request = new Request(
      "https://user-service.staging.anamaya.samagra.io/api/login",
      {
        method: "POST",
        body: JSON.stringify({
          loginId: username,
          password,
          applicationId: "9a4aecce-686f-44e5-b64f-78ea7311a1c8",
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    );
    return fetch(request)
      .then((response) => {
        console.log({ response });
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((resp) => {
        if (resp.responseCode === "OK") {
          localStorage.setItem("token", resp.result.data.user.token);
          localStorage.setItem("user",JSON.stringify(resp))
          return Promise.resolve(resp);
        }
      });
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
