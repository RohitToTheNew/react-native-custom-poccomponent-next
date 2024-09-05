
import { SERVICE_FAIL, SERVICE_SUCCESS, TIMEOUT_ERROR } from "../global/constants";
import { CLEAR_CREATE_ACCESS_TOKEN_API_TYPE, CLEAR_CREATE_SESSION_API_TYPE, CLEAR_GET_PACKS_API_TYPE, CLEAR_PAGE_REDIRECTION_API_TYPE, CLEAR_PAGE_SUMMARY_API_TYPE, CLEAR_SAVE_PACKS_API_TYPE, CREATE_ACCESS_TOKEN_API_TYPE, CREATE_SESSION_API_TYPE, GET_PACKS_API_TYPE, PAGE_REDIRECTION_API_TYPE, PAGE_SUMMARY_API_TYPE, SAVE_PACKS_API_TYPE } from "./constants";

const initialState = {
  createSessionResponse: null,
  createAccessTokenResponse: null,
  getPacksResponse: null,
  savePacksResponse: null,
  pageRedirectionResponse: null,
  summaryResponse: null,
};

export default function ManageAppReducer(state = initialState, action) {
  switch (action.type) {
    case SERVICE_SUCCESS:
    case SERVICE_FAIL:
    case TIMEOUT_ERROR:
      switch (action.payload.type) {
        case CREATE_SESSION_API_TYPE:
          return {
            ...state,
            createSessionResponse: action.payload,
          };
        case CREATE_ACCESS_TOKEN_API_TYPE:
          return {
            ...state,
            createAccessTokenResponse: action.payload,
          };
        case GET_PACKS_API_TYPE:
          return {
            ...state,
            getPacksResponse: action.payload,
          };
        case SAVE_PACKS_API_TYPE:
          return {
            ...state,
            savePacksResponse: action.payload,
          };
        case PAGE_REDIRECTION_API_TYPE:
          return {
            ...state,
            pageRedirectionResponse: action.payload,
          };
        case PAGE_SUMMARY_API_TYPE:
          return {
            ...state,
            summaryResponse: action.payload,
          };
        default:
          return state;
      }
    case CLEAR_CREATE_SESSION_API_TYPE:
      return {
        ...state,
        createSessionResponse: null,
      };
    case CLEAR_CREATE_ACCESS_TOKEN_API_TYPE:
      return {
        ...state,
        createAccessTokenResponse: null,
      };
    case CLEAR_GET_PACKS_API_TYPE:
      return {
        ...state,
        getPacksResponse: null,
      };
    case CLEAR_SAVE_PACKS_API_TYPE:
      return {
        ...state,
        savePacksResponse: null,
      };
    case CLEAR_PAGE_REDIRECTION_API_TYPE:
      return {
        ...state,
        pageRedirectionResponse: null,
      };
    case CLEAR_PAGE_SUMMARY_API_TYPE:
      return {
        ...state,
        summaryResponse: null,
      };
    default:
      return state;
  }
}
