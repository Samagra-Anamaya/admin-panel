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
        let url = `${import.meta.env.VITE_SIMPLE_REST_URL
          }/utils/villages/gp/${params.filter.gpCode}`
        if (params?.filter?.villageName) {
          url = url + `?villageName=${params?.filter?.villageName}&page=${page}&limit=${perPage}`
        } else
          url = url + `?page=${page}&limit=${perPage}`

        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          const total = json?.length || 0;
          return {
            data: json,
            total,
          };
        });
      } else {
        let url = '';
        if (params?.filter?.villageName) {
          url = `${import.meta.env.VITE_SIMPLE_REST_URL
            }/utils/villageData?villageName=${params.filter.villageName}&page=${page}&limit=${perPage}`
        } else
          url = `${import.meta.env.VITE_SIMPLE_REST_URL
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
    if (resource == 'transactions') {
      const path = window.location.href;
      const t = path.split('/')
      const n = t.length;

      if (t[n - 1].slice(0, 4) == 'show') {
        const uuidExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if (uuidExp.test(t[n - 2])) {

          const url = `${import.meta.env.VITE_SIMPLE_REST_URL
            }/ste/transactionHistory/${t[n - 2]}`;

          return httpClient(url).then(({ headers, json }) => {

            let data = [...json.request_body];
            Object.keys(json.errors)?.forEach((key: any) => {
              data[key] = { ...data[key], errors: json.errors[key] }
            })

            let paginatedData = []
            const params = new URLSearchParams(window.location.href)
            const page: any = Number(params.get('page')) || 1
            const perPage: any = Number(params.get('perPage')) || 5;
            const filter: any = JSON.parse(params.get('filter') || "{}")

            if (filter.saved_records && filter.failed_records) {
              // Do nothing
            } else {
              if (filter.saved_records)
                data = data.filter(el => el.errors ? false : el)
              if (filter.failed_records)
                data = data.filter(el => el.errors ? el : false)
            }

            if (page && perPage) {
              paginatedData = data.slice(((page - 1) * perPage), (((page - 1) * perPage) + perPage))
              console.log("inside perpage", { page, perPage, paginatedData, data })
            } else paginatedData = data;
            paginatedData = paginatedData?.map((el, index) => ({ ...el, id: index }))

            return {
              total: data?.length,
              data: paginatedData || []
            };
          });
        }
      }
      const { page, perPage } = params.pagination;
      const url = `${import.meta.env.VITE_SIMPLE_REST_URL
        }/ste/transactionHistory?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        return {
          data: json.transactionHistory,
          total: json?.totalCount,
        };
      });


    }
    if (resource == 'records') {
      const { page, perPage } = params.pagination;
      const url = `${import.meta.env.VITE_SIMPLE_REST_URL
        }/ste/savedSchemeTransactions?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        return {
          total: json.totalCount,
          data: json?.savedTransactions,
        };
      });
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

    if (resource === 'transactions') {
      const url = `${import.meta.env.VITE_SIMPLE_REST_URL
        }/ste/transactionHistory/${params.id}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        return {
          data: json
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
