import { Admin, ListGuesser, Resource } from "react-admin";
import { customDataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import Dashboard from "./pages/dashboard";

import { EnumeratorDetails } from "./components/enumerator/enumerator-details";
import { EnumeratorList } from "./components/enumerator/enumerator-list";
import gps from "./pages/gps";
import villages from "./pages/villages";
import submissions from "./pages/submissions";

export const App = () => (

  <Admin
    dataProvider={customDataProvider}
    authProvider={authProvider}
  >
    {/* <Resource name="submissions" list={EnumeratorList} show={EnumeratorDetails}/> */}
    <Resource name="gps" {...gps} />

    {/* <Resource name="submissions" {...posts}/> */}
    <Resource name="villages" {...villages} />
    <Resource name="submissions" {...submissions}
    />
  </Admin>

);
