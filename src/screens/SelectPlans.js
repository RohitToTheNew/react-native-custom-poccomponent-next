import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  NativeModules,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  ToastAndroid
} from "react-native";
import { AppConstant } from '../assets/AppConstant';
import { useDispatch, useSelector } from 'react-redux';
import { jsonCopy } from '../utils/string';
import { CLEAR_PAGE_REDIRECTION_API_TYPE, CLEAR_PAGE_SUMMARY_API_TYPE, CLEAR_SAVE_PACKS_API_TYPE } from '../services/apiCall/constants';
import { pageRedirectionApi, pageSummaryApi, savePacksApi } from '../services/apiCall/action';

const appIconsWidths = ((AppConstant.dimension.width - 40 - (4 * 20)) / 4)
export default function SelectPlans({ route }) {
  const dispatch = useDispatch();
  const uniqueKey = useRef();
  const navigationInfo = useRef();
  const savePacksResponse = useSelector(state => state.manageAppReducer.savePacksResponse);
  const pageRedirectionResponse = useSelector(state => state.manageAppReducer.pageRedirectionResponse);
  const summaryResponse = useSelector(state => state.manageAppReducer.summaryResponse);

  const [showLoader, setShowLoader] = useState(false);
  const navigation = useNavigation();
  const appList = route.params.appList.BUCKET1
  const packPrice = route.params.packPrice
  console.log(packPrice, 'packPrice', route?.params)
  console.log('route?.params?.item?.totalApps?.max', route?.params?.item?.totalApps?.BUCKET1?.max)
  const { TestConnectNative } = NativeModules
  const rootTag = route?.params?.rootTag;
  const Connectivity = NativeModules?.Connectivity

  //https://uatmanageapps.tataplay.com/cms-assets/images/{appId}png

  const [selectedApps, setSelectedApps] = useState([]);

  useEffect(() => {
    if (
      savePacksResponse != null &&
      savePacksResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == savePacksResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(savePacksResponse);
      dispatch({
        type: CLEAR_SAVE_PACKS_API_TYPE,
      });

      AppConstant.showConsoleLog('savePacksResponse:', resp);
      if (resp.error == null && resp?.data?.uuid) {

        uniqueKey.current = Math.random();
        dispatch(
          pageRedirectionApi({
            uniqueKey: uniqueKey.current,
            body: {
              page: "Tenure-Selection",
              type: "",
              uuid: resp?.data?.uuid
            }
          }),
        );
      } else {
        setShowLoader(false)
      }
    }
  }, [savePacksResponse]);

  useEffect(() => {
    if (
      pageRedirectionResponse != null &&
      pageRedirectionResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == pageRedirectionResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(pageRedirectionResponse);
      dispatch({
        type: CLEAR_PAGE_REDIRECTION_API_TYPE,
      });

      AppConstant.showConsoleLog('pageRedirectionResponse:', resp);
      if (resp.error == null) {

        uniqueKey.current = Math.random();
        dispatch(
          pageSummaryApi({
            uniqueKey: uniqueKey.current,
            uuid: resp?.payload?.body?.uuid
          }),
        );
      } else {
        setShowLoader(false)
      }
    }
  }, [pageRedirectionResponse]);

  useEffect(() => {
    if (
      summaryResponse != null &&
      summaryResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == summaryResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(summaryResponse);
      dispatch({
        type: CLEAR_PAGE_SUMMARY_API_TYPE,
      });

      AppConstant.showConsoleLog('summaryResponse:', resp);
      setShowLoader(false)
      if (resp.error == null) {

        navigation.navigate('YourSelectedPlans', {
          ...navigationInfo.current,
          planSummary: resp?.data?.data
        })
      }
    }
  }, [summaryResponse]);

  const handleSelectApp = (id) => {
    setSelectedApps((prevSelectedApps) => {
      if (prevSelectedApps.includes(id)) {
        return prevSelectedApps.filter(appId => appId !== id);
      } else if (prevSelectedApps.length < route?.params?.item?.totalApps?.BUCKET1?.max) {
        return prevSelectedApps.length < route?.params?.item?.totalApps?.BUCKET1?.max ? [...prevSelectedApps, id] : prevSelectedApps;
      } else {
        Platform.OS == 'android' && ToastAndroid.show(`You have already selected ${route?.params?.item?.totalApps?.BUCKET1?.max} Apps. Remove one app to select this one.`, ToastAndroid.SHORT);
        return prevSelectedApps;

      }
    });
  };


  const renderItemApps = ({ item, index }) => {
    const isSelected = selectedApps.includes(item.appName);
    return (
      <View style={{
        marginLeft: index % 4 == 0 ? 0 : 20,
        marginTop: 20,
        // backgroundColor: 'cyan',
        width: appIconsWidths,
      }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.itemApps, isSelected && styles.selectedApp, {

          }]}
          onPress={() => handleSelectApp(item.appName)}
        >
          <Image style={styles.imageFlexi199}
            source={{ uri: (`https://uatmanageapps.tataplay.com/cms-assets/images/${item.appId}.png`) }}
            resizeMode="cover" />

        </TouchableOpacity>
        <Text style={styles.titleApps}>{item.appName}</Text>
      </View>
    );
  };

  // const handleConfirm = () => {

  //   TestConnectNative?.goToSecondViewController?.(rootTag,"Heloooo")
  // };


  const handleConfirm = () => {
    if (isConfirmButtonEnabled) {
      const selectedAppsData = appList.filter(app => selectedApps.includes(app.appName));
      // navigation.navigate('YourSelectedPlans', { selectedApps: selectedAppsData, selectedAppsJson: JSON.stringify(selectedApps), packPrice: packPrice })
      // navigation.navigate('YourSelectedPlans', { selectedApps: selectedAppsData, packPrice: packPrice, item: route?.params?.item, type: 'Flexi' })


      const item = route?.params?.item
      navigationInfo.current = { selectedApps: selectedAppsData, packPrice: packPrice, item: item, type: 'Flexi' }
      AppConstant.showConsoleLog(item)
      AppConstant.showConsoleLog(selectedAppsData)
      const appwithBucket = selectedAppsData?.map(selectItem => selectItem?.appId)
      AppConstant.showRetryAlert(() => {
        setShowLoader(true)
        uniqueKey.current = Math.random();
        dispatch(
          savePacksApi({
            uniqueKey: uniqueKey.current,
            body: {
              appwithBucket: {
                BUCKET1: appwithBucket
              },
              journeySource: "MYOP",
              packId: item.packId,
              packages: item.packName,
              productClass: item.productClass,
              tenure: item?.tenureInfo?.[0]?.tenure ?? ''
            },
          }),
        );
      });

    }
  }
  const isConfirmButtonEnabled = selectedApps.length >= route?.params?.item?.totalApps?.BUCKET1?.max;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'black' }]}>
      <View style={{ backgroundColor: 'black', paddingHorizontal: 20, paddingBottom: 20, }}>

        <FlatList
          data={appList}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.appId}
          renderItem={renderItemApps}
          contentContainerStyle={styles.listContainer}
          style={{
            // flexGrow: 1,
          }}
          numColumns={4}
        />


        <TouchableOpacity
          style={[styles.confirmButton, isConfirmButtonEnabled && styles.enabledButton, { position: 'absolute', bottom: 0, }]}
          disabled={!isConfirmButtonEnabled}
          onPress={handleConfirm}
        >
          <Text style={{ color: 'white' }}>Confirm & Proceed</Text>
        </TouchableOpacity>

        {
          showLoader && <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: '#00000088',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ActivityIndicator size={'large'} color={'#e10092'} />
          </View>
        }
      </View>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "white",
  // },
  highScoresTitle: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  scores: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 60,
    alignSelf: 'center'
  },
  //   item: {
  //     backgroundColor: 'lavender',
  //     marginHorizontal: 10,
  //     padding: 20,
  //     width: 150,
  //     height:150,
  //     margin:10
  //   },
  itemApps: {
    borderRadius: 5,
    // backgroundColor: 'lavender',
    // justifyContent:'center',
    padding: 1,
    width: appIconsWidths,
    height: appIconsWidths,
    // margin:10,
    // marginHorizontal: 30,

    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleApps: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    // backgroundColor: 'red',
    marginTop: 4
  },
  confirmButton: {
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 10,
    margin: 15,
    width: '100%'
  },
  enabledButton: {
    backgroundColor: 'rgba(225, 0, 146, 100)'
  },
  selectedApp: {
    borderWidth: 2,
    borderColor: 'rgba(225, 0, 146, 100)',
  },
  imageFlexi199: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // backgroundColor: 'red',
    // borderRadius: 5,
    // marginTop: 20
  }
});