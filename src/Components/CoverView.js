import React, {Component} from 'react'
import {View} from 'react-native'

export default class CoverView extends Component {

    render() {
        return (
            <View style={styles.viewLoading}>
                {this.props.children}
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
}
