import Button from "../Button"
import IconOption from "../../assets/icons/option.svg"
import { useTranslation } from "react-i18next"
import { MouseEvent, MouseEventHandler, useContext, useState } from "react"
import Popup from "../Popup"
import Note from "../../models/Note"
import styled from "styled-components"
import { NoteAppContext } from "../../context/NoteAppContext"

type ButtonOptionsWithPopupProps = {
    note: Note,
}

function ButtonOptionsWithPopup({ note }: Readonly<ButtonOptionsWithPopupProps>) {
    const { t } = useTranslation()
    const { openNoteModal } = useContext(NoteAppContext)
    const [popupOpen, setPopupOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({x:0,y:0})
    const TogglePopup: MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
        setPopupOpen(open => !open)
        let x = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth
        let y = e.currentTarget.offsetTop
        setPopupPosition({x,y})
    }

    const HandleClickOption = (optName: string) => {
        setPopupOpen(false)
        switch (optName) {
            case 'edit':
                openNoteModal?.(note.id,false)
                break;
        
            default:
                break;
        }
    }

    return (
        <StyledContainer>
            <Button circle={true} icon={<IconOption/>} iconOnly={true} text={t('note_options')} onClick={TogglePopup}/>
            <Popup onClose={() => setPopupOpen(false)} open={popupOpen} position={popupPosition} alignAxis={{x: 'right',y: 'top'}} width={150}>
                <Button text={t('note_option_edit')} fullWidth={true} onClick={() => HandleClickOption('edit')}/>
                <Button text={t(note.pinned?'note_option_unpin':'note_option_pin')} fullWidth={true} onClick={() => HandleClickOption('pin')}/>
                <Button text={t('note_option_delete')} fullWidth={true} onClick={() => HandleClickOption('delete')}/>
            </Popup>
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    position: relative;
    display: inline-block;
`

export default ButtonOptionsWithPopup