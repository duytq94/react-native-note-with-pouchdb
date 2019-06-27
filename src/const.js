import PouchDB from './pouchdb'
import Toast from "react-native-simple-toast";
import {Keyboard} from "react-native";
import moment from "moment";

export const fontSize = {small: 12, medium: 14, large: 16, header: 18}

export const fontFamily = {
    bold: 'iCielVAGRoundedNext-Bold',
    regular: 'iCielVAGRoundedNext-Regular',
    medium: 'iCielVAGRoundedNext-Medium',
    light: 'iCielVAGRoundedNext-Light',
    demiBold: 'iCielVAGRoundedNext-DemiBold',
    lightItalic: 'iCielVAGRoundedNext-LightItalic'
}

export const nameIndex = {UPDATED_AT: 'index-updated_at'}

const myIP = "192.168.1.5"

export const remoteNoteDb = new PouchDB(`http://duytq:123456@${myIP}:5984/note`)
export const localNoteDb = new PouchDB('note', {adapter: 'react-native-sqlite'})

