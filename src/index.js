// export function multiply(a: number, b: number): Promise<number> {
//   return Promise.resolve(a * b);
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/Routes';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
// import 'react-native-gesture-handler';

// const POCComponent = ({rootTag}) => {
const POCComponent = (props) => {
  return (
    // <NavigationContainer>
    //   <Routes rootTag={rootTag}/>
    // </NavigationContainer>
    <Provider store={store}>
      <NavigationContainer>
        <Routes androidProps={props?.initialProps ?? {}} />
      </NavigationContainer>
    </Provider>
  );
};

export default POCComponent;