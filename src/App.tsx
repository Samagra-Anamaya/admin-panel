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


const store = localStorageStore(undefined, 'stride');

const App = () => {
  const [themeName] = useStore<ThemeName>('themeName', 'soft');
  const lightTheme = themes.find(theme => theme.name === themeName)?.light;
  const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
  return <Admin
    store={store}
    dataProvider={customDataProvider}
    authProvider={authProvider}
    lightTheme={nanoLightTheme}
    darkTheme={nanoDarkTheme}
    layout={Layout}
  >
    {/* <Resource name="submissions" list={EnumeratorList} show={EnumeratorDetails}/> */}
    <Resource name="gps" {...gps} />

    {/* <Resource name="submissions" {...posts}/> */}
    <Resource name="villages" {...villages} />
    <Resource name="submissions" {...submissions}
    />
  </Admin>

};


const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <App />
  </StoreContextProvider>
);

export default AppWrapper;