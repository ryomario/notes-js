import styled from "styled-components"
import NoteModel from "../../models/Note"
import Note from "./Note"

export type NotesProps = {
    isGrid: boolean,
    notes: Array<NoteModel>,
}

function Notes({ isGrid, notes }:Readonly<NotesProps>) {
    if(notes.length == 0)return null
    return (
        <StyledNotesContainer className={isGrid ? 'list' : 'grid card'}>
            {notes.map(note => <Note key={note.id} isGrid={isGrid} note={note}/>)}
        </StyledNotesContainer>
    )
}

const StyledNotesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    &, & *, & *::before, & *::after {
        box-sizing: border-box;
    }
    &.grid {
        overflow: hidden;
    }
    &.card, .card {
        border: 1px solid #0007;
        border-radius: 0.5em;
        background-color: ${({ theme }) => theme?.colors?.card?.background};
        color: ${({ theme }) => theme?.colors?.card?.text};
    }
`

export default Notes