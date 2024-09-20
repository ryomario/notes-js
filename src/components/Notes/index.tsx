import styled from "styled-components"
import NoteModel from "../../models/Note"
import Note from "./Note"
import { useTranslation } from "react-i18next"

export type NotesProps = {
    isGrid: boolean,
    notes: Array<NoteModel>,
    hideOptions?: boolean,
}

function Notes({ isGrid, notes, hideOptions = false }:Readonly<NotesProps>) {
    const { t } = useTranslation()
    if(notes.length == 0)return <div style={{textAlign:'center'}}>{t('empty_notes')}</div>
    return (
        <StyledNotesContainer className={isGrid ? 'grid' : 'list card'}>
            {notes.map(note => <Note key={note.id} isGrid={isGrid} note={note} hideOptions={hideOptions}/>)}
        </StyledNotesContainer>
    )
}

const StyledNotesContainer = styled.div`
    --gap: 1em;
    display: flex;
    flex-wrap: wrap;
    &, & *, & *::before, & *::after {
        box-sizing: border-box;
    }
    &.grid {
        margin-right: calc(-1 * var(--gap));
    }
    &.list {
        overflow: visible;
    }
    &.card, .card {
        border: 1px solid #0007;
        border-radius: 0.5em;
        background-color: ${({ theme }) => theme?.colors?.card?.background};
        color: ${({ theme }) => theme?.colors?.card?.text};
    }
`

export default Notes