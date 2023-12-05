import { AuthProvider } from "react-admin";
import { jwtDecode } from "jwt-decode";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const authProvider: AuthProvider = {
  login: ({ username, password, applicationId }) => {

    const request = new Request(
      "https://user-service.staging.anamaya.samagra.io/api/login",
      {
        method: "POST",
        body: JSON.stringify({
          loginId: username,
          password,
          applicationId,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    );
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((resp) => {
        if (resp.responseCode === "OK") {
          localStorage.setItem("token", resp.result.data.user.token);
          localStorage.setItem("user", JSON.stringify(resp?.result?.data?.user))
          return Promise.resolve(resp);
        } else {
          throw new Error(resp?.params?.errMsg);
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
    if (localStorage.getItem("user")) {
      const userData = JSON.parse(localStorage.getItem("user") as string);
      // console.log("Insude get permissiosn", { userData })
      const decodedToken = jwtDecode(userData.token);
      // console.log({ decodedToken })
      const reg = userData?.user?.registrations?.find(
        (u: any) => u.applicationId === decodedToken.aud
      );
      if (reg?.roles?.length) {
        // console.log({ reg })
        return Promise.resolve(reg?.roles);
      }
    }
    return Promise.reject("No Permission");
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
