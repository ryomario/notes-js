import styled from "styled-components"
import NoteModel from "../../models/Note"
import Button from "../Button"
import IconOption from "../../assets/icons/option.svg"
import { useTranslation } from "react-i18next"
import NoteLabels from "./NoteLabels"

type NoteProps = {
    isGrid: boolean,
    note: NoteModel,
    hideOptions?: boolean,
}

function Note({ isGrid, note, hideOptions = false }: Readonly<NoteProps>) {
    const { t, i18n } = useTranslation()
    return (
        <StyledContainer className={isGrid?'card grid-item':'list-item'}>
            <div className="header">
                <div className="title-container">
                    <span className="title">{note.title}</span>
                    {!isGrid && <NoteLabels labels={note.labels}/>}
                </div>
                <span className="space"></span>
                {!isGrid && <span className="info">{note.getLastUpdated((t as any),i18n.resolvedLanguage)}</span>}
                {!hideOptions && <Button circle={true} icon={<IconOption/>} iconOnly={true} text={t('note_options')}/>}
            </div>
            {isGrid && <NoteLabels labels={note.labels}/>}
            {isGrid && <div className="footer">
                <Button text={t('view_note')} wrap={true}/>
                <span className="info">
                    {note.getLastUpdated((t as any),i18n.resolvedLanguage)}
                </span>
            </div>}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
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
    & .footer {
        margin-top: 1em;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
    }
    & .info {
        font-size: 0.8em;
        opacity: 0.5;
    }
`

export default Note