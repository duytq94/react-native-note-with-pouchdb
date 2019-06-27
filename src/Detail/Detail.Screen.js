import React, {Component} from "react";
import {
    BackHandler,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './Detail.Style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../Themes/Colors";
import LoadingView from "../Components/LoadingView";
import {localNoteDb, remoteNoteDb} from "../const";
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import PouchDB from "../pouchdb";
import moment from "moment";
import {imgDefault} from "../images";
import NoDataView from "../Components/NoDataView";

const TAG = 'Detail.Screen.js'

let handlerSync = null

export default class DetailScreen extends Component {

    constructor(props) {
        super(props)
        this.idNote = this.props.navigation.state.params.idNote
        this.refTextInputContent = null
        this.refTextInputTitle = null
        this.state = {
            isLoading: false,
            detailNote: null,
            newImage: null,
            isKeyboardShow: false,
            keyboardHeight: 0,
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this.keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this.keyboardDidHide
        )
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        handlerSync.cancel()
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    componentDidMount() {
        this.syncDb()
        this.getDetailNoteFromDb()
    }

    handleBackPress = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.returnFromDetail()
        return true
    }

    keyboardDidShow = (e) => {
        this.setState({
            isKeyboardShow: true,
            keyboardHeight: e.endCoordinates.height
        })
    }

    keyboardDidHide = () => {
        this.setState({isKeyboardShow: false})
    }

    syncDb = () => {
        handlerSync = PouchDB.sync(remoteNoteDb, localNoteDb, {
            live: true,
            retry: true,
        })
            .on('change', (info) => {
                // console.log(TAG, 'sync onChange', info)
            })
            .on('paused', (err) => {
                // console.log(TAG, 'sync onPaused', err)
                this.getDetailNoteFromDb()
            })
            .on('active', () => {
                // console.log(TAG, 'sync onActive')
            })
            .on('denied', (err) => {
                // console.log(TAG, 'sync onDenied', err)
            })
            .on('complete', (info) => {
                // console.log(TAG, 'sync onComplete', info)
            })
            .on('error', (err) => {
                // console.log(TAG, 'sync onError', err)
            })
    }

    getDetailNoteFromDb = () => {
        this.setState({isLoading: true})

        localNoteDb
            .get(this.idNote)
            .then(result => {
                // console.log(TAG, 'localNoteDb get', result)
                this.setState({
                    isLoading: false,
                    detailNote: result
                })
            })
            .catch(err => {
                console.log(TAG, 'err find list note', err)
                this.setState({isLoading: false})
                Toast.show(err.message)
            })
    }

    openGallery = () => {
        ImagePicker.showImagePicker({
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
            mediaType: 'photo',
            multiple: false,
        }, image => {
            this.setState({newImage: image.data})
        })
    }

    onSaveNotePress = () => {
        Keyboard.dismiss()
        this.updateNote()
    }

    updateNote = () => {
        this.setState({isLoading: true})
        localNoteDb
            .upsert(this.idNote, doc => {
                if (this.refTextInputTitle && this.refTextInputTitle._lastNativeText) {
                    doc.title = this.refTextInputTitle._lastNativeText
                }
                if (this.state.newImage) {
                    doc.img = this.state.newImage
                }
                if (this.refTextInputContent && this.refTextInputContent._lastNativeText) {
                    doc.content = this.refTextInputContent._lastNativeText
                }
                doc.updated_at = moment().unix()
                return doc
            })
            .then(response => {
                if (response.updated) {
                    Toast.show('Updated')
                    this.setState({isLoading: false})
                } else {
                    Toast.show('Update fail, please try again')
                    this.setState({isLoading: false})
                }

            })
            .catch(err => {
                console.log(TAG, err)
                Toast.show(err.message)
                this.setState({isLoading: false})
            })
    }

    deleteNote = () => {
        this.setState({isLoading: true})
        localNoteDb.remove(this.idNote, this.state.detailNote._rev)
            .then(response => {
                if (response.ok) {
                    this.handleBackPress()
                } else {
                    Toast.show('Delete note fail')
                    this.setState({isLoading: false})
                }
            })
            .catch(err => {
                console.log(TAG, err)
                Toast.show(err.message)
                this.setState({isLoading: false})
            })
    }

    // Render UI
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderToolbar()}
                {this.renderTitle()}
                {this.state.detailNote ? this.renderBody() : <NoDataView onRetryPress={this.getDetailNoteFromDb}/>}
                {this.renderLoading()}
            </View>
        )
    }

    renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={styles.viewWrapIcLeft}
                    onPress={this.handleBackPress}
                >
                    <MaterialCommunityIcons name={'arrow-left'} size={30} color={colors.white}/>
                </TouchableOpacity>
                <View style={styles.viewWrapTitleToolbar}>
                    <Text style={styles.titleToolbar}>Detail</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewWrapIcRight}
                    onPress={this.deleteNote}
                >
                    <MaterialCommunityIcons name={'delete'} size={30} color={colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.viewWrapIcRight}
                    onPress={this.onSaveNotePress}
                >
                    <MaterialCommunityIcons name={'check'} size={30} color={colors.white}/>
                </TouchableOpacity>

            </View>
        )
    }

    renderTitle = () => {
        return (
            <View style={styles.viewWrapTitle}>
                <TextInput
                    style={styles.textTitle}
                    ref={ref => this.refTextInputTitle = ref}
                    defaultValue={this.state.detailNote ? this.state.detailNote.title : ''}
                    multiline={true}
                    autoCorrect={false}
                />
            </View>
        )
    }

    renderBody = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.body}>

                    <TouchableOpacity onPress={this.openGallery}>
                        <Image style={styles.imgFeature}
                               source={this.state.newImage || this.state.detailNote.img ? {uri: `data:image;base64,${this.state.newImage ? this.state.newImage : this.state.detailNote.img}`} : imgDefault}/>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInputContent}
                        ref={ref => this.refTextInputContent = ref}
                        defaultValue={this.state.detailNote.content}
                        multiline={true}
                        autoCorrect={false}
                    />
                </View>

                {
                    this.state.isKeyboardShow && Platform.OS === 'ios' ?
                        <View style={{height: this.state.keyboardHeight}}/> :
                        null
                }
            </ScrollView>
        )
    }

    renderLoading = () => {
        if (this.state.isLoading) {
            return (
                <LoadingView/>
            )
        } else {
            return null
        }
    }
}
