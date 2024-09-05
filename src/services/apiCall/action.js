import { AppConstant } from "../../assets/AppConstant";
import { SERVICE_FAIL, SERVICE_INPROGRESS, SERVICE_SUCCESS, TIMEOUT_ERROR } from "../global/constants";
import { FetchAllSettledApi, FetchApi, serviceConsts } from "../serviceCommonHandler";
import { CREATE_ACCESS_TOKEN_API_TYPE, CREATE_SESSION_API_TYPE, GET_PACKS_API_TYPE, PAGE_REDIRECTION_API_TYPE, PAGE_SUMMARY_API_TYPE, SAVE_PACKS_API_TYPE } from "./constants";
import { parseOrderDetail } from "./parser";


export const getAccessToken = params => dispatch => {

    let payloadType = CREATE_ACCESS_TOKEN_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });

    let serviceUrl = `${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.auth}${serviceConsts.endPoints.authToken}`

    let options = {
        method: serviceConsts.method.get,
        ...AppConstant.getServiceHeaderData(),
        body: null,
    };
    FetchApi(serviceUrl, options)
        .then(response => {
            AppConstant.showConsoleLog('accesstoken get response:', response)

            AppConstant.setUserAccessToken(response?.data?.accessToken);
            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: response,
                    payload: params,
                },
            });

        })
        .catch(error => {

            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload: params,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload: params,
                },
            });
        });
};

export const createSessionDrupalInfo = payload => dispatch => {

    let payloadType = CREATE_SESSION_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });


    let options = {
        method: serviceConsts.method.get,
        ...AppConstant.getServiceHeaderData(),
        body: null,
    };


    const createSessionApi = FetchApi(`${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.auth}${serviceConsts.endPoints.createSession}`, options);
    const drupalTextInfoApi = FetchApi(`${serviceConsts.baseUrls.drupalApi}${serviceConsts.endPoints.drupalTextInfo}`, options);
    const drupalOtherInfoApi = FetchApi(`${serviceConsts.baseUrls.drupalApi}${serviceConsts.endPoints.drupalOtherInfo}`, options);
    const drupalOtherInfo2Api = FetchApi(`${serviceConsts.baseUrls.drupalApi}${serviceConsts.endPoints.drupalOtherInfo2}`, options);


    FetchAllSettledApi([createSessionApi, drupalTextInfoApi, drupalOtherInfoApi, drupalOtherInfo2Api])
        // FetchApi(upiServiceUrl, options)
        .then(response => {

            AppConstant.showConsoleLog('res :-', response);

            if (response[0]?.value?.data?.sessionId) {
                AppConstant.setUserSessionId(response[0]?.value?.data?.sessionId)
            }

            let drupalInfoToInnerApis = {};
            if (response[1]?.value) {
                drupalInfoToInnerApis.listOfDevices = response[1]?.value?.listOfDevices ?? null;
                drupalInfoToInnerApis.primeText = response[1]?.value?.primeText ?? null;
                drupalInfoToInnerApis.sunNxtText = response[1]?.value?.sunNxtText ?? null;
            }
            if (response[2]?.value?.data?.field_json_data) {
                const jsonData = response[2]?.value?.data?.field_json_data;
                drupalInfoToInnerApis.field_crownImg = jsonData?.field_crown?.url ?? null;
                drupalInfoToInnerApis.bingePlans = jsonData?.myop?.bingePlans ?? null;
                drupalInfoToInnerApis.flexiPlans = jsonData?.myop?.flexiPlans ?? null;
                drupalInfoToInnerApis.bannerSection = jsonData?.bannerSection ?? null;
            }
            if (response[3]?.value?.data?.field_json_data) {
                const jsonData = response[3]?.value?.data?.field_json_data;
                drupalInfoToInnerApis.monthly_image = jsonData?.monthly_image?.url ?? null;
                drupalInfoToInnerApis.quarterly_image = jsonData?.quarterly_image?.url ?? null;
                drupalInfoToInnerApis.yearly_image = jsonData?.yearly_image?.url ?? null;
            }

            if (Object.keys(drupalInfoToInnerApis).length == 0) {
                drupalInfoToInnerApis = null
            }
            AppConstant.setDrupalInfoToInnerApis(drupalInfoToInnerApis)
            AppConstant.showConsoleLog('getDrupalInfoToInnerApis:', drupalInfoToInnerApis)

            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: response,
                    payload,
                },
            });
        })
        .catch(error => {
            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload,
                    },
                });
                return;
            }
            if (error?.status == (404 || 400)) {
                dispatch({
                    type: SERVICE_SUCCESS,
                    payload: {
                        type: payloadType,
                        data: [],
                        payload,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload,
                },
            });
        });
};

export const getPacksApi = payload => dispatch => {

    let payloadType = GET_PACKS_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });

    let serviceUrl = `${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.readContent}${serviceConsts.endPoints.packList}`

    let options = {
        method: serviceConsts.method.get,
        ...AppConstant.getServiceHeaderData(),
        body: null,
    };
    FetchApi(serviceUrl, options)
        .then(response => {
            AppConstant.showConsoleLog('accesstoken get response:', response)
            const res = parseOrderDetail(response)
            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: res,
                    payload: payload,
                },
            });

        })
        .catch(error => {

            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload: payload,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload: payload,
                },
            });
        });
};

export const savePacksApi = payload => dispatch => {

    let payloadType = SAVE_PACKS_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });

    let serviceUrl = `${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.writeContent}${serviceConsts.endPoints.savePacks}`

    let options = {
        method: serviceConsts.method.post,
        ...AppConstant.getServiceHeaderData(),
        body: JSON.stringify(payload.body),
    };
    FetchApi(serviceUrl, options)
        .then(response => {
            AppConstant.showConsoleLog('savePacksApi get response:', response)
            const res = {
                uuid: response?.data?.uuid ?? null
            }
            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: res,
                    payload: payload,
                },
            });

        })
        .catch(error => {

            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload: payload,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload: payload,
                },
            });
        });
};

export const pageRedirectionApi = payload => dispatch => {

    let payloadType = PAGE_REDIRECTION_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });

    let serviceUrl = `${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.writeContent}${serviceConsts.endPoints.pageRedirection}`

    let options = {
        method: serviceConsts.method.post,
        ...AppConstant.getServiceHeaderData(),
        body: JSON.stringify(payload.body),
    };
    FetchApi(serviceUrl, options)
        .then(response => {
            AppConstant.showConsoleLog('pageRedirectionApi get response:', response)

            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: response,
                    payload: payload,
                },
            });

        })
        .catch(error => {

            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload: payload,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload: payload,
                },
            });
        });
};

export const pageSummaryApi = payload => dispatch => {

    let payloadType = PAGE_SUMMARY_API_TYPE;
    dispatch({
        type: SERVICE_INPROGRESS,
    });

    let serviceUrl = `${serviceConsts.baseUrls.baseUrl}${serviceConsts.baseUrls.writeContent}${serviceConsts.endPoints.pageSummary}${payload.uuid}`
    AppConstant.showConsoleLog(serviceUrl)

    let options = {
        method: serviceConsts.method.get,
        ...AppConstant.getServiceHeaderData(),
        body: null,
    };
    FetchApi(serviceUrl, options)
        .then(response => {
            AppConstant.showConsoleLog('pageSummaryApi get response:', response)

            dispatch({
                type: SERVICE_SUCCESS,
                payload: {
                    type: payloadType,
                    data: response,
                    payload: payload,
                },
            });

        })
        .catch(error => {

            if (error?.status == 408) {
                dispatch({
                    type: TIMEOUT_ERROR,
                    payload: {
                        type: payloadType,
                        error: 'timeout',
                        payload: payload,
                    },
                });
                return;
            }
            dispatch({
                type: SERVICE_FAIL,
                payload: {
                    type: payloadType,
                    error: error,
                    payload: payload,
                },
            });
        });
};
