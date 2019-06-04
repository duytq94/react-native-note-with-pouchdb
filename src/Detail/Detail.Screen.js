import React, {Component} from "react";
import {BackHandler, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './Detail.Style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../Themes/Colors";
import LoadingView from "../Components/LoadingView";
import {localDetailNoteDb, localNoteDb, nameIndex, remoteDetailNoteDb} from "../const";
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import PouchDB from "../pouchdb";
import moment from "moment";
import {imgDefault} from "../images";

const TAG = 'Detail.Screen.js'

let handlerSync = null

export default class DetailScreen extends Component {

    constructor(props) {
        super(props)
        this.currentNote = this.props.navigation.state.params.note
        this.refTextInputContent = null
        this.refTextInputTitle = null
        this.state = {
            isLoading: false,
            detailNote: null,
            newImage: null
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        handlerSync.cancel()
    }

    componentDidMount() {
        this.syncDb()
        // localDetailNoteDb.allDocs()
        //     .then(response => {
        //         console.log('aaa', response)
        //     })
        //     .catch(err => {
        //         console.log('bbb', err)
        //     })

        // remoteDetailNoteDb
        //     .createIndex({
        //         index: {
        //             fields: ['parent_id'],
        //             name: nameIndex.PARENT_ID,
        //             ddoc: nameIndex.PARENT_ID,
        //         }
        //     })
        //     .then((result) => {
        //         console.log(TAG, result)
        //     })
        //     .catch((err) => {
        //         console.log(TAG, err)
        //     })
    }

    handleBackPress = () => {
        handlerSync.cancel()
        this.props.navigation.goBack()
        this.props.navigation.state.params.returnFromDetail()
        return true
    }

    syncDb = () => {
        this.setState({isLoading: true})
        handlerSync = PouchDB.sync(localDetailNoteDb, remoteDetailNoteDb, {
            live: true,
            retry: true,
        })
            .on('change', (info) => {
                console.log(TAG, 'sync onChange', info)
            })
            .on('paused', (err) => {
                console.log(TAG, 'sync onPaused', err)
                this.getDetailNoteFromDb()
            })
            .on('active', () => {
                console.log(TAG, 'sync onActive')
            })
            .on('denied', (err) => {
                console.log(TAG, 'sync onDenied', err)
            })
            .on('complete', (info) => {
                console.log(TAG, 'sync onComplete', info)
            })
            .on('error', (err) => {
                console.log(TAG, 'sync onError', err)
            })
    }

    getDetailNoteFromDb = () => {
        localDetailNoteDb
            .find({
                selector: {
                    parent_id: this.currentNote._id
                },
                use_index: nameIndex.PARENT_ID,
            })
            .then(result => {
                console.log(TAG, 'find list note', result)
                this.setState({
                    isLoading: false,
                    detailNote: result.docs[0]
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
        if ((this.refTextInputContent && this.refTextInputContent._lastNativeText) || this.state.newImage) {
            this.updateDetailNote()
        } else if (this.refTextInputTitle && this.refTextInputTitle._lastNativeText) {
            this.updateNote()
        }
    }

    updateDetailNote = () => {
        this.setState({isLoading: true})
        localDetailNoteDb
            .upsert(this.state.detailNote._id, doc => {
                    if (this.state.newImage) {
                        doc.img = this.state.newImage
                    }
                    if (this.refTextInputContent && this.refTextInputContent._lastNativeText) {
                        doc.content = this.refTextInputContent._lastNativeText
                    }
                    return doc
                }
            )
            .then(response => {
                if (response.updated) {
                    this.updateNote()
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

    updateNote = () => {
        this.setState({isLoading: true})
        localNoteDb
            .upsert(this.currentNote._id, doc => {
                if (this.refTextInputTitle && this.refTextInputTitle._lastNativeText) {
                    doc.title = this.refTextInputTitle._lastNativeText
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

    // Render UI
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderToolbar()}
                {this.renderTitle()}
                {this.state.detailNote ? this.renderBody() : null}
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
                    defaultValue={this.currentNote.title}
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
