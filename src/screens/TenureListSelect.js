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
  ActivityIndicator
} from "react-native";
import { AppConstant } from '../assets/AppConstant';
import { useDispatch, useSelector } from 'react-redux';
import { jsonCopy } from '../utils/string';
import { CLEAR_PAGE_REDIRECTION_API_TYPE, CLEAR_PAGE_SUMMARY_API_TYPE, CLEAR_SAVE_PACKS_API_TYPE } from '../services/apiCall/constants';
import { pageRedirectionApi, pageSummaryApi, savePacksApi } from '../services/apiCall/action';
import { SvgUri } from 'react-native-svg';

const appIconsWidths = ((AppConstant.dimension.width - 40 - (4 * 20)) / 3)
export default function TenureListSelect({ route }) {
  const dispatch = useDispatch();
  const uniqueKey = useRef();
  const navigationInfo = useRef();
  const savePacksResponse = useSelector(state => state.manageAppReducer.savePacksResponse);
  const pageRedirectionResponse = useSelector(state => state.manageAppReducer.pageRedirectionResponse);
  const summaryResponse = useSelector(state => state.manageAppReducer.summaryResponse);

  const tenureList = useRef(route?.params?.item?.tenureList)
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState(route?.params?.item?.dminusX ? (route?.params?.item?.isCurrentPlan && route?.params?.item?.currentPlanPackIdIndex == 0 ? 1 : 0) : 0);
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

  const handleConfirm = () => {
    const selectedAppsData = appList;
    // navigation.navigate('YourSelectedPlans', { selectedApps: selectedAppsData, selectedAppsJson: JSON.stringify(selectedApps), packPrice: packPrice })
    // navigation.navigate('YourSelectedPlans', { selectedApps: selectedAppsData, packPrice: packPrice, item: route?.params?.item, type: 'Flexi' })


    const item = route?.params?.item
    navigationInfo.current = { selectedApps: selectedAppsData, packPrice: tenureList.current[selectedTenure]?.totalAmount, item: item, type: 'Fixed' }
    AppConstant.showConsoleLog(item)
    AppConstant.showConsoleLog(selectedAppsData)

    const selectedTenureValue = tenureList.current[selectedTenure]
    AppConstant.showConsoleLog(selectedTenureValue)
    AppConstant.showRetryAlert(() => {
      setShowLoader(true)
      uniqueKey.current = Math.random();

      dispatch(
        savePacksApi({
          uniqueKey: uniqueKey.current,
          body: {
            appwithBucket: {},
            journeySource: "CYOP",
            packId: selectedTenureValue.packId,
            packages: selectedTenureValue.packName,
            productClass: item.productClass,
            tenure: selectedTenureValue.tenure ?? ''
          },
        }),
      );
    });
  }

  return (
    <View style={[{ backgroundColor: 'black', paddingHorizontal: 20, flexGrow: 1, width: '100%', }]}>

      <ScrollView style={{
        width: '100%',
        flex: 1,
      }}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          // justifyContent: 'flex-end',
        }}>

        <View style={{
          width: '100%',
          flexGrow: 1,
          marginTop: 15,
          paddingHorizontal: 13,
          paddingBottom: 16,
          alignItems: 'center'
        }}>

          <Text style={{
            fontSize: 15,
            color: "#FFFFFF",
            textAlign: 'center',
            fontWeight: '400',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '500',
            }}>
              {`${appList?.length} apps `}
            </Text>
            {
              `on ${route?.params?.item?.deviceListInfo?.title}`
            }
          </Text>

          <Text style={{
            marginTop: 10,
            fontSize: 14,
            color: "#ffffff",
            textAlign: 'left',
            fontWeight: '500',
            marginBottom: 10,
          }}>
            {`${route?.params?.item?.totalDevices} devices at the same time`}
          </Text>

          {
            tenureList.current?.map((tenureItem, index) => {
              return <View style={{
                width: '100%',
                marginTop: 15,
                opacity: (route?.params?.item?.dminusX && route?.params?.item?.currentPlanPackIdIndex == index) ? 0.6 : 1
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                  {
                    tenureItem?.offer > 0 &&
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '500',
                      lineHeight: 20,
                      borderRadius: 3,
                      bottom: -2,
                      width: 55,
                      alignSelf: 'flex-end',
                      marginRight: 15,
                      textAlign: 'center',
                      backgroundColor: '#6b00dd',
                      color: '#ffff',
                    }}>
                      {`Save ${tenureItem?.offer}%`}
                    </Text>
                  }

                  {route?.params?.item?.isCurrentPlan != null && route?.params?.item?.currentPlanPackId == tenureItem?.packId &&
                    <Text style={{
                      marginRight: 15,
                      lineHeight: 20,
                      borderRadius: 5,
                      width: 90,
                      textAlign: 'center',
                      alignSelf: 'flex-start',
                      backgroundColor: '#6b00dd',
                      // border-radius: 6px 6px 0px 0px;
                      // padding: 5px 5px 2px;
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: '500',
                      bottom: -2
                    }}>
                      Current Plan
                    </Text>
                  }
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    (!route?.params?.item?.dminusX || route?.params?.item?.currentPlanPackIdIndex != index) && setSelectedTenure(index)
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#ECEDFEFF',
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: selectedTenure == index ? "#e10092" : "transparent",
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>

                  {/* drupalInfoToInnerApis.monthly_image = jsonData?.monthly_image?.url ?? null;
                drupalInfoToInnerApis.quarterly_image = jsonData?.myop?.quarterly_image ?? null;
                drupalInfoToInnerApis.yearly_image = jsonData?.myop?.yearly_image ?? null; */}

                  {
                    ((tenureItem?.shortTenure == 'month' && AppConstant.getDrupalInfoToInnerApis()?.monthly_image != null) ||
                      (tenureItem?.shortTenure == 'quarter' && AppConstant.getDrupalInfoToInnerApis()?.quarterly_image != null) ||
                      (tenureItem?.shortTenure == 'year' && AppConstant.getDrupalInfoToInnerApis()?.yearly_image != null)) &&
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        marginRight: 10
                      }}
                      source={{
                        uri: (
                          (tenureItem?.shortTenure == 'month' && AppConstant.getDrupalInfoToInnerApis()?.monthly_image) ||
                          (tenureItem?.shortTenure == 'quarter' && AppConstant.getDrupalInfoToInnerApis()?.quarterly_image) ||
                          (tenureItem?.shortTenure == 'year' && AppConstant.getDrupalInfoToInnerApis()?.yearly_image)
                        )
                      }}
                      resizeMode="cover"
                    />
                  }

                  <Text style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#000000',
                    textAlign: 'left'
                  }}>
                    {
                      (tenureItem?.shortTenure == 'month' && '1 month') ||
                      (tenureItem?.shortTenure == 'quarter' && '3 months') ||
                      (tenureItem?.shortTenure == 'year' && 'Annual') ||
                      tenureItem?.tenure
                    }
                  </Text>

                  {
                    tenureItem?.offer > 0 &&


                    <Text style={{
                      color: '#000000',
                      fontSize: 15,
                      textDecorationLine: 'line-through',
                      marginRight: 5
                    }}>
                      ₹{tenureItem?.totalMrp}
                    </Text>
                  }


                  <Text style={{
                    color: '#000000',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>
                    ₹{tenureItem?.totalAmount}
                  </Text>

                  {
                    (!route?.params?.item?.dminusX || route?.params?.item?.currentPlanPackIdIndex != index) &&
                    <View style={{
                      marginLeft: 10,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedTenure == index ? '#e10092' : '#020005'
                    }}>
                      {selectedTenure == index &&
                        <View style={{
                          height: 6,
                          width: 6,
                          borderRadius: 3,
                          backgroundColor: '#ffffff'
                        }} />
                      }
                    </View>
                  }

                </TouchableOpacity>
              </View>
            })
          }

        </View>

      </ScrollView >

      <View style={[styles.enabledButton, { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }]} >
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          ₹{tenureList.current[selectedTenure]?.totalAmount}
          <Text style={{
            fontSize: 14,
            fontWeight: '400'
          }}>
            {
              (tenureList.current[selectedTenure]?.shortTenure == 'month' && '/ month') ||
              (tenureList.current[selectedTenure]?.shortTenure == 'quarter' && '/ 3 month') ||
              (tenureList.current[selectedTenure]?.shortTenure == 'year' && '/ year') ||
              `/ ${tenureList.current[selectedTenure]?.tenure}`
            }
          </Text>
        </Text>
        <TouchableOpacity onPress={handleConfirm} style={{ backgroundColor: '#e10092', padding: 10, paddingHorizontal: 20, borderRadius: 4 }} >
          <Text style={{ color: 'white' }}>Proceed</Text>
        </TouchableOpacity>

      </View>

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

    </View >
  );
};


const styles = StyleSheet.create({
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
    paddingVertical: 16,
    alignSelf: 'flex-start'
  },
  itemApps: {
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
    width: 70,
    height: 70,
    margin: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleApps: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 10,
    margin: 15,
  },
  enabledButton: {
    backgroundColor: 'rgba(29, 0, 61, 100)',
    alignItems: 'center',
    borderRadius: 3,
    paddingVertical: 10,
    height: 90,
    justifyContent: 'center'
    // margin: 15,
  },
  selectedApp: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  imageFlexi199: {
    width: 70,
    height: 70,
  }
});