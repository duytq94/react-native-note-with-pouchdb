import React, {Component} from "react";
import {BackHandler, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './AddNewNote.Style';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../Themes/Colors";
import LoadingView from "../Components/LoadingView";
import {localDetailNoteDb, localNoteDb} from "../const";
import moment from "moment";
import Toast from "react-native-simple-toast";
import {imgDefault} from "../images";
import ImagePicker from "react-native-image-picker";

const TAG = 'AddNewNote.Screen.js'

let handlerSync = null

export default class AddNewNoteScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            title: '',
            content: '',
            image: null
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    componentDidMount() {

    }

    handleBackPress = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.returnFromAddNewNote()
        return true
    }

    onSaveNotePress = () => {
        Keyboard.dismiss()
        if (this.refTextInputTitle && this.refTextInputTitle._lastNativeText && this.refTextInputContent && this.refTextInputContent._lastNativeText) {
            this.setState({isLoading: true})
            let newNote = {
                title: this.refTextInputTitle._lastNativeText,
                updated_at: moment().unix()
            }
            localNoteDb
                .post(newNote)
                .then(response => {
                    if (response.ok) {
                        let detailNote = {
                            parent_id: response.id,
                            content: this.refTextInputContent._lastNativeText,
                            img: this.state.image
                        }
                        localDetailNoteDb
                            .post(detailNote)
                            .then(response => {
                                if (response.ok) {
                                    Toast.show('Add new note success')
                                    this.handleBackPress()
                                } else {
                                    Toast.show('Add new note fail')
                                    this.setState({isLoading: false})
                                }
                            })
                            .catch(err => {
                                console.log(TAG, err)
                                Toast.show(err.message)
                                this.setState({isLoading: false})
                            })
                    } else {
                        Toast.show('Add new note fail')
                        this.setState({isLoading: false})
                    }
                })
                .catch(err => {
                    console.log(TAG, err)
                    Toast.show(err.message)
                    this.setState({isLoading: false})
                })
        }
    }

    openGallery = () => {
        ImagePicker.showImagePicker({
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,
            mediaType: 'photo',
            multiple: false,
        }, image => {
            this.setState({image: image.data})
        })
    }

    // Render UI
    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderToolbar()}
                {this.renderBody()}
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
                    <Text style={styles.titleToolbar}>Add new</Text>
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

    renderBody = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Text style={styles.textTitle}>Image</Text>

                    <TouchableOpacity
                        onPress={this.openGallery}
                    >
                        <Image style={styles.img}
                               source={this.state.image ? {uri: `data:image;base64,${this.state.image}`} : imgDefault}/>
                    </TouchableOpacity>

                    <Text style={styles.textTitle}>Title</Text>
                    <TextInput
                        style={styles.textInputTitle}
                        ref={ref => this.refTextInputTitle = ref}
                        autoCorrect={false}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                            if (this.refTextInputContent) {
                                this.refTextInputContent.focus()
                            }
                        }}
                    />

                    <Text style={styles.textTitle}>Content</Text>
                    <TextInput
                        style={styles.textInputContent}
                        ref={ref => this.refTextInputContent = ref}
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
