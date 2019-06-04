import PouchDB from './pouchdb'

export const fontSize = {small: 12, medium: 14, large: 16, header: 18}

export const fontFamily = {
    bold: 'iCielVAGRoundedNext-Bold',
    regular: 'iCielVAGRoundedNext-Regular',
    medium: 'iCielVAGRoundedNext-Medium',
    light: 'iCielVAGRoundedNext-Light',
    demiBold: 'iCielVAGRoundedNext-DemiBold',
    lightItalic: 'iCielVAGRoundedNext-LightItalic'
}

export const nameIndex = {
    UPDATED_AT: 'index-updated_at',
    PARENT_ID: 'index-parent_id'
}

const myIP = "192.168.1.3"

export const remoteNoteDb = new PouchDB(`http://duytq:123456@${myIP}:5984/note`)
export const localNoteDb = new PouchDB('note', {adapter: 'react-native-sqlite'})

export const remoteDetailNoteDb = new PouchDB(`http://duytq:123456@${myIP}:5984/detail_note`)
export const localDetailNoteDb = new PouchDB('detail_note', {adapter: 'react-native-sqlite'})
