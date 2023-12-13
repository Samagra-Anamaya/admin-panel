import { Admin, localStorageStore, nanoLightTheme, Resource, StoreContextProvider } from "react-admin";
import { customDataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import Layout from './layout/Layout';
import Login from "./pages/login";
import { MenuItemsWithPermissionResolver } from "./components/MenuOptions";
import { useEffect } from "react";


export const store = localStorageStore(undefined, 'stride');

const App = () => {

  const ri = setInterval(() => {
    if (location.href.includes('gps') || location.href.includes('transactions')) {
      let reloaded = store.getItem("reload");
      if (!reloaded) {
        store.setItem('reload', true)
        clearInterval(ri);
        window.location.reload();
      }
    }
  }, 500)

  const loginRedirect = async () => {
    try {
      //@ts-ignore
      await authProvider.checkAuth();
    } catch (err) {
      alert("Redirecting to login")
      if (!window.location.href.includes('login'))
        window.location.href = '#/login'
    }
  }

  useEffect(() => {
    loginRedirect();
  }, [])

  return <Admin
    store={store}
    dataProvider={customDataProvider}
    authProvider={authProvider}
    lightTheme={nanoLightTheme}
    // darkTheme={nanoDarkTheme}
    layout={Layout}
    loginPage={Login}
  >

    {(permissions) =>
      MenuItemsWithPermissionResolver(permissions).map((option, index) => {
        return (
          <Resource
            key={index}
            name={option?.resource}
            {...option?.props}
          />
        );
      })
    }
  </Admin>

};


const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <App />
  </StoreContextProvider>
);

export default AppWrapper;