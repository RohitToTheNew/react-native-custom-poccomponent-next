## **Native Bridging for iOS and Android in React Native  

<br/>Prerequisites**[**​**](https://reactnative.dev/docs/integration-with-existing-apps#prerequisites)

Follow the guide on [setting up your development environment](https://reactnative.dev/docs/set-up-your-environment) to configure your development environment for building React Native apps for Android and iOS.

Install React Native version 0.72.14  
<br/>To install a specific version of React Native below command can be used:  
<br/>npx react-native init newApp --version 0.72.14

<br/>**After Installation**  
Once React Native is installed, make sure to add the following packages in dev dependencies:  
```sh 
"@react-navigation/native": "^6.0.16",

"@react-navigation/native-stack": "^6.9.4”,

"react-native-safe-area-context": "^4.4.1",

"react-native-screens": "^3.18.2”,

"@react-native-community/netinfo": "^11.3.2",

"react-native-svg": "^15.5.0",

"react-redux": "^8.0.5",

"redux": "^4.2.0",

"redux-thunk": "^2.4.2"
```

For iOS, make sure to run pod install in the ios directory after adding the packages.  

**Bridging for iOS**  
Refer to the below doc for native bridging - iOS:  
[Integration with Existing Apps - iOS · React Native](https://reactnative.dev/docs/integration-with-existing-apps?language=swift)  
After following the steps provided in the above doc for iOS bridging, add the below line inside the onTapped function in the view controller file to change the modal to screen:  
<br/>To open React Native POC screen

```sh 
**@IBAction** **func** onTapped(_ sender: UIButton) {

**let** jsCodeLocation = URL(string: "<http://localhost:8081/index.bundle?platform=ios>")!

**let** mockData:NSDictionary = \["accessToken":

"&lt;accessToken&gt;"

\]

**let** rootView = RCTRootView(

bundleURL: jsCodeLocation,

moduleName: "POCScreen",

initialProperties: mockData **as** \[NSObject : AnyObject\],

launchOptions: **nil**

)

**let** vc = UIViewController()

vc.view = rootView

vc.modalPresentationStyle = .fullScreen

**self**.present(vc, animated: **true**, completion: **nil**)

}

}
```


<br/>**Bridging for Android  
**  
Refer to the below doc for native bridging - Android:  
[Integration with Existing Apps - Android · React Native](https://reactnative.dev/docs/integration-with-existing-apps?language=java)  
For navigation from "native android to react native" and "react native to native android", need to add two files (Connectivity.java and ConnectivityPackage.java) in native android code, which is available under assets folder (src/assets/androidResources).
To open React Native POC screen:   

```sh 
Button button = findViewById(R.id.button);

button.setOnClickListener(view -> {

Intent intent = new Intent(MainActivity.this, MyReactActivity.class);

Bundle intials = new Bundle();

intials.putString("action", "&lt;accessToken&gt;");

intials.putString("platform", "android");

intent.putExtra("initialProps",intials);

startActivity(intent);

});
```


**MyReactActivity.java**

Make sure to add .setJavaScriptExecutorFactory(new HermesExecutorFactory()) in mReactInstanceManager

```sh 
mReactInstanceManager = ReactInstanceManager._builder_()

.addPackage(new ConnectivityPackage())

.setApplication(getApplication())

.setCurrentActivity(this)

.setBundleAssetName("index.android.bundle")

.setJSMainModulePath("index")

.addPackages(packages)

.setUseDeveloperSupport(BuildConfig._DEBUG_)

.setInitialLifecycleState(LifecycleState._RESUMED_)

.setJavaScriptExecutorFactory(new HermesExecutorFactory())

.build();
```