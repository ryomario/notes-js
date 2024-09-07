import styled from "styled-components"
import NoteModel from "../../models/Note"
import Button from "../Button"
import IconOption from "../../assets/icons/option.svg"
import { useTranslation } from "react-i18next"
import NoteLabels from "./NoteLabels"

type NoteProps = {
    isGrid: boolean,
    note: NoteModel
}

function Note({ isGrid, note }: Readonly<NoteProps>) {
    const { t } = useTranslation()
    return (
        <StyledContainer className={isGrid?'card grid-item':'list-item'}>
            <div className="header">
                <div className="title-container">
                    <span className="title">{note.title}</span>
                    {!isGrid && <NoteLabels labels={note.labels}/>}
                </div>
                <span className="space"></span>
                <Button circle={true} icon={<IconOption/>} iconOnly={true} text={t('note_options')}/>
            </div>
            {isGrid && <NoteLabels labels={note.labels}/>}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    --gap: 1em;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    &.grid-item {
        margin-bottom: var(--gap);
        margin-right: var(--gap);
        width: 300px;
        flex: 1 1 auto;
    }
    &.list-item {
        width: 100%;
        &:hover {
            background-color: ${({ theme }) => theme?.colors?.card?.accent};
        }
        & .header {
            margin-bottom: 0;
        }
    }
    & .header {
        margin-bottom: 1em;
        display: flex;
        align-items: center;
        & > :not(:last-child) {
            margin-right: 0.5em;
        }
        & > .space {
            flex-grow: 1;
        }
        & .title-container {
            display: block;
            overflow: hidden;
        }
        & .title {
            font-size: 1.1em;
            font-weight: bold;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`

export default Note