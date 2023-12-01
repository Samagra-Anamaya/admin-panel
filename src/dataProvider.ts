import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
import { map } from 'lodash';
import { TITLE_STATUS } from "./enums/Status";

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

      if (Object.keys(params.filter)?.length) {
        let url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/utils/villages/getGps`;
        if (params?.filter?.gpCode && params?.filter?.gpName) {
          url = url + `?gpCode=${params.filter.gpCode}&gpName=${params.filter.gpName}&page=${page}&limit=${perPage}`
        } else if (params?.filter?.gpCode)
          url = url + `?gpCode=${params.filter.gpCode}&page=${page}&limit=${perPage}`
        else if (params?.filter?.gpName) {
          url = url + `?gpName=${params.filter.gpName}&page=${page}&limit=${perPage}`
        } else {
          url = url + `?page=${page}&limit=${perPage}`;
        }

        return httpClient(url).then(({ headers, json }) => {

          const total = json?.result?.totalCount;
          return {
            data: map(json?.result?.villages, (gp: any) => ({ gpCode: gp.gpCode, gpName: gp.gpName, id: gp.gpCode, villagesUnderGp: gp._count.gpCode })),
            total,
          };
        });
      } else {
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
    }
    if (resource === "submissions") {

      const { page, perPage } = params.pagination;
      // Define your custom fetch logic for the 'users' resource here
      if (Object.keys(params.filter)?.length) {
        let url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/submissions`;
        if (params?.filter?.spdpVillageId)
          url = url + `/${params?.filter?.spdpVillageId}`;

        if (params?.filter?.status) {
          url = url + `?status=${params?.filter.status}&page=${page}&limit=${perPage}`;
        } else {
          url = url + `?page=${page}&limit=${perPage}`;
        }

        url = url + `&sortBy=${params?.sort?.field}&order=${params?.sort?.order?.toLowerCase()}`;

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
          }/submissions?page=${page}&limit=${perPage}&sortBy=${params?.sort?.field}&order=${params?.sort?.order.toLowerCase()}`;
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
  update: async (resource: any, params: any) => {
    console.log("Inside Update", resource, params)
    switch (resource) {

      case 'submissions': {
        const flag = params?.data?.status;

        const url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/submissions/${params.id}/submitFeedback`;

        let feedbackBody = null;

        if (flag == TITLE_STATUS.FLAGGED) {
          feedbackBody = params?.data?.feedbackData
        }

        let res = await httpClient(url, {
          method: 'POST',
          body: JSON.stringify({ flag, feedbackBody })
        })
        console.log(res)
        if (res?.status == 201) {
          return {
            data: { id: params.id, ...res.json }
          }
        } return res;
      }

    }
  }
  // ... You can override other methods similarly if needed
};
