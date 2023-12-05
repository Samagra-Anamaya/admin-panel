import { Admin, ListGuesser, localStorageStore, nanoDarkTheme, nanoLightTheme, Resource, StoreContextProvider, useStore } from "react-admin";
import { customDataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import Dashboard from "./pages/dashboard";

import { EnumeratorDetails } from "./components/enumerator/enumerator-details";
import { EnumeratorList } from "./components/enumerator/enumerator-list";
import gps from "./pages/gps";
import villages from "./pages/villages";
import submissions from "./pages/submissions";
import { themes, ThemeName } from './themes/themes';
import Layout from './layout/Layout';
import Login from "./pages/login";
import { MenuItemsWithPermissionResolver } from "./components/MenuOptions";


const store = localStorageStore(undefined, 'stride');

const App = () => {

  return <Admin
    store={store}
    dataProvider={customDataProvider}
    authProvider={authProvider}
    lightTheme={nanoLightTheme}
    // darkTheme={nanoDarkTheme}
    layout={Layout}
    loginPage={Login}
  >
    {/* <Resource name="gps" {...gps} />
    <Resource name="villages" {...villages} />
    <Resource name="submissions" {...submissions} /> */}

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