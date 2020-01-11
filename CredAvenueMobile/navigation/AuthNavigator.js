import SignInScreen from '../screens/SignInScreen';
import { createStackNavigator } from 'react-navigation-stack';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default AuthStack;