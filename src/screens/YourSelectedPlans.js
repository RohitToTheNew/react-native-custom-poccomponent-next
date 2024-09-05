import { FlatList, Image, NativeModules, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AppConstant } from '../assets/AppConstant';
import { serviceConsts } from '../services/serviceCommonHandler';
import { SvgUri } from 'react-native-svg';

const appIconsWidths = ((AppConstant.dimension.width - 40 - 36 - (4 * 15)) / 5)

export default function YourSelectedPlans({ route }) {
  const { selectedApps, selectedAppsJson, packPrice, planSummary } = route.params;
  console.log(selectedApps, 'selectedAppsssss')
  const { TestConnectNative } = NativeModules
  const rootTag = route?.params?.rootTag;
  const Connectivity = NativeModules?.Connectivity
  const navigation = useNavigation();
  const [belowMsg, setBelowMsg] = useState('')

  useEffect(() => {
    let isAmazon = false;
    let isSunNext = false;

    isAmazon = selectedApps?.filter(innerItem => innerItem?.appName == "Prime")?.length > 0
    isSunNext = selectedApps?.filter(innerItem => innerItem?.appName == "SunNxt")?.length > 0

    let belowMsgTemp = ""
    if (isAmazon && AppConstant.getDrupalInfoToInnerApis().primeText != null) {
      belowMsgTemp += AppConstant.getDrupalInfoToInnerApis().primeText
    }
    if (isSunNext && AppConstant.getDrupalInfoToInnerApis().sunNxtText != null) {
      belowMsgTemp += AppConstant.getDrupalInfoToInnerApis().sunNxtText
    }

    belowMsgTemp += route?.params?.item?.appOnTv ?? ''

    setBelowMsg(AppConstant.replaceAll(belowMsgTemp, '#', '\n'))
  }, [])

  AppConstant.showConsoleLog('---------:', route?.params)

  const renderItemApps = ({ item }) => {
    const isSelected = selectedApps.includes(item.id);
    console.log(item, 'itemmmmmm')
    return (
      <View
        style={[styles.itemApps]}
      >
        <Image style={styles.imageFlexi199}
          source={{ uri: (`https://uatmanageapps.tataplay.com/cms-assets/images/${item.appId}.png`) }}
          resizeMode="cover" />
      </View>
    );
  };

  // const handleConfirm = () => {

  //   const selectedAppsDataIos = selectedApps
  //   const selectedAppsJson = JSON.stringify(selectedAppsDataIos);
  //   TestConnectNative?.goToSecondViewController?.(rootTag, selectedAppsJson);

  // };
  const handleConfirm = () => {
    console.log(selectedAppsJson, 'selectedAppsJson')
    if (Platform.OS == 'ios') {
      TestConnectNative?.goToSecondViewController?.(rootTag, JSON.stringify([]));
    } else {
      Connectivity?.goToSecondActivity(JSON.stringify(planSummary))
        .then(response => {
          console.log('Navigation success:', response);
        })
        .catch(error => {
          console.log('Navigation error:', error);
        });
    }
  }

  // const selectedAppsDataIos = selectedApps
  // const selectedAppsJson = JSON.stringify(selectedAppsDataIos);
  // TestConnectNative?.goToSecondViewController?.(rootTag, selectedAppsJson);
  return (
    <View style={[{
      backgroundColor: 'black', flexGrow: 1, width: '100%',
    }]}>

      <ScrollView style={{
        width: '100%',
        flex: 1,
      }}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20
          // justifyContent: 'flex-end',
        }}>

        <View
          style={{
            width: '100%',
            marginTop: 15,
            backgroundColor: '#efe8fb',
            borderRadius: 10,
            paddingHorizontal: 13,
            paddingVertical: 16
          }}

        >

          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {
              AppConstant.getDrupalInfoToInnerApis()?.field_crownImg != null &&
              // <Image
              //   style={{
              //     width: 25,
              //     height: 25,
              //     resizeMode: 'cover',
              //     backgroundColor: 'red'
              //   }}
              //   source={{ uri: AppConstant.getDrupalInfoToInnerApis()?.field_crownImg }}
              // // resizeMode="cover"
              // />
              <SvgUri
                width="25"
                height="25"
                uri={AppConstant.getDrupalInfoToInnerApis()?.field_crownImg}
              // uri="https://uatmanageapps.tataplay.com/cms-assets/images/crownBg.svg"
              />
            }

            <Text style={{
              flex: 1,
              fontSize: 16,
              color: "#220046",
              // fontWeight: 'bold',
              textAlign: 'left',
              marginLeft: 10
            }}>{route?.params?.item.packName}</Text>


          </View>

          <Text style={{
            marginTop: 10,
            fontSize: 15,
            color: "#220046",
            textAlign: 'left',
            fontWeight: '500',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              {`${route?.params?.selectedApps?.length}`}
            </Text>
            {' apps | upto '}
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              {`${route?.params?.item?.totalDevices}`}
            </Text>
            {' devices at a time'}
          </Text>

          {
            route?.params?.item?.deviceListInfo != null &&
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10
            }}>
              {
                route?.params?.item?.deviceListInfo?.img != null &&
                // <Image
                //   style={{
                //     width: 40,
                //     height: 25,
                //     resizeMode: 'cover',
                //     backgroundColor: 'red'
                //   }}
                //   source={{ uri: route?.params?.item?.deviceListInfo?.img }}
                // // resizeMode="cover"
                // />
                <SvgUri
                  width="40"
                  height="25"
                  uri={route?.params?.item?.deviceListInfo?.img}
                // uri="https://uatmanageapps.tataplay.com/cms-assets/images/crownBg.svg"
                />
              }

              <Text style={{
                flex: 1,
                fontSize: 15,
                color: "#220046",
                fontWeight: '600',
                textAlign: 'left',
                marginLeft: 10
              }}>{`Watch on ${route?.params?.item?.deviceListInfo?.title}`}</Text>
            </View>
          }

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {
              route?.params?.selectedApps?.map((applistItem, index) => {
                return <Image
                  key={`${applistItem?.appID}_${index}`}
                  style={{
                    marginTop: 15,
                    marginLeft: index % 5 == 0 ? 0 : 15,
                    width: appIconsWidths,
                    height: appIconsWidths,
                    resizeMode: 'cover',
                    // backgroundColor: 'red'
                  }}
                  source={{ uri: serviceConsts.baseUrls.imageBaseUrl + applistItem?.appId + '.png' }}
                // resizeMode="cover"
                />
              }
              )
            }
          </View>

          {
            belowMsg != "" &&
            <Text style={{
              width: '100%',
              fontSize: 12,
              color: "#220046",
              fontWeight: '500',
              textAlign: 'left',
              marginTop: 10,
              lineHeight: 20
            }}>{belowMsg}</Text>
          }

          {/* <Text style={{
            marginTop: 10,
            backgroundColor: '#e10092',
            color: '#ffffff',
            fontWeight: '700',
            width: '100%',
            textAlign: 'center',
            lineHeight: 40,
            fontSize: 16,
            borderRadius: 4
          }}>
            Choose Plan
          </Text> */}


        </View>
        {
          (planSummary?.userAction != null && !["UPGRADE", "UPGRADE_COMVIVA"].includes(planSummary?.userAction)) &&
          <Text style={{
            width: '100%',
            marginTop: 10,
            color: '#d6c6f4',
            fontSize: 13,
            fontWeight: '400',
            textAlign: 'left'
          }}>
            {`Plan change will be effective from ${planSummary?.planDate}`}
          </Text>
        }

      </ScrollView>

      {
        (planSummary == null || planSummary?.userAction == null || !["UPGRADE", "UPGRADE_COMVIVA"].includes(planSummary?.userAction)) ?
          <View style={[styles.enabledButton, { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 }]} >
            <Text style={{ color: 'white' }}>₹{packPrice}/month</Text>
            <TouchableOpacity onPress={handleConfirm} style={{ backgroundColor: 'purple', padding: 10, borderRadius: 4 }} >
              <Text style={{ color: 'white' }}>Confirm & Proceed</Text>
            </TouchableOpacity>

          </View>
          :
          <View style={{
            backgroundColor: 'rgba(29, 0, 61, 100)',
            alignItems: 'center',
            borderRadius: 3,
            paddingVertical: 10,
            justifyContent: 'center',
            paddingHorizontal: 25
          }} >

            <View style={{
              width: '100%',
              flexDirection: 'row'
            }}>
              <Text style={{
                flex: 1,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '500'
              }}>
                Plan Amount
              </Text>

              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '500'
              }}>
                {`₹${packPrice}`}
              </Text>
            </View>

            {
              planSummary?.currentBalance > 0 &&
              <View style={{
                marginTop: 10,
                width: '100%',
                flexDirection: 'row'
              }}>
                <Text style={{
                  flex: 1,
                  color: '#8e81a1',
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  Current Balance
                </Text>

                <Text style={{
                  color: '#8e81a1',
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  {`-₹${planSummary?.currentBalance}`}
                </Text>
              </View>
            }

            <View style={{
              width: '100%',
              height: 1,
              marginVertical: 10,
              backgroundColor: '#564372'
            }} />

            <View style={{
              width: '100%',
              flexDirection: 'row'
            }}>
              <Text style={{
                flex: 1,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '500'
              }}>
                Payable Amount
              </Text>

              <Text style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 'bold'
              }}>
                {`₹${planSummary?.payableAmount}`}

                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '400'
                }}>
                  {
                    (planSummary?.shortTenure == 'month' && ' / month') ||
                    (planSummary?.shortTenure == 'quarter' && ' / 3 month') ||
                    (planSummary?.shortTenure == 'year' && ' / year') ||
                    ` / ${planSummary?.tenure}`
                  }
                </Text>
              </Text>
            </View>

            <Text style={{
              width: '100%',
              marginTop: 10,
              color: '#ffffff',
              fontSize: 12,
              fontWeight: '400',
              textAlign: 'left'
            }}>
              {`You will be charged ₹${planSummary?.planAmount} from ${planSummary?.planDate} onwards`}
            </Text>

            <TouchableOpacity onPress={handleConfirm} style={{
              marginTop: 15,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              backgroundColor: '#e10092', padding: 10, borderRadius: 4
            }} >
              <Text style={{
                color: 'white', fontSize: 16,
                fontWeight: '500',
              }}>Proceed</Text>
            </TouchableOpacity>

          </View>
      }


    </View>
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