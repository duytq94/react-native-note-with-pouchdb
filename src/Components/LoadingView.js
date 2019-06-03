import React, {Component} from 'react'
import {ActivityIndicator, Image, View} from 'react-native'
import colors from "../Themes/Colors";

export default class LoadingView extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        return (
            <View style={styles.viewLoading}>
                <ActivityIndicator size="large" color={colors.primary}/>
            </View>
        )
    }
}

const styles = {
    viewLoading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
}
