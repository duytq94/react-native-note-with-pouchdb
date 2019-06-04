import React, {Component} from "react";
import {Alert, BackHandler, FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from './Home.Style';
import PouchDB from '../pouchdb'
import {localNoteDb, nameIndex, remoteNoteDb} from "../const";
import moment from 'moment'
import Toast from "react-native-simple-toast";
import LoadingView from "../Components/LoadingView";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../Themes/Colors";
import NoDataView from "../Components/NoDataView";

let handlerSync = null

const TAG = 'Home.Screen.js'

export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrNote: [],
            isLoading: false
        }
        this.isAtCurrentScreen = true
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
        // localNoteDb.allDocs()
        //     .then(result => {
        //         console.log('aaa', result)
        //     })
        //     .catch(err => {
        //         console.log('bbb', err)
        //     })

        // remoteNoteDb.createIndex({
        //     index: {
        //         fields: ['updated_at'],
        //         name: nameIndex.UPDATED_AT,
        //         ddoc: nameIndex.UPDATED_AT,
        //     }
        // }).then((result) => {
        //     console.log(TAG, result)
        // }).catch((err) => {
        //     console.log(TAG, err)
        // })
    }

    handleBackPress = () => {
        Alert.alert("Confirm", "Are you sure to exit the application", [
            {text: "NO"},
            {text: "YES", onPress: () => BackHandler.exitApp()}
        ])
        return true
    }

    syncDb = () => {
        this.setState({isLoading: true})
        handlerSync = PouchDB.sync(remoteNoteDb, localNoteDb, {
            live: true,
            retry: true,
        })
            .on('change', (info) => {
                // console.log(TAG, 'sync onChange', info)
            })
            .on('paused', (err) => {
                // console.log(TAG, 'sync onPaused', err)
                if (this.isAtCurrentScreen) {
                    this.getListNoteFromDb()
                }
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

    getListNoteFromDb = () => {
        this.setState({isLoading: true})
        localNoteDb
            .find({
                selector: {
                    updated_at: {$gt: true}
                },
                use_index: nameIndex.UPDATED_AT,
                sort: [{updated_at: 'desc'}]
            })
            .then(result => {
                // console.log(TAG, 'find list note', result)
                this.setState({
                    isLoading: false,
                    arrNote: [...result.docs]
                })
            })
            .catch(err => {
                console.log(TAG, 'err find list note', err)
                this.setState({isLoading: false})
                Toast.show(err.message)
            })
    }

    returnFromDetail = () => {
        this.isAtCurrentScreen = true
        this.getListNoteFromDb()
    }

    returnFromAddNewNote = () => {
        this.isAtCurrentScreen = true
        this.getListNoteFromDb()
    }

    onAddNewPress = () => {
        this.isAtCurrentScreen = false
        this.props.navigation.navigate('AddNewNoteScreen', {
            returnFromAddNewNote: this.returnFromAddNewNote.bind(this)
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
                <View style={styles.viewWrapTitleToolbar}>
                    <Text style={styles.titleToolbar}>Home</Text>
                </View>
            </View>
        )
    }

    renderBody = () => {
        return (
            <View style={styles.body}>
                {this.state.arrNote && this.state.arrNote.length > 0 ?
                    <FlatList
                        style={styles.viewList}
                        data={this.state.arrNote}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.renderItemSeparator}
                        ListHeaderComponent={this.renderFooterList}
                        ListFooterComponent={this.renderFooterList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    /> :
                    <NoDataView onRetryPress={this.getListNoteFromDb}/>
                }


                <TouchableOpacity
                    style={styles.btnAddNew}
                    onPress={this.onAddNewPress}
                >
                    <MaterialCommunityIcons name={"plus-circle"} size={50} color={colors.primary}/>
                </TouchableOpacity>
            </View>
        )
    }

    renderItem = ({item}) => {
        return (
            <TouchableOpacity
                style={styles.viewWrapItem}
                onPress={() => {
                    this.isAtCurrentScreen = false
                    this.props.navigation.navigate('DetailScreen', {
                        note: item,
                        returnFromDetail: this.returnFromDetail.bind(this)
                    })
                }}
            >
                <Text style={styles.textTitle} numberOfLines={1}>{item.title}</Text>
                {/*<Text style={styles.textDescription} numberOfLines={2}>{item.content.substring(0, 150)}</Text>*/}
                <Text style={styles.textTime} numberOfLines={1}>
                    {`${moment.unix(item.updated_at).format('MM-DD-YYYY HH:mm')}`}
                </Text>
            </TouchableOpacity>
        )
    }

    renderItemSeparator = () => {
        return <View style={{height: 10}}/>
    }

    renderFooterList = () => {
        return (
            <View style={{height: 10}}/>
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
