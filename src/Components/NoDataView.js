import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../Themes/Colors";
import {fontFamily, fontSize} from "../const";

export default class NoDataView extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        return (
            <View style={styles.viewNoData}>
                <MaterialCommunityIcons name={'information-outline'} size={64} color={colors.grey}/>
                <Text style={styles.textNoData}>No data</Text>
                <TouchableOpacity
                    style={styles.btnRetry}
                    onPress={this.props.onRetryPress}
                >
                    <Text style={styles.textRetry}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    viewNoData: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNoData: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.medium,
        color: colors.grey
    },
    btnRetry: {
        marginTop: 20,
        width: 150,
        height: 45,
        borderRadius: 30,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textRetry: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.demiBold,
        color: colors.primary,
    }
}
