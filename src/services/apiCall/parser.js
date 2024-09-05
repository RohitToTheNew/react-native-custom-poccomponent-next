import { AppConstant } from "../../assets/AppConstant";
import { jsonCopy } from "../../utils/string";


export const parseOrderDetail = ({ data = {} }) => {
    AppConstant.showConsoleLog('parseOrderDetail :', data);

    let flexiPlans = [];
    let bingePlans = [];

    flexiPlans = data?.productList?.filter(item => item.showPlan && item?.productType == 'Flexi')?.map(flexiItem => {

        let item = jsonCopy(flexiItem);
        const tenureList = data?.tenuresList?.[item?.productClass]?.filter(tenureItem => tenureItem?.packId == item?.packId)
        if (data?.userExistingPacks?.userProductId == item?.packId) {
            item.appList = data?.userExistingPacks?.appList;
            item.isCurrentPlan = true
            item.currentPlanPackId = data?.userExistingPacks?.userProductId

            item.currentPlanPackIdIndex = tenureList.findIndex(tenureItemFindIndex => data?.userExistingPacks?.userProductId == tenureItemFindIndex.packId)
        }
        let isAmazon = false;
        let isSunNext = false;

        isAmazon = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.appName == "Prime")?.length > 0
        isSunNext = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.appName == "SunNxt")?.length > 0

        // let recommendedPlan = [];
        // let moreInBinge = [];
        // recommendedPlan = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.recommendedApps)
        // moreInBinge = item?.appList?.BUCKET1?.filter(innerItem => !innerItem?.recommendedApps)

        let belowMsg = ""
        if (isAmazon && AppConstant.getDrupalInfoToInnerApis().primeText != null) {
            belowMsg += AppConstant.getDrupalInfoToInnerApis().primeText
        }
        if (isSunNext && AppConstant.getDrupalInfoToInnerApis().sunNxtText != null) {
            belowMsg += AppConstant.getDrupalInfoToInnerApis().sunNxtText
        }

        belowMsg += item?.appOnTv ?? ''

        let deviceListInfo = null;
        if (item?.devicesList?.length > 0) {
            deviceListInfo = AppConstant.getDrupalInfoToInnerApis()?.listOfDevices?.find(findItem => {

                if (findItem?.device?.length == item?.devicesList?.length) {
                    const devItemData = item?.devicesList?.filter(deviItem => findItem?.device?.includes(deviItem))
                    if (devItemData?.length == item?.devicesList?.length) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
        }

        return {
            ...item,
            dminusX: data?.dminusX ?? null,
            tenureInfo: tenureList,
            deviceListInfo,
            // recommendedPlan,
            // moreInBinge,
            belowMsg: AppConstant.replaceAll(belowMsg, "#", "\n")
            // msg:item?.appOnTv
        }
    })

    bingePlans = data?.productList?.filter(item => item.showPlan && item?.productType == 'Fixed')?.map(bingeItem => {

        let item = jsonCopy(bingeItem);
        const tenureList = data?.tenuresList?.[item?.productClass]?.filter(tenureItem => tenureItem?.packId == item?.packId)
        if (data?.userExistingPacks?.userProductId == item?.packId) {
            item.appList = data?.userExistingPacks?.appList;
            item.isCurrentPlan = true
            item.currentPlanPackId = data?.userExistingPacks?.userProductId
            item.currentPlanPackIdIndex = tenureList.findIndex(tenureItemFindIndex => data?.userExistingPacks?.userProductId == tenureItemFindIndex.packId)
        }
        let isAmazon = false;
        let isSunNext = false;

        isAmazon = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.appName == "Prime")?.length > 0
        isSunNext = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.appName == "SunNxt")?.length > 0

        // let recommendedPlan = [];
        // let moreInBinge = [];
        // recommendedPlan = item?.appList?.BUCKET1?.filter(innerItem => innerItem?.recommendedApps)
        // moreInBinge = item?.appList?.BUCKET1?.filter(innerItem => !innerItem?.recommendedApps)

        let belowMsg = ""
        if (isAmazon && AppConstant.getDrupalInfoToInnerApis().primeText != null) {
            belowMsg += AppConstant.getDrupalInfoToInnerApis().primeText
        }
        if (isSunNext && AppConstant.getDrupalInfoToInnerApis().sunNxtText != null) {
            belowMsg += AppConstant.getDrupalInfoToInnerApis().sunNxtText
        }

        belowMsg += item?.appOnTv ?? ''

        let deviceListInfo = null;
        if (item?.devicesList?.length > 0) {
            deviceListInfo = AppConstant.getDrupalInfoToInnerApis()?.listOfDevices?.find(findItem => {

                if (findItem?.device?.length == item?.devicesList?.length) {
                    const devItemData = item?.devicesList?.filter(deviItem => findItem?.device?.includes(deviItem))
                    if (devItemData?.length == item?.devicesList?.length) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
        }
        return {
            ...item,
            deviceListInfo,
            dminusX: data?.dminusX ?? null,
            tenureInfo: tenureList,
            // recommendedPlan,
            // moreInBinge,
            tenureList: data?.tenuresList?.[item?.productClass] ?? [],
            belowMsg: AppConstant.replaceAll(belowMsg, "#", "\n")
            // msg:item?.appOnTv
        }
    })

    return {
        flexiPlans,
        bingePlans
    }
};

