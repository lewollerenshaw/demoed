import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import { setCurrentScreen, isFooterVisible } from './redux/actions/globalActions';
import DemoScreen from './screens/DemoScreen';
import DemoCollectionScreen from './screens/DemoCollectionScreen';
import RecentlyDeletedScreen from './screens/RecentlyDeletedScreen';
import rootReducer from './redux/reducers/rootReducer';
import SettingsScreen from './screens/SettingsScreen';
import { navigationRef } from './services/navigation/RootNavigation';
import Footer from './components/footer';

const Stack = createStackNavigator();

const getActiveRouteName = (state) => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

function AppWrapper() {
  const store = createStore(rootReducer);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const routeNameRef = React.useRef();
  const dispatch = useDispatch();
  const footerVisiblity = useSelector((state) => state.global.isFooterVisible);

  const handleNavigationChange = (state) => {
    const currentRouteName = getActiveRouteName(state);
    routeNameRef.current = currentRouteName;
    dispatch(setCurrentScreen(currentRouteName));

    if (currentRouteName !== 'SettingsScreen') dispatch(isFooterVisible(true));
  };

  React.useEffect(() => {
    const state = navigationRef.current.getRootState();
    routeNameRef.current = getActiveRouteName(state);
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => handleNavigationChange(state)}
    >
      <Stack.Navigator
        initialRouteName="DemoCollectionScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DemoCollectionScreen" component={DemoCollectionScreen} />
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
        <Stack.Screen name="RecentlyDeletedScreen" component={RecentlyDeletedScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>

      {footerVisiblity && <Footer />}

    </NavigationContainer>
  );
}

export default AppWrapper;
