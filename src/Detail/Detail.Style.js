import colors from "../Themes/Colors";
import {StyleSheet} from 'react-native'
import ApplicationStyles from "../Themes/ApplicationStyles";
import {fontFamily, fontSize} from "../const";

export default StyleSheet.create({
    ...ApplicationStyles,
    body: {
        flex: 1,
        backgroundColor: colors.bgRoot,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5
    },

    // Title
    viewWrapTitle: {
        backgroundColor: colors.grey,
        alignSelf: 'stretch',
        paddingLeft: 10,
        paddingRight: 10
    },
    textTitle: {
        fontSize: fontSize.medium,
        color: colors.charcoalGrey,
        fontFamily: fontFamily.demiBold
    },

    // Image
    imgFeature: {
        width: '95%',
        height: 150,
        resizeMode: 'contain',
        marginTop: 10,
        alignSelf: "center"
    },

    // Text content
    textInputContent: {
        fontSize: fontSize.medium,
        color: colors.boldGrey,
        fontFamily: fontFamily.regular,
        marginTop: 15,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 5,
        minHeight: 100,
        textAlignVertical: 'top',
        padding: 10,
    },

})
