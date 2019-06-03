import {createAppContainer, createStackNavigator} from "react-navigation";
import HomeScreen from "./Home/Home.Screen";
import DetailScreen from "./Detail/Detail.Screen";

const AppNavigator = createStackNavigator(
    {

        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: {gesturesEnabled: false}
        },
        DetailScreen: {
            screen: DetailScreen,
            navigationOptions: {gesturesEnabled: false}
        },

    },
    {headerMode: 'none'},
    {initialRouteName: "HomeScreen"}
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer
