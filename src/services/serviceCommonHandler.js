import { AppConstant } from "../assets/AppConstant";
import { jsonCopy } from "../utils/string";

export const serviceConsts = {

  baseUrls: {
    baseUrl: "https://uatmanageapps.tataplay.com/",
    auth: "manage-app-auth/",
    readContent: "manage-app-read/",
    writeContent: "manage-app-write/",
    imageBaseUrl: "https://uatmanageapps.tataplay.com/cms-assets/images/",
    drupalApi: "https://uatmanageapps.tataplaybinge.com/cms-assets/v1/app-data/",
    showPlanImage: (value) => `https://uatmanageapps.tataplaybinge.com/cms-assets/images/myopS${value}.png`
  },
  endPoints: {
    authToken: 'v1/BINGE_OTT/access',
    createSession: "v1/createSession",
    packList: "v1/BINGE_OTT/CYOP/getPacks",
    savePacks: "v1/BINGE_OTT/savePacks",
    pageRedirection: "v1/BINGE_OTT/pageRedirection",
    pageSummary: "v1/BINGE_OTT/getSummaryPage/",
    drupalTextInfo: "manifest.json?v=29.0",
    drupalOtherInfo: "pick_your_price.json?v=10.0",
    drupalOtherInfo2: "choose_your_tenure.json?v=10.0",
  },

  method: {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE',
    patch: 'PATCH',
  },
};

export function SortByDate(dateA, dateB) {
  // let dateA1 = dateA && dateA != "" ? dateA : "";
  // let dateB1 = dateB && dateB != "" ? dateB : "";
  // return dateA1 == "" || dateB1 == "" ? true : moment(dateA1, 'YYYY-MM-DD').toDate() - moment(dateB1, 'YYYY-MM-DD').toDate();

  return dateA == null || dateB == null ? true : dateA - dateB;
}

export function SortByNumber(countA, countB) {
  // let dateA1 = dateA && dateA != "" ? dateA : "";
  // let dateB1 = dateB && dateB != "" ? dateB : "";
  // return dateA1 == "" || dateB1 == "" ? true : moment(dateA1, 'YYYY-MM-DD').toDate() - moment(dateB1, 'YYYY-MM-DD').toDate();

  return countA == null || countB == null ? true : countA - countB;
}

export function SortByName(nameA, nameB) {
  var nameA1 = nameA?.toLowerCase(); // ignore upper and lowercase
  var nameB1 = nameB?.toLowerCase(); // ignore upper and lowercase
  if (nameA1 < nameB1) {
    // console.log('value-1');
    return -1;
  }
  if (nameA1 > nameB1) {
    // console.log('value1');
    return 1;
  }
  // console.log('value0');
  // names must be equal
  return 0;
}

export class ServiceError extends Error {
  constructor(status, message, fullError = '') {
    super();
    this.status = status;
    this.message = message;
    this.fullError = fullError;
  }
}

//Status code meaning
// https://restfulapi.net/http-status-codes/
export async function FetchApi(url, apiOptions, timeout = 25000) {

  const options = jsonCopy(apiOptions);
  AppConstant.showConsoleLog(
    '------------------------------service start-----------------------',
  );
  AppConstant.showConsoleLog('url:', url);
  AppConstant.showConsoleLog('options:', options);
  AppConstant.showConsoleLog(
    '-----------------------------service end1-----------------------',
  );

  const controller = new AbortController();
  const signal = controller.signal;

  return Promise.race([
    new Promise((resolve, reject) => {
      fetch(url, {
        ...options,
        signal: signal,
      })
        .then(async res => {

          const data = await res.text();
          AppConstant.showConsoleLog('--------------------data:', res);
          if (IsJsonString(data)) {
            let values = [JSON.parse(data), res];
            if (values[1].status != 200) {
              AppConstant.showConsoleLog('--------------------error2:', values);
              // reject( new ServiceError(values[1].status, values[0].message))
              let msg = values[0]?.message || '';
              if (values[0]?.errors && typeof values[0]?.errors != 'string') {
                msg = values[0]?.errors[0]?.message;
              }
              // if (values[0]?.errors && typeof values[0]?.errors != 'string') {
              //     msg = values[0]?.errors[0]?.message;
              // }
              reject(new ServiceError(values[1].status, msg, JSON.stringify(values[0])));
              // reject new Error('msg');
            } else {
              AppConstant.showConsoleLog(
                '------service success response--->>',
                url,
                values[0],
              );

              if (
                (values[0]?.status != null &&
                  (!values[0]?.status)) ||
                (values[0]?.statusCode &&
                  (values[0]?.statusCode != 200 || !values[0]?.status))
              ) {
                AppConstant.showConsoleLog('--------------------error in success2:', values);
                // reject( new ServiceError(values[1].status, values[0].message))
                let msg = values[0]?.message || '';

                if (
                  values[0]?.errors &&
                  typeof values[0]?.errors != 'string' &&
                  values[0]?.errors?.length > 0
                ) {
                  msg = values[0]?.errors[0]?.message;
                } else if (msg == '') {
                  msg = values[0]?.status || '';
                }

                AppConstant.showConsoleLog('--------------------error in success21:', values[0]?.statusCode ?? 400, msg, JSON.stringify(values[0]));
                reject(new ServiceError(values[0]?.statusCode ?? 400, msg, JSON.stringify(values[0])));
              } else {
                let response = values[0];
                resolve(response);
              }
            }
            // AppConstant.showConsoleLog('----------res json:', values);
          } else {
            AppConstant.showConsoleLog('----------res text:', data);
            AppConstant.showConsoleLog('----------res text:', res);
            if (res.status == 404) {
              reject(new ServiceError(res.status, 'not found', JSON.stringify(res)));
            } else if (res.status == 400) {
              reject(new ServiceError(res.status, 'not found', JSON.stringify(res)));
            } else if (res.status != 200 && res.status != 201) {
              reject(new ServiceError(res.status, "Please try again. Something wrong!", JSON.stringify(res)));
            } else {
              resolve(data);
            }
          }
        })
        .catch(async err => {

          AppConstant.showConsoleLog('----------err:', err);
          reject(new ServiceError(90902, err.message, JSON.stringify(err)));
        });
    }),
    new Promise((_, reject) =>
      setTimeout(async () => {

        controller.abort();
        reject(new ServiceError(408, 'timeout', JSON.stringify({
          status: 408,
          msg: 'timeout'
        })));
        // reject(new Error('timeout'))
      }, timeout),
    ),
  ]);
}

export async function FetchAllSettledApi(iterators = []) {
  return new Promise((resolve, reject) => {
    const arrayValue = new Array(iterators.length).fill(null);
    iterators?.map((item, index) => {
      setTimeout(async () => {
        try {
          const res = await item;
          arrayValue[index] = {
            value: res,
            status: true,
          };
        } catch (error) {
          // AppConstant.showConsoleLog('error main:', item, error)
          arrayValue[index] = {
            value: null,
            error,
            status: false,
          };
        } finally {
          AppConstant.showConsoleLog('arrayValue:', arrayValue)
          if (!arrayValue.includes(null)) {
            resolve(arrayValue);
          }
        }
      }, 0);
    });
  });
}

export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}