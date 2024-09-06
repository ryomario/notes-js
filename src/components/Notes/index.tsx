import styled from "styled-components"
import Note from "../../models/Note"

export type NotesProps = {
    isGrid: boolean,
    notes: Array<Note>,
}

function Notes({ isGrid, notes }:Readonly<NotesProps>) {
    return (
        <StyledNotesContainer className={isGrid ? '' : 'card'}>
            {notes.map(note => <div key={note.id}>{note.title}</div>)}
        </StyledNotesContainer>
    )
}

const StyledNotesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    &, & *, & *::before, & *::after {
        box-sizing: border-box;
    }
    &.card, .card {
        border: 1px solid #0007;
        border-radius: 0.5em;
        background-color: ${({ theme }) => theme?.colors?.card?.background};
        color: ${({ theme }) => theme?.colors?.card?.text};
    }
`

export default Notes