import {createAppContainer} from "react-navigation";
import HomeScreen from "./Home/Home.Screen";
import DetailScreen from "./Detail/Detail.Screen";
import AddNewNoteScreen from "./AddNewNote/AddNewNote.Screen";
import {createStackNavigator} from 'react-navigation-stack';

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
        AddNewNoteScreen: {
            screen: AddNewNoteScreen,
            navigationOptions: {gesturesEnabled: false}
        }

    },
    {headerMode: 'none'},
    {initialRouteName: "HomeScreen"}
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer
