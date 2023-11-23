import { Admin, ListGuesser, Resource } from "react-admin";
import { customDataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import Dashboard from "./pages/dashboard";

import { EnumeratorDetails } from "./components/enumerator/enumerator-details";
import { EnumeratorList } from "./components/enumerator/enumerator-list";

export const App = () => (

    <Admin
      dataProvider={customDataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
    >
      {/* <Resource name="submissions" list={EnumeratorList} show={EnumeratorDetails}/> */}
      <Resource name="gps" list={ListGuesser} />

      <Resource
        name="submissions"
        list={EnumeratorList}
        show={EnumeratorDetails}
      />
      {/* <Resource name="submissions" {...posts}/> */}
      <Resource name="villages" list={ListGuesser} />
    </Admin>
  
);
