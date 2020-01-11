import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';

const switchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Main: MainTabNavigator,
  Auth: AuthNavigator,
},
{
  initialRouteName: 'Auth',
});
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
