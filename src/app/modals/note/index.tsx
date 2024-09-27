import { ReactNode, useContext, useEffect, useReducer } from "react"
import { ModalManagerContext } from "../../../context/ModalManagerContext"
import { useTranslation } from "react-i18next"
import Modal from "../../../components/Modal"
import { NoteAppContext } from "../../../context/NoteAppContext"
import Note, { NoteRaw } from "../../../models/Note"
import NotesStore from "../../../store/Notes"
import NoteTitle from "./NoteTitle"
import NotePinned from "./NotePinned"
import NoteLabelsInput from "./NoteLabels"
import NoteContentEditor from "./NoteContentEditor"
import Button from "../../../components/Button"

export const MODAL_ID = 'modal-note'

enum ModalNoteActionKind {
    LOADING = 'LOADING',
    SAVING = 'SAVING',
    SET_MODAL_TITLE = 'SET_MODAL_TITLE',
    SET_NOTE = 'SET_NOTE',
    CHANGE_NOTE = 'CHANGE_NOTE',
    SET_READONLY = 'SET_READONLY',
}
type ModalNoteState = {
    modalTitle: string,
    changed: boolean,
    note: Note,
    _oldnote: Note,
    readonly: boolean,
    loading: boolean,
    saving: boolean,
}
type ModalNoteAction = {
    type: ModalNoteActionKind,
    payload?: Partial<ModalNoteState>,
}

function reducer(state: ModalNoteState, {type, payload}: ModalNoteAction): ModalNoteState {
    if(!payload)payload = {}
    switch (type) {
        case ModalNoteActionKind.SAVING:
            if(typeof payload.saving === "undefined") payload.saving = true
            return {
                ...state,
                saving: payload.saving,
            }
        case ModalNoteActionKind.LOADING:
            if(typeof payload.loading === "undefined") payload.loading = true
            return {
                ...state,
                loading: payload.loading,
            }
        case ModalNoteActionKind.SET_MODAL_TITLE:
            if(typeof payload.modalTitle === "undefined") payload.modalTitle = ''
            return {
                ...state,
                modalTitle: payload.modalTitle,
            }
        case ModalNoteActionKind.SET_NOTE:
            if(typeof payload.note !== "undefined"){
                if(typeof payload.changed === "undefined")payload.changed = false
                return {
                    ...state,
                    note: payload.note,
                    _oldnote: payload.note,
                    changed: payload.changed,
                }
            }
            break;
        case ModalNoteActionKind.CHANGE_NOTE:
            if(typeof payload.note !== "undefined"){
                payload.changed = Note.isChanged(state._oldnote,payload.note)
                return {
                    ...state,
                    note: payload.note,
                    changed: payload.changed,
                }
            }
            break;
        case ModalNoteActionKind.SET_READONLY:
            if(typeof payload.readonly === "undefined")payload.readonly = true
            return {
                ...state,
                readonly: payload.readonly,
            }
    }
    return {
        ...state,
    }
}
function ModalNote() {
    const { isOpen, closeModal } = useContext(ModalManagerContext)
    const { addOnOpenNoteModal, toggleRefresh } = useContext(NoteAppContext)
    const { t } = useTranslation()
    const [state, dispatch] = useReducer(reducer, {
        modalTitle: t('modal_add_note_title'),
        changed: false,
        note: new Note(t('new_note_title')),
        _oldnote: new Note(t('new_note_title')),
        readonly: false,
        loading: false,
        saving: false,
    })
    
    const onClose = () => {
        if(state.changed){
            if(!confirm(t('confirm_discard_note_changes')))return
        }
        
        closeModal()
    }

    const onSave = () => {
        if(!state.changed || state.saving)return

        async function save() {
            dispatch({ type: ModalNoteActionKind.SAVING })

            state.note.toggleUpdated()
            
            NotesStore.set(state.note.id,state.note.toObject(),() => {
                toggleRefresh?.()
                dispatch({ type: ModalNoteActionKind.SAVING, payload: { saving: false } })
                closeModal()
            })
        }
        save()
    }
    const onChange = (name:'title'|'content'|'add-label'|'remove-label'|'pinned',value: any) => {
        const note = Note.copy(state.note)
        switch (name) {
            case 'title':
                note.title = value
                break;
            case 'content':
                note.content = value
                break;
            case 'add-label':
                note.addLabel(value)
                break;
            case 'remove-label':
                note.removeLabel(value)
                break;
            case 'pinned':
                note.pinned = value
                break;
            default:
                break;
        }
        dispatch({ type: ModalNoteActionKind.CHANGE_NOTE, payload: {note: note}})
    }

    useEffect(() => {
        addOnOpenNoteModal?.(MODAL_ID,(noteId?: string, readonly?: boolean) => {
            dispatch({ type: ModalNoteActionKind.SET_MODAL_TITLE, payload: {modalTitle: t('modal_add_note_title')} });
            dispatch({ type: ModalNoteActionKind.LOADING });
            dispatch({ type: ModalNoteActionKind.SET_READONLY, payload: {readonly} });
            if(noteId) {
                dispatch({ type: ModalNoteActionKind.SET_MODAL_TITLE, payload: {modalTitle: t(readonly?'modal_view_note_title':'modal_edit_note_title')} });
                NotesStore.get(noteId, (_note_data: NoteRaw) => {
                    dispatch({ 
                        type: ModalNoteActionKind.SET_NOTE, payload: {
                            note: Note.createFromObject(_note_data),
                        }
                    });
                    dispatch({ type: ModalNoteActionKind.LOADING, payload: {loading: false} });
                })
            }else if(!readonly){
                dispatch({
                    type: ModalNoteActionKind.SET_NOTE, payload: {
                        note: new Note(t('new_note_title')),
                    } 
                });
                dispatch({ type: ModalNoteActionKind.LOADING, payload: {loading: false} });
            }
        })
    },[])

    const tools: Array<ReactNode> = []
    if(!state.readonly){
        tools.push(
            (<Button key="save-note" text={t(state.saving?'saving_note':'save_note')} onClick={onSave} wrap={true} size="md" disabled={!state.changed}/>),
            (<div key="sep-1" style={{width:'2em'}}></div>)
        )
    }

    return (
        <Modal open={isOpen(MODAL_ID)} onClose={onClose} title={state.modalTitle} size="lg" supportFullscreen={true} tools={tools}>
            <NoteTitle label={t('note_title_label')} title={state.note.title} loading={state.loading} readonly={state.readonly} onChange={(e) => onChange('title',e.target.value)}/>
            <NotePinned label={t('note_pinned_label')} pinned={state.note.pinned} loading={state.loading} readonly={state.readonly} onChange={(pinned) => onChange('pinned',pinned)}/>
            <br />
            <NoteLabelsInput label={t('note_labels_label')} labels={state.note.labels} loading={state.loading} readonly={state.readonly} onEvent={(type,label) => onChange((type=='add'?'add-label':'remove-label'),label)}/>
            <br />
            <NoteContentEditor label={t('note_contents_label')} value={state.note.content} onChange={(value) => onChange('content',value)} loading={state.loading} readonly={state.readonly} />
        </Modal>
    )
}

export default ModalNote