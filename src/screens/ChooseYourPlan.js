import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { useDispatch, useSelector } from 'react-redux';
import { manageAppList } from '../assets/mockDataJson/manageapp';
import { AppConstant } from "../assets/AppConstant";
import { createSessionDrupalInfo, getAccessToken, getPacksApi, pageRedirectionApi, pageSummaryApi, savePacksApi } from "../services/apiCall/action";
import { jsonCopy } from "../utils/string";
import { CLEAR_CREATE_ACCESS_TOKEN_API_TYPE, CLEAR_CREATE_SESSION_API_TYPE, CLEAR_MANAGE_API_TYPE, CLEAR_PAGE_REDIRECTION_API_TYPE, CLEAR_PAGE_SUMMARY_API_TYPE, CLEAR_SAVE_PACKS_API_TYPE } from "../services/apiCall/constants";
import { serviceConsts } from "../services/serviceCommonHandler";
import { SvgUri } from "react-native-svg";

const Connectivity = NativeModules?.Connectivity
const handleBackButton = () => {
  BackHandler.exitApp(); // Exit the app when back button is pressed
  // Alternatively, you can use BackHandler to handle custom navigation logic
  // For example:
  // navigation.goBack(); // If using React Navigation
};

const renderItem = ({ item }) => (
  <View style={[styles.item, { alignItems: 'center', }]}>
    <Image
      style={styles.image}
      source={{ uri: item.imageUrl }}
      resizeMode="cover"
    />
    <Text style={styles.title}>{item.title}</Text>

  </View>
);

const appIconsWidths = ((AppConstant.dimension.width - 40 - 36 - (4 * 15)) / 5)
export default function ChooseYourPlan({ route }) {

  const dispatch = useDispatch();
  const uniqueKey = useRef();
  const navigationInfo = useRef();
  const createSessionResponse = useSelector(state => state.manageAppReducer.createSessionResponse);
  const createAccessTokenResponse = useSelector(state => state.manageAppReducer.createAccessTokenResponse);
  const getPacksResponse = useSelector(state => state.manageAppReducer.getPacksResponse);
  const savePacksResponse = useSelector(state => state.manageAppReducer.savePacksResponse);
  const pageRedirectionResponse = useSelector(state => state.manageAppReducer.pageRedirectionResponse);
  const summaryResponse = useSelector(state => state.manageAppReducer.summaryResponse);

  const [showLoader, setShowLoader] = useState(true);

  const [staticList, setStaticList] = useState([])
  const [flexiPlanList, setFlexiPlanList] = useState([])
  const [bingePlanList, setBingePlanList] = useState([])

  // const androidProps = route?.payload?.androidProps;
  // console.log('acessToken', androidProps)
  const navigation = useNavigation();
  // const { action, platform } = props?.initialProps;

  useEffect(() => {
    // AppConstant.setUserAccessToken(androidProps)
    AppConstant.setChecksumToken("3HJCB79jPM5Re0tpi48rJw38Ay8tK4zardUdX2zmXZeW7ly707raRtQ6yZMCYNBbWXLULMEZ@plus@25W@plus@x@slash@PqzEjsEDR1y5a@plus@9gXz7x36ugMVEJ8GiRPIxhP5IdT7VGcqijh1D@slash@KUc4vfwnc6Zl3mEmObR82jhLa7VeU9zk9Xm59Qy5J7wSb@plus@E8ISPNzOYzSzW9CpF3wQinG0JYS5@slash@bbqDEBSPFJC@plus@NkSjr4um7ctgDH1evF4oLXxOc3s6GDSpG4FAOjQGoPlNjfeGJGWBhlbj3Ac9pnoLjnr8NwD35@slash@@plus@Tg6vSiwByQg76Wy1rOBJ2T@plus@ViJ@slash@qqlCdMi@plus@H7D0B7UCX8C@slash@jluCSKLdxRuRzcr2upc1qWSjEw88f3tZUa1RFKX6D0lxaRXlL536oeIAc7WJRutqX4nF9gZuko4bEe47dNBQksurM8micahPy2MHFvWhzTGNPsyIxGdmnQN6HpQ2YRBZG@plus@P4JjkeR5zrhp2TsMXvC3MTMnwAacPp0zA3MZ4Eqax713hzCFSyEGGwM03eqpC2wWBMpSyuzFlM3YR62iLP1jOa1@plus@BDPHRBjCrLDJXanu6wA8lH@plus@muDnB3t8tpcL4MuKV1hgfjzs3DyRHBRNd5Uc8MMtCNcVZLfhVst2Qs4DkS2gD7tsBr1p4uS2@plus@piVfFpKziahYmeZbPn9HODbrc3OwpDZdkjn9utDSzT0Lhwh8XKriBcI9Gy2iv5eMPRx68rqCpvCNHJZwpnZtUCfgYquCpy6GTMMnD8U6o6@plus@cdVtz80RoVsCWpNNRwexJcC4pgllGUV3MM2BaRM2m@slash@Elzx8wf5a1ZB@plus@eEVfP8J0OFcKD3GMGkHWFzI@slash@DANzmw6QEgqNhJCzg2uJFU@slash@t@plus@J8jBFYYFrWuzYFGBdRJ48i4GCI5ZLA42TBu13MNX@slash@KT7xpVQY0L60GKRFHSE@slash@E0E1nRZpsqzQV6@plus@XHdgKvgdJmyDSlWVGuzj2hZr1@plus@du79Ic2heWyvU8myt4ol0@slash@Fy978xwogNvn8hpDfhUk0UdXJGMS5OT1lNtFZ2EUgjHppVP8ow8zQ46Sw") //ankit number
    // AppConstant.setChecksumToken("f6LgKFlH4tOue7Rr7YtLBZgSRrnj0wf@slash@bz5@slash@y1rWs69@slash@Q7oS3u7h5JGYP2@slash@FAkdX4zonsS7jhG3BVHGg5JBsg4d8Py@plus@vIyiDKAi1wc8pwhp3lV8Lsa162cQkNMbo3FfRN8OQKwypyo2BC@slash@VraKhKPOBX4pEhsvJlwQZBK2CpfpLL@plus@9wbmA9sIKzYv4jpsP14cDr1WC8O17VVtfJTNHxbmNlyb4BLK@plus@3Ksj40nnNEwDcOjdfhrc5sL2AAPBsOoHsVy@plus@ff4s5tEj48fg3LH@slash@Y5DOX7QcVuKev4@slash@IFqiCtb7S3uzJHbRIYqTiQCaeppKJdc@slash@BlhK31LI4MSqjqeknTGTlKVnKwpRT5uaRLEbpSFFrt@plus@4I5UUs7fn@slash@3W9RAfVI5sNl@slash@FzQ8A@plus@eKBum7gTf0VOTLmoCTJNqPlQ0F4pTJj7Iac@slash@XdaEZBMSWBmJvWi@slash@OZq9oKoNA5r1BYSrTEg4ZUjNT@plus@cwSe6DvJhBogET8DRhSp@slash@eaOVIUA06a@plus@tCVwHWkiT3mstUwV0fHgmNZgSuajb8RRIVKtddsLVVKUzOGwzFF0HeLwK19TzhCFbaoo2mY3TQGoPlNjfeGJGWBhlbj3Ac3WiJX4sI3evRLXcwqgK9@plus@x1pLfHUOfCuXkNWka7n4rWXVTXHD5ZjfA5Zd2adntL7pN6lXc4t@plus@cQt7fA6U41MgvGZG4G4I5OtUMjL5NB0ykSL1b7lylp2MCNCeyVzn5P5fMH95FGiDwjF3H@slash@uBbjJlOoDvGAi5T6pBTO5VAKvDRUzccTEJX5sLb6C@slash@md5I9yfOmh1zPzXq288@slash@3D0SYknQcdMIF9iDApkrnSy3cD8U@plus@uEUNBDv@plus@iERVEZzRDevdSluVVRU@slash@JhCgH1pyVLKmhtfc")

    // AppConstant.setChecksumToken("3HJCB79jPM5Re0tpi48rJw38Ay8tK4zardUdX2zmXZfUEqlrjoCob@slash@e6D03cgUXIieW6@plus@R@slash@OpUObqz1vcABvcXHYheSUzviw@slash@WJyUOfsJg5C1h6HYhkmVD@slash@DQ35IENy@plus@awO0er0esX7q0J8ARZ@slash@z7OshVckh@plus@bLhu6yb3dEsmEg0xAX2qVtCWLDw9Z2SYxnIki@slash@f7iKNgR5kf085PMQYmoF6r@slash@@slash@dafqXs@slash@z4RSIrnWrA9kagk1sRdjwRi7Oos@plus@40BSYLFDoMr7YS1pGBFs5BDgrZo8cnbEzrF8PpaIhigA9bZ0q9ua9GTBgq9BWX1QF7qqlCdMi@plus@H7D0B7UCX8C@slash@jhvMLyH0kam01gbkuqtjYpJxuhe0Jg93pLcNB7CZqpu0RTnnCOV0BY8OM0TAkgryO12cN0GgDVqm7M67XVMalhKgSSkwOL4Dw5cyOYdhudrUj4AQGudyUPj9Y1mGySXzRHDAIWXlxC@slash@qXOEw@plus@c6GvHEy73@plus@b4Jj83ealsnFQl39kir3BcBicL0p0L1AMeuVeWJ@slash@@plus@8gytYMR4iCh1Htb9H76NgycysZ7YlfyiD7SzZRq5OJiRNumadjQX8ZtG9hPPdQ9iUtCPrZTKJhjxM0v2@plus@Nwjwh6@plus@e2@slash@7nOQxNVt68L6onYDw7azLtyLzWobZXReiVh6RTjV74k0VSXgo86e@plus@nvMiVCaYbx@slash@0Unx6@plus@kEzFu@slash@aFghrUwtycvfS@slash@zvSdomU4m1efUpHje7CGqyoa94Jv3uOWo0pLqv8@slash@2VaoamGayamt9dH3ZTgzW@slash@QyGKCQ5xnSSyBX3JKcUsDCtk@slash@7RsCGtDEGVHSgHI6UmN3PBFNFJjH0Gx5ACUpgsDXWOj2GnGfYq@plus@xJfBrIJgEX3gow7dRKLzJUOCIy4n82z5fBhPNhk34tlfKti43tOSP8Y41Fm@plus@@plus@5M3HExCV@plus@bC2@plus@gv5neSPcnzxlfqV3Dkw11xiduRNAWNsDjv0eUiSnHCq0I7z4WMIyOeh@slash@02RHcbJ6p62yfgWomPHJ8oIr7BrsQ8Bim@slash@TyN9C")

    // AppConstant.showRetryAlert(() => {
    //   uniqueKey.current = Math.random();
    //   dispatch(
    //     createSessionDrupalInfo({
    //       uniqueKey: uniqueKey.current,
    //     }),
    //   );
    // });
    AppConstant.showRetryAlert(() => {
      uniqueKey.current = Math.random();
      dispatch(
        getAccessToken({
          uniqueKey: uniqueKey.current,
        }),
      );
    });
  }, [])


  useEffect(() => {
    if (
      createAccessTokenResponse != null &&
      createAccessTokenResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == createAccessTokenResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(createAccessTokenResponse);
      dispatch({
        type: CLEAR_CREATE_ACCESS_TOKEN_API_TYPE,
      });

      AppConstant.showConsoleLog('createAccessTokenResponse:', resp);
      if (resp.error == null) {
        uniqueKey.current = Math.random();
        dispatch(
          createSessionDrupalInfo({
            uniqueKey: uniqueKey.current,
          }),
        );
      } else {
        setShowLoader(false)
      }
    }
  }, [createAccessTokenResponse]);

  useEffect(() => {
    if (
      createSessionResponse != null &&
      createSessionResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == createSessionResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(createSessionResponse);
      dispatch({
        type: CLEAR_CREATE_SESSION_API_TYPE,
      });

      AppConstant.showConsoleLog('createSessionResponse:', resp);
      if (resp.error == null) {

        uniqueKey.current = Math.random();
        dispatch(
          getPacksApi({
            uniqueKey: uniqueKey.current,
          }),
        );

        let staticListTemp = []
        AppConstant.getDrupalInfoToInnerApis()?.bannerSection?.map((item, index) => {
          staticListTemp.push({
            id: index,
            imageUrl: item?.img,
            title: item?.txt
          })
        })

        setStaticList(staticListTemp)

      } else {
        setShowLoader(false)
      }
    }
  }, [createSessionResponse]);

  useEffect(() => {
    if (
      getPacksResponse != null &&
      getPacksResponse.payload != null &&
      uniqueKey.current != null &&
      uniqueKey.current == getPacksResponse?.payload?.uniqueKey
    ) {
      const resp = jsonCopy(getPacksResponse);
      dispatch({
        type: CLEAR_CREATE_SESSION_API_TYPE,
      });

      AppConstant.showConsoleLog('getPacksResponse:', resp);
      if (resp.error == null) {

        if (resp?.data?.flexiPlans?.length > 0) {
          setFlexiPlanList(resp?.data?.flexiPlans)
        }

        if (resp?.data?.bingePlans?.length > 0) {
          setBingePlanList(resp?.data?.bingePlans)
        }
        setShowLoader(false)
      } else {
        setShowLoader(false)
      }
    }
  }, [getPacksResponse]);

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

  // AppConstant.showConsoleLog(AppConstant.getDrupalInfoToInnerApis())

  function bingePlanListLayout(item, index, isFixed = true) {
    return <View style={{
      marginTop: 15
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
        {item?.packType == "BS" &&
          <Text style={{
            marginLeft: 15,
            lineHeight: 28,
            borderRadius: 5,
            width: 100,
            textAlign: 'center',
            alignSelf: 'flex-start',
            backgroundColor: '#6b00dd',
            // border-radius: 6px 6px 0px 0px;
            // padding: 5px 5px 2px;
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
            bottom: -4
          }}>
            Binge Bestseller
          </Text>
        }
        {item?.isCurrentPlan != null &&
          <Text style={{
            marginLeft: item?.packType == "BS" ? 10 : 15,
            lineHeight: 28,
            borderRadius: 5,
            width: 90,
            textAlign: 'center',
            alignSelf: 'flex-start',
            backgroundColor: '#6b00dd',
            // border-radius: 6px 6px 0px 0px;
            // padding: 5px 5px 2px;
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
            bottom: -4
          }}>
            Current Plan
          </Text>
        }
      </View>

      <TouchableOpacity
        activeOpacity={1}
        key={`${item?.packId ?? ""}_bingePlanList_${index}`}
        style={{
          width: '100%',
          // marginTop: 15,
          backgroundColor: '#efe8fb',
          borderRadius: 10,
          paddingHorizontal: 13,
          paddingVertical: 16
        }}
        onPress={() => {
          if (item?.dminusX && item?.isCurrentPlan && !isFixed) {
            return
          }
          navigationInfo.current = { selectedApps: item?.appList?.BUCKET1, packPrice: item.packPrice, item, type: 'Fixed' }
          AppConstant.showConsoleLog(item)

          if (item?.tenureList?.length > 1) {
            navigation.navigate('TenureListSelect', { appList: item?.appList, packPrice: item.packPrice, item, type: 'Fixed' })
            return
          }
          AppConstant.showRetryAlert(() => {
            setShowLoader(true)
            uniqueKey.current = Math.random();
            dispatch(
              savePacksApi({
                uniqueKey: uniqueKey.current,
                body: {
                  appwithBucket: {},
                  journeySource: "CYOP",
                  packId: item.packId,
                  packages: item.packName,
                  productClass: item.productClass,
                  tenure: item?.tenureInfo?.[0]?.tenure ?? ''
                },
              }),
            );
          });
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
          }}>{item?.packName}</Text>

          <Text style={{
            fontSize: 18,
            color: "#220046",
            fontWeight: 'bold',
            textAlign: 'right',
            marginLeft: 10
          }}>
            {'₹' + item?.packPrice}
            <Text style={{
              fontSize: 15,
              color: "#220046",
              fontWeight: '500',
              textAlign: 'left',
            }}>{' /' + item?.tenureType}
            </Text>
          </Text>

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
            {`${item?.appList?.BUCKET1?.length}`}
          </Text>
          {' apps | upto '}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}>
            {`${item?.totalDevices}`}
          </Text>
          {' devices at a time'}
        </Text>

        {
          item?.deviceListInfo != null &&
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10
          }}>
            {
              item?.deviceListInfo?.img != null &&
              // <Image
              //   style={{
              //     width: 40,
              //     height: 25,
              //     resizeMode: 'cover',
              //     backgroundColor: 'red'
              //   }}
              //   source={{ uri: item?.deviceListInfo?.img }}
              // // resizeMode="cover"
              // />
              <SvgUri
                width="40"
                height="25"
                uri={item?.deviceListInfo?.img}
              />
            }

            <Text style={{
              flex: 1,
              fontSize: 15,
              color: "#220046",
              fontWeight: '600',
              textAlign: 'left',
              marginLeft: 10
            }}>{`Watch on ${item?.deviceListInfo?.title}`}</Text>
          </View>
        }

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {
            item?.appList?.BUCKET1?.map((applistItem, index) => {
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
          item?.belowMsg != "" &&
          <Text style={{
            width: '100%',
            fontSize: 12,
            color: "#220046",
            fontWeight: '500',
            textAlign: 'left',
            marginTop: 10,
            lineHeight: 20
          }}>{item?.belowMsg}</Text>
        }

        {
          // (!item?.dminusX || !item?.isCurrentPlan || isFixed) &&
          (!item?.isCurrentPlan || isFixed) &&
          <Text style={{
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
          </Text>
        }

      </TouchableOpacity>
    </View>
  }

  return (
    <View style={{
      width: AppConstant.dimension.width,
      height: AppConstant.dimension.height,
      // backgroundColor: 'cyan'
    }}>
      <ScrollView style={{ backgroundColor: 'black' }}>
        <View style={{ backgroundColor: 'black' }}>
          <View style={[styles.container, {}]}>
            <FlatList
              data={staticList}
              horizontal
              ItemSeparatorComponent={() => <View style={{
                width: 1,
                backgroundColor: '#ffffff66',
                height: 90,
                marginTop: 20
              }} />}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />

          </View>
          <View style={{ backgroundColor: 'black', paddingHorizontal: 20, paddingBottom: 100 }}>

            {
              flexiPlanList.length > 0 &&
              <View style={{
                marginTop: 16
              }}>
                {
                  AppConstant.getDrupalInfoToInnerApis()?.flexiPlans?.title != null &&
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    {
                      AppConstant.getDrupalInfoToInnerApis()?.flexiPlans?.img != null &&
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                        }}
                        source={{ uri: AppConstant.getDrupalInfoToInnerApis()?.flexiPlans?.img }}
                        resizeMode="cover"
                      />
                    }
                    <Text style={{
                      fontSize: 17,
                      color: "#FFA800",
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginLeft: 10
                    }}>{AppConstant.getDrupalInfoToInnerApis()?.flexiPlans?.title}</Text>
                  </View>
                }

                {flexiPlanList?.map((item, index) => {

                  if (item.isCurrentPlan) {
                    return bingePlanListLayout(item, index, false)
                  }
                  return <TouchableOpacity
                    activeOpacity={1}
                    key={`${item?.packId ?? ""}_flexiplanList_${index}`}
                    style={{
                      width: '100%',
                      // height: ,
                      // borderRadius: 5,
                      marginTop: 15,
                      // backgroundColor: 'cyan'
                    }}
                    onPress={() => {
                      navigation.navigate('SelectPlans', { appList: item?.appList, packPrice: item.packPrice, item, type: 'Flexi' })
                    }}
                  >
                    {item?.packType == "BS" &&
                      <Text style={{
                        marginLeft: 15,
                        lineHeight: 28,
                        borderRadius: 5,
                        width: 100,
                        textAlign: 'center',
                        alignSelf: 'flex-start',
                        backgroundColor: '#6b00dd',
                        // border-radius: 6px 6px 0px 0px;
                        // padding: 5px 5px 2px;
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '600',
                        bottom: -4
                      }}>
                        Binge Bestseller
                      </Text>
                    }
                    <Image
                      style={{
                        width: '100%',
                        height: AppConstant.dimension.aspectRatio * 295,
                      }}
                      source={{ uri: serviceConsts.baseUrls.showPlanImage(item?.packPrice) }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                }
                )
                }
              </View>
            }

            {
              bingePlanList.length > 0 &&
              <View style={{
                marginTop: 16,
              }}>
                {
                  AppConstant.getDrupalInfoToInnerApis()?.bingePlans?.title != null &&
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    {
                      AppConstant.getDrupalInfoToInnerApis()?.bingePlans?.img != null &&
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                        }}
                        source={{ uri: AppConstant.getDrupalInfoToInnerApis()?.bingePlans?.img }}
                        resizeMode="cover"
                      />
                    }
                    <Text style={{
                      fontSize: 17,
                      color: "#FFA800",
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginLeft: 10
                    }}>{AppConstant.getDrupalInfoToInnerApis()?.bingePlans?.title}</Text>
                  </View>
                }

                {bingePlanList?.map((item, index) =>

                  bingePlanListLayout(item, index)
                )}

              </View>
            }
          </View>
        </View>
      </ScrollView>

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
    paddingTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 20
  },
  item: {
    backgroundColor: 'rgba(34, 0, 70, 100)',
    // marginHorizontal: 10,
    padding: 15,
    width: 150,
    height: 110,
    marginVertical: 10,
    justifyContent: 'center'
  },
  itemApps: {
    borderRadius: 5,
    backgroundColor: 'lavender',
    justifyContent: 'center',
    padding: 20,
    width: 90,
    height: 90,
    margin: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
    // alignSelf:'center'
  },
  titleApps: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  image: {
    width: 38,
    height: 38,
    borderRadius: 5,
    marginBottom: 15
  },
  imageFlexi: {
    width: '100%',
    height: 200,
    // backgroundColor: 'red',
    borderRadius: 5
  },
  imageFlexi199: {
    width: '100%',
    height: 200,
    // backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 20
  }
});