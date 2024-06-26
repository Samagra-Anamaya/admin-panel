import simpleRestProvider from "ra-data-simple-rest";
import { HttpError, Resource, fetchUtils } from "react-admin";
import { map } from 'lodash';
import { TITLE_STATUS } from "./enums/Status";
import { store } from "./App";

const BASE_URI = import.meta.env.VITE_BACKEND_SERVICE_URL;
const USER_SERVICE_URI = import.meta.env.VITE_USER_SERVICE_URL;

const httpClient = (url: any, options: any = {}) => {
  console.log({ url, options });
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  if (!options?.headers.get('x-application-id'))
    options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
  BASE_URI,
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
        let url = `${BASE_URI
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
        const url = `${BASE_URI
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
        let url = `${BASE_URI
          }/submissions`;
        if (params?.filter?.spdpVillageId)
          url = url + `/${params?.filter?.spdpVillageId}`;

        url = url + "?";

        if (params?.filter?.status || params?.filter?.submitterId || params?.filter?.createdAt) {
          if(params?.filter?.status){
          url = url + `status=${params?.filter.status}`;
          }
          if(params?.filter?.submitterId){
            url = params?.filter?.status ? url + `&submitter=${params?.filter.submitterId}` : url + `submitter=${params?.filter.submitterId}`;
          }
          if(params?.filter?.createdAt){
            url = (params?.filter?.status || params?.filter?.submitterId) ? url + `&createdAt=${params?.filter.createdAt}` : url + `createdAt=${params?.filter.createdAt}`;
          }
          url = url + `&page=${page}&limit=${perPage}`;
        } else {
          url = url + `page=${page}&limit=${perPage}`;
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
        const url = `${BASE_URI
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
        let url = `${BASE_URI
          }/utils/villages/gp/${params.filter.gpCode}`
        if (params?.filter?.villageName) {
          url = url + `?villageName=${params?.filter?.villageName}&page=${page}&limit=${perPage}`
        } else
          url = url + `?page=${page}&limit=${perPage}`

        return httpClient(url).then(({ headers, json }) => {
          console.log({ headers, json });

          return {
            data: json.villages,
            total: json.totalCount
          };
        });
      } else {
        let url = '';
        if (params?.filter?.villageName) {
          url = `${BASE_URI
            }/utils/villageData?villageName=${params.filter.villageName}&page=${page}&limit=${perPage}`
        } else
          url = `${BASE_URI
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

          const url = `${BASE_URI
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
      const url = `${BASE_URI
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
      const url = `${BASE_URI
        }/ste/savedSchemeTransactions?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        return {
          total: json.totalCount,
          data: json?.savedTransactions,
        };
      });
    }

    if (resource === "scheme") {
      const { page, perPage } = params.pagination;

      // Define your custom fetch logic for the 'users' resource here
      const url = `${BASE_URI
        }/ste/getAllSchema?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        const total = json?.result?.totalCount;
        return {
          data: json.result.schemeSchema,
          total,
        };
      });
    }


    if (resource === 'departments') {
      const { page, perPage } = params.pagination;

      // Define your custom fetch logic for the 'users' resource here
      const url = `${BASE_URI}/ste/department?page=${page}&limit=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        console.log({ headers, json });

        return {
          data: json?.result?.data,
          total: json?.result?.totalCount,
        };
      });
    }

    if (resource === 'users') {
      const { page, perPage } = params.pagination;

      // Define your custom fetch logic for the 'users' resource here
      const url = `${USER_SERVICE_URI}/searchUserByQuery?startRow=${page}&numberOfResults=${perPage}&queryString=(registrations.roles:department)`;
      return httpClient(url, { headers: new Headers({ Accept: "application/json", 'x-application-id': import.meta.env.VITE_STE_APPLICATION_ID }) }).then(({ headers, json }) => {

        return {
          data: json?.result?.users,
          total: json?.result?.total,
        };
      });
    }
    // For other resources, use the default implementation
    return dataProvider.getList(resource, params);
  },
  getOne: (resource: any, params: any) => {
    const { id } = params
    switch (resource) {
      case 'submissions': {
        // Define your custom fetch logic for the 'users' resource here
        const url = `${BASE_URI
          }/submissions/submissionDetails/${id}`;
        return httpClient(url).then(({ json }) => {
          return {
            data: json?.result?.submission,
          };
        });
      }

      case 'transactions': {
        const url = `${BASE_URI
          }/ste/transactionHistory/${id}`;
        return httpClient(url).then(({ headers, json }) => {
          return {
            data: json
          };
        });
      }

      case 'scheme': {
        const url = `${BASE_URI}/ste/getSchemeSchema/${id}`;

        return httpClient(url).then(({ headers, json }) => {
          return {
            data: json,
          };
        });
      }

      case 'departments': {
        const url = `${BASE_URI}/ste/department/${id}`;

        return httpClient(url).then(({ headers, json }) => {
          return {
            data: json,
          };
        });
      }

      case 'users': {
        const url = `${USER_SERVICE_URI}/user/${id}`;

        return httpClient(url, { headers: new Headers({ Accept: "application/json", 'x-application-id': import.meta.env.VITE_STE_APPLICATION_ID }) }).then(({ headers, json }) => {
          return {
            data: json?.result?.users?.[0],
          };
        });
      }

      default: return dataProvider.getOne(resource, params);
    }


  },
  update: async (resource: any, params: any) => {
    switch (resource) {

      case 'submissions': {
        const flag = params?.data?.status;

        const url = `${BASE_URI
          }/submissions/${params.id}/submitFeedback`;

        let feedbackBody = null;

        if (flag == TITLE_STATUS.FLAGGED) {
          feedbackBody = params?.data?.feedback?.feedbackData
        }

        let res = await httpClient(url, {
          method: 'POST',
          body: JSON.stringify({ flag, feedbackBody })
        })

        if (res?.status == 201) {
          return {
            data: { id: params.id, ...res.json }
          }
        } return res;
      }

    }
  },
  create: async (resource: string, params: any) => {
    switch (resource) {
      case 'scheme': {
        return new Promise(async (resolve, reject) => {

          try {
            if (!params.data.schemeJson) {
              return reject(
                new HttpError(
                  "Please enter a valid JSON Schema",
                  404,
                  null
                )
              );
            }

            const url = `${BASE_URI}/ste/saveSchemeSchema`;

            const user: any = JSON.parse(localStorage.getItem('user') || '{}');

            console.log(user)
            let res: any = await httpClient(url, {
              method: 'POST',
              body: JSON.stringify({
                schemeName: params.data.schemeName,
                schemeCode: params.data.schemeCode,
                schema: JSON.parse(params.data.schemeJson),
                deptId: user?.user?.data?.deptId
              })
            });

            resolve({
              data: { ...res.json }
            })

          } catch (error: any) {
            return reject(
              new HttpError(
                error.message,
                404,
                null
              )
            );
          }
        });
      }

      case 'departments': {
        return new Promise(async (resolve, reject) => {

          try {
            const url = `${BASE_URI}/ste/department`;

            // if (params.data.schemeJson) {
            //   if (!Array.isArray(JSON.parse(params.data.schemeJson))) {
            //     return reject(
            //       new HttpError(
            //         "Schemes Json must be an array of objects",
            //         404,
            //         null
            //       )
            //     );
            //   }
            // }

            let res: any = await httpClient(url, {
              method: 'POST',
              body: JSON.stringify({
                name: params.data.name,
                data: params.data.deptData ? JSON.parse(params.data.deptData) : {},
                // schemes: params.data.schemeJson ? JSON.parse(params.data.schemeJson) : []
                schemes: []
              })
            });

            console.log({ res })

            if (res?.json?.[0]?.statuscode == 500) {
              return reject(
                new HttpError(
                  res?.json?.[0]?.errors[0].message,
                  404,
                  null
                )
              );
            }

            resolve({
              data: { ...res.json?.result?.data }
            })

          } catch (error: any) {
            return reject(
              new HttpError(
                error.message,
                404,
                null
              )
            );
          }
        });
      }

      case 'users': {
        return new Promise(async (resolve, reject) => {
          try {
            const url = `${USER_SERVICE_URI}/signup`;

            const regBody = {
              registration: {
                applicationId: import.meta.env.VITE_STE_APPLICATION_ID,
                roles: ['department'],
                usernameStatus: 'ACTIVE'
              },
              user: {
                username: params.data.username,
                password: params.data.password,
                data: {
                  deptId: params.data.deptId
                }
              }
            }

            let res: any = await httpClient(url, {
              method: 'POST',
              body: JSON.stringify(regBody),
              headers: new Headers({ Accept: "application/json", 'x-application-id': import.meta.env.VITE_STE_APPLICATION_ID })
            });

            resolve({
              data: { ...res?.json?.result }
            })

          } catch (error: any) {
            const errorStrings: String[] = [];
            const errors = error?.body?.exception?.fieldErrors;
            Object.keys(errors).forEach(key => {
              errorStrings.push(errors[key]?.[0]?.message);
            })
            return reject(
              new HttpError(
                errorStrings.join("") || "Bad Request, please try again",
                404,
                null
              )
            );
          }
        });
      }
    }
  }
  // ... You can override other methods similarly if needed
};
