import colors from "../Themes/Colors";
import {StyleSheet} from 'react-native'
import ApplicationStyles from "../Themes/ApplicationStyles";
import {fontFamily, fontSize} from "../const";

export default StyleSheet.create({
    ...ApplicationStyles,
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.bgRoot,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5
    },

    // Title
    viewWrapTitle: {
        backgroundColor: colors.grey,
        alignSelf: 'stretch'
    },
    textTitle: {
        fontSize: fontSize.medium,
        color: colors.charcoalGrey,
        fontFamily: fontFamily.demiBold
    },

    // Image
    viewWrapImage: {
        width: '90%',
        height: 150,
    },
    imgFeature: {
        flex: 1,
        borderRadius: 5,
    },
    btnChangeImage: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.boldGrey,
        right: 10,
        top: 10
    },

    // Text content
    textContent: {
        fontSize: fontSize.medium,
        color: colors.boldGrey,
        fontFamily: fontFamily.regular,
        marginTop: 10,
        textAlign: 'left'
    },

})
