import Button from "../Button"
import IconOption from "../../assets/icons/option.svg"
import { useTranslation } from "react-i18next"
import { MouseEvent, MouseEventHandler, useContext, useState } from "react"
import Popup from "../Popup"
import Note from "../../models/Note"
import styled from "styled-components"
import { NoteAppContext } from "../../context/NoteAppContext"
import NotesStore from "../../store/Notes"
import IconEdit from "../../assets/icons/edit.svg"
import IconDelete from "../../assets/icons/trash.svg"
import IconPin from "../../assets/icons/pinned.svg"
import IconUnpin from "../../assets/icons/pinned-off.svg"

type ButtonOptionsWithPopupProps = {
    note: Note,
}

function ButtonOptionsWithPopup({ note }: Readonly<ButtonOptionsWithPopupProps>) {
    const { t } = useTranslation()
    const { openNoteModal, openDeleteNoteModal, toggleRefresh } = useContext(NoteAppContext)
    const [popupOpen, setPopupOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({x:0,y:0})
    const TogglePopup: MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
        setPopupOpen(open => !open)
        let x = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth
        let y = e.currentTarget.offsetTop
        setPopupPosition({x,y})
    }

    const togglePinNote = async function() {
        note.pinned = !note.pinned
        NotesStore.set(note.id,note.toObject(),() => {
            toggleRefresh?.()
        })
    }

    const HandleClickOption = (optName: 'edit'|'pin'|'delete') => {
        setPopupOpen(false)
        switch (optName) {
            case 'edit':
                openNoteModal?.(note.id,false)
                break;
            case 'pin':
                togglePinNote()
                break;
            case 'delete':
                openDeleteNoteModal?.(note.id)
                break;
            default:
                break;
        }
    }

    return (
        <StyledContainer>
            <Button circle={true} icon={<IconOption/>} iconOnly={true} text={t('note_options')} onClick={TogglePopup}/>
            <Popup onClose={() => setPopupOpen(false)} open={popupOpen} position={popupPosition} alignAxis={{x: 'right',y: 'top'}} width={150}>
                <Button text={t('note_option_edit')} fullWidth={true} onClick={() => HandleClickOption('edit')} icon={<IconEdit/>}/>
                <Button text={t(note.pinned?'note_option_unpin':'note_option_pin')} fullWidth={true} onClick={() => HandleClickOption('pin')} icon={note.pinned?<IconUnpin/>:<IconPin/>}/>
                <Button text={t('note_option_delete')} fullWidth={true} onClick={() => HandleClickOption('delete')} icon={<IconDelete/>}/>
            </Popup>
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    position: relative;
    display: inline-block;
`

export default ButtonOptionsWithPopup