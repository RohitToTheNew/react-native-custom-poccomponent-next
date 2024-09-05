import NetInfo from '@react-native-community/netinfo';
import { Alert, Dimensions, Platform } from 'react-native';

class AppConstant {
  static timeout = 25000;
  static midTimeout = 60000;
  static maxTimeout = 120000;

  static dimension = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    aspectRatio: Dimensions.get('window').width / 320,
  };

  static isIosDevice() {
    if (Platform.OS === 'ios') {
      return true;
    }
    return false;
  }

  static deviceToken = null;
  static getDeviceToken() {
    return this.deviceToken;
  }
  static setDeviceToken(deviceToken) {
    this.deviceToken = deviceToken;
  }

  static drupalInfoToInnerApis = null;
  static getDrupalInfoToInnerApis() {
    return this.drupalInfoToInnerApis;
  }
  static setDrupalInfoToInnerApis(drupalInfoToInnerApis) {
    this.drupalInfoToInnerApis = drupalInfoToInnerApis;
  }

  static replaceAll(str, find, replace) {
    var re = new RegExp(find, 'g');
    return str.replace(re, replace);
  }

  static randomNumber(min, max) {
    var min = min;
    //  Get the maximum value my getting the size of the
    //  array and subtracting by 1.
    var max = max + 1;
    let random = Math.floor(Math.random() * (max - min)) + min;
    //Get a random integer between the min and max value.
    return random == max ? max - 1 : random;
  }

  static showConsoleLog(message, ...optionalParams) {
    console.log(message, ...optionalParams);
  }

  static checkInternet(callback = () => { }) {
    NetInfo.fetch().then(state => {
      callback(state.isConnected);
    });
  }

  static showRetryAlert(
    callback = () => { },
    isShowAlert = true,
    isCancel = false,
    canceCallback = () => { },
  ) {
    // setTimeout(() => {
    NetInfo.fetch().then(state => {
      // console.log('INTERNET STATE', state);
      if (state.isConnected) {
        callback();
      } else {
        if (isShowAlert && isCancel) {
          Alert.alert(
            'Network Issue',
            'You are offline. Please check your internet connection.',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  canceCallback();
                },
                style: 'cancel',
              },
              {
                text: 'Retry',
                onPress: () => {
                  setTimeout(() => {
                    this.showRetryAlert(callback, isShowAlert, isCancel);
                  }, 100);
                },
              },
            ],
            { cancelable: false },
          );
        } else if (isShowAlert && !isCancel) {
          Alert.alert(
            'Network Issue',
            'You are offline. Please check your internet connection.',
            [
              {
                text: 'Retry',
                onPress: () => {
                  setTimeout(() => {
                    this.showRetryAlert(callback, isShowAlert, isCancel);
                  }, 100);
                },
              },
            ],
            { cancelable: true },
          );
        }
      }
    });
    // }, 100);
  }

  static showRetryMessageAlert({
    message = '',
    callback = () => { },
    canceCallback = () => { },
  }) {
    setTimeout(() => {
      Alert.alert(
        'Oops!',
        message,
        [
          {
            text: 'Cancel',
            onPress: () => {
              canceCallback();
            },
            style: 'cancel',
          },
          {
            text: 'Retry',
            onPress: () => {
              setTimeout(() => {
                callback();
              }, 100);
            },
          },
        ],
        { cancelable: false },
      );
    }, 100);
  }

  static showAlert({
    title = '',
    msg = '',
    ok = 'Ok',
    canCancel = false,
    cancel = 'Cancel',
    callback = () => { },
  }) {
    // setTimeout(() => {
    if (!canCancel) {
      Alert.alert(
        title,
        msg,
        [
          {
            text: ok,
            onPress: () => {
              callback();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        title,
        msg,
        [
          { text: cancel, onPress: () => { }, style: 'cancel' },
          {
            text: ok,
            onPress: () => {
              callback();
            },
          },
        ],
        { cancelable: false },
      );
    }
    // }, 100);
  }



  //------ Start API-----
  static checksumToken = null;
  static getChecksumToken() {
    return this.checksumToken;
  }
  static setChecksumToken(checksumToken) {
    this.checksumToken = checksumToken;
  }

  static userAccessToken = null;
  static getUserAccessToken() {
    return this.userAccessToken;
  }
  static setUserAccessToken(userAccessToken) {
    this.userAccessToken = userAccessToken;
  }

  static userChecksumValue = null;
  static getUserChecksumValue() {
    return this.userChecksumValue;
  }
  static setUserChecksumValue(userChecksumValue) {
    this.userChecksumValue = userChecksumValue;
  }

  static userSessionId = null;
  static getUserSessionId() {
    return this.userSessionId;
  }
  static setUserSessionId(userSessionId) {
    this.userSessionId = userSessionId;
  }

  static getServiceHeader(type = 0) {

    switch (type) {
      case 1:
        return {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          "checksum": this.getChecksumToken(),
          "access-token": this.getUserAccessToken()
            ? `Bearer ${this.getUserAccessToken()}`
            : '',
          "session-id": this.getUserSessionId()
            ? `Bearer ${this.getUserSessionId()}`
            : '',
        };
      case 2:
        return {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          "checksum": AppConstant.getChecksumToken(),
          "access-token": this.getUserAccessToken()
            ? `Bearer ${this.getUserAccessToken()}`
            : '',
          "session-id": this.getUserSessionId()
            ? `Bearer ${this.getUserSessionId()}`
            : '',

        };
      case 3:
        return {
          Accept: 'application/json',
          'Content-Type': 'text/plain',
          "checksum": AppConstant.getChecksumToken(),
          "access-token": this.getUserAccessToken()
            ? `Bearer ${this.getUserAccessToken()}`
            : '',
          "session-id": this.getUserSessionId()
            ? `Bearer ${this.getUserSessionId()}`
            : '',

        };
      default:
        return {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "checksum": AppConstant.getChecksumToken(),
          "access-token": this.getUserAccessToken()
            ? `Bearer ${this.getUserAccessToken()}`
            : '',
          "session-id": this.getUserSessionId()
            ? `Bearer ${this.getUserSessionId()}`
            : '',

        };
    }
  }

  static getServiceHeaderData(type = 0) {
    return {
      headers: this.getServiceHeader(type),
      credentials: 'include',
    };
  }

  static urlEncodeDataBody(data) {
    var urlEncodedData = '';
    var urlEncodedDataPairs = [];
    urlEncodedDataPairs = [...data._parts]?.map(e => encodeURIComponent(e[0]) + '=' + encodeURIComponent(e[1])); //// expand the elements from the .entries() iterator into an actual array and transform the elements into encoded key-value-pairs
    urlEncodedData = urlEncodedDataPairs.join('&');
    return urlEncodedData;
  }

  static rawDataBody(data) {
    let json = {};
    [...data._parts]?.map(e => {
      json[e[0]] = e[1];
    });
    return JSON.stringify(json);
  }
  //------ End API-----
}

export { AppConstant };
