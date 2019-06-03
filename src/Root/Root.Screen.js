import React, {Component} from 'react'
import AppContainer from "../AppNavigation";
import styles from './Root.Style'
import {StatusBar, View} from 'react-native'
import colors from "../Themes/Colors";

export default class RootScreen extends Component {
    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar hidden={false} backgroundColor={colors.primary}/>
                <AppContainer/>
            </View>
        )
    }
}
