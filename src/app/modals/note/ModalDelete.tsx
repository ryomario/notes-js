import { useContext, useEffect, useState } from "react"
import { ModalManagerContext } from "../../../context/ModalManagerContext"
import { NoteAppContext } from "../../../context/NoteAppContext"
import { useTranslation } from "react-i18next"
import Note, { NoteRaw } from "../../../models/Note"
import NotesStore from "../../../store/Notes"
import Modal from "../../../components/Modal"
import styled from "styled-components"
import Button from "../../../components/Button"

export const MODAL_ID = 'modal-note-delete'

function ModalDelete() {
    const { isOpen, closeModal } = useContext(ModalManagerContext)
    const { addOnOpenNoteModal, toggleRefresh } = useContext(NoteAppContext)
    const { t } = useTranslation()
    const [note, setNote] = useState<Note|null>(null)
    const [deleting, setDeleting] = useState(false)

    const onClose = () => {
        if(!deleting){
            closeModal()
        }        
    }

    const onDelete = () => {
        if(!deleting && note){
            setDeleting(true)
            NotesStore.delete(note.id,(deleted) => {
                if(deleted) {
                    toggleRefresh?.()
                    setDeleting(false)
                    closeModal()
                }
            })
        }
    }

    useEffect(() => {
        addOnOpenNoteModal?.(MODAL_ID,(noteId?: string) => {
            if(deleting)return
            setNote(null)
            if(noteId) {
                NotesStore.get(noteId, (_note_data: NoteRaw) => {
                    setNote(Note.createFromObject(_note_data))
                })
            }
        })
    },[])

    return (
        <Modal open={isOpen(MODAL_ID)} onClose={onClose} title={t('modal_delete_note_title')} size="sm">
            <p>{t('note_delete_message',{noteTitle: note?.title})}</p>
            <br />
            <br />
            <StyledFooter>
                <Button text={t('btn_cancel_delete_note')} disabled={deleting} onClick={onClose} size="lg" align="center"/>
                <Button text={t('btn_delete_note')} wrap={true} disabled={deleting} onClick={onDelete} size="lg" align="center"/>
            </StyledFooter>
        </Modal>
    )
}

const StyledFooter = styled.div`
    display: flex;
    button:first-child {
        flex-grow: 1;
        margin-right: 1em;
    }
`

export default ModalDelete