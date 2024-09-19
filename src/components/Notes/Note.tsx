import styled from "styled-components"
import NoteModel from "../../models/Note"
import Button from "../Button"
import IconOption from "../../assets/icons/option.svg"
import { useTranslation } from "react-i18next"
import NoteLabels from "./NoteLabels"
import { useContext, useState } from "react"
import Popup from "../Popup"
import ButtonOptionsWithPopup from "./ButtonOptionsWithPopup"
import { NoteAppContext } from "../../context/NoteAppContext"

type NoteProps = {
    isGrid: boolean,
    note: NoteModel,
    hideOptions?: boolean,
}

function Note({ isGrid, note, hideOptions = false }: Readonly<NoteProps>) {
    const { t, i18n } = useTranslation()
    const { openNoteModal } = useContext(NoteAppContext)

    return (
        <StyledContainer className={isGrid?'card grid-item':'list-item'}>
            <div className="header">
                <div className="title-container">
                    <span className="title">{isGrid ? note.title : <button onClick={() => openNoteModal?.(note.id,true)}>{note.title}</button>}</span>
                    {!isGrid && <NoteLabels labels={note.labels}/>}
                </div>
                <span className="space"></span>
                {!isGrid && <span className="info">{note.getLastUpdated((t as any),i18n.resolvedLanguage)}</span>}
                {!hideOptions && <ButtonOptionsWithPopup note={note}/>}
            </div>
            {isGrid && <NoteLabels labels={note.labels}/>}
            {isGrid && <div className="footer">
                <Button text={t('view_note')} wrap={true} onClick={() => openNoteModal?.(note.id,true)}/>
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
    &.list-item:first-child {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
    }
    &.list-item:last-child {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
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
            & button {
                background-color: transparent;
                color: inherit;
                font-size: inherit;
                border: 0;
                outline: none;
                font-weight: inherit;
                &:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
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