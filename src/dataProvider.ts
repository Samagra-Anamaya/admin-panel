import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
import { map } from 'lodash';
const httpClient = (url: any, options: any = {}) => {
  console.log({ url, options });
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
  import.meta.env.VITE_SIMPLE_REST_URL,
  httpClient
);
// console.log({ dataProvider })
export const customDataProvider = {
  ...dataProvider,

  getList: (resource: any, params: any) => {
    console.log({ resource, params });
    if (resource === "gps") {
      const { page, perPage } = params.pagination;
      console.log({ params, page, perPage });
      // Define your custom fetch logic for the 'users' resource here
      const url = `${import.meta.env.VITE_SIMPLE_REST_URL
        }/utils/villages/getGps?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        const total = json?.result?.totalCount;
        return {
          data: map(json?.result?.villages, (gp: any) => ({ gpCode: gp.gpCode, gpName: gp.gpName, id: gp.gpCode, villagesUnderGp: gp._count.gpCode })),
          //data: json?.result?.villages,
          total,
        };
      });
    }
    if (resource === "submissions") {

      const { page, perPage } = params.pagination;
      // Define your custom fetch logic for the 'users' resource here
      if (params?.filter?.spdpVillageId?.length) {
        const url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/submissions/${params?.filter?.spdpVillageId}?page=${page}&limit=${perPage}`;
        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          const total = json?.result?.totalCount;
          return {
            data: json?.result?.submissions,
            total,
          };
        });
      } else {
        const url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/submissions?page=${page}&limit=${perPage}`;
        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          const total = json?.result?.totalCount;
          return {
            data: json?.result?.submissions,
            total,
          };
        });
      }
    }
    if (resource === "villages") {

      const { page, perPage } = params.pagination;
      console.log({ params, page, perPage });
      // Define your custom fetch logic for the 'users' resource here
      if (params?.filter?.gpCode?.length) {
        const url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/utils/villages/gp/${params.filter.gpCode}`;
        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          const total = json?.length || 0;
          return {
            data: json,
            total,
          };
        });
      } else {
        const url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/utils/villageData?page=${page}&limit=${perPage}`;
        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          const total = json?.result?.totalCount;
          return {
            data: json?.result?.villages,
            total,
          };
        });
      }
    }
    // For other resources, use the default implementation
    return dataProvider.getList(resource, params);
  },
  getOne: (resource: any, params: any) => {
    console.log({ resource, params })
    if (resource === "submissions") {
      console.log("hello");
      const { id } = params;

      // Define your custom fetch logic for the 'users' resource here
      const url = `${import.meta.env.VITE_SIMPLE_REST_URL
        }/submissions/submissionDetails/${id}`;
      return httpClient(url).then(({ json }) => {
        console.log({ json });


        return {
          data: json?.result?.submission,
        };
      });
    }
    // // For other resources, use the default implementation
    return dataProvider.getOne(resource, params);
  },
  update: (resource: any, params: any) => {
    console.log("Inside Update", resource, params)
  }
  // ... You can override other methods similarly if needed
};
