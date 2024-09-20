import { FormEvent, FormEventHandler, useContext, useEffect, useState } from "react"
import { ModalManagerContext } from "../../context/ModalManagerContext"
import { useTranslation } from "react-i18next"
import Modal from "../../components/Modal"
import styled from "styled-components"
import Button from "../../components/Button"
import IconSearch from "../../assets/icons/search.svg"
import IconClear from "../../assets/icons/x.svg"
import Note from "../../models/Note"
import Notes from "../../components/Notes"
import NotesStore from "../../store/Notes"

const DELAY = 1000 // 1000ms / 1s
const LOAD_NOTES_COUNT = 5
export const MODAL_ID = 'modal-search'
function ModalSearch() {
    const { openedModalId, isOpen, closeModal: baseCloseModal } = useContext(ModalManagerContext)
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [notes, setNotes] = useState<Array<Note>>([])
    const [textSearch, setTextSearch] = useState('')
    const [showNotesCount, setShowNotesCount] = useState(LOAD_NOTES_COUNT)
    const [canLoadMore, setCanLoadMore] = useState(false)

    const closeModal = () => {
        baseCloseModal()
        setTextSearch('')
        setShowNotesCount(LOAD_NOTES_COUNT)
    }

    let inputWait = 0
    const handleSearchInput: FormEventHandler<HTMLInputElement> = (e: FormEvent) => {
        const value = (e.target as HTMLInputElement).value
        setTextSearch((old) => (old != value)? value: old)
        setShowNotesCount(LOAD_NOTES_COUNT)
        // if(inputWait != 0){
        //     clearTimeout(inputWait)
        //     inputWait = 0
        // }
        // inputWait = setTimeout(() => {
        //     inputWait = 0
        //     setTextSearch((old) => (old != value)? value: old)
        //     setShowNotesCount(LOAD_NOTES_COUNT)
        // }, DELAY);
    }
    const loadMore = () => {
        if(canLoadMore){
            setShowNotesCount(old => old + LOAD_NOTES_COUNT)
        }
    }

    useEffect(() => {
        if(!loading){
            if(textSearch.trim() != ''){
                setLoading(true)
                NotesStore.getAllWithPagination(0,showNotesCount,(allNotes, _, __, _totalPage) => {
                    setCanLoadMore(_totalPage > 1)
                    const _notes: Array<Note> = []
                    allNotes.forEach(note => {
                        _notes.push(Note.createFromObject(note))
                    })
                    setNotes(_notes)
                    setLoading(false)
                },{labels: textSearch.trim(), title: textSearch.trim()})
            }else {
                setNotes([])
            }
        }
    },[textSearch, showNotesCount])

    const footer = notes.length == 0 ? t('search_note_empty'):canLoadMore && <Button text={t('search_note_load_more')} onClick={loadMore} size="md"/>

    return (
        <Modal open={isOpen(MODAL_ID)} onClose={closeModal} title="" size="md" position="top" showHeader={false}>
            <StyledSearch>
                <label htmlFor="search-note" className={textSearch == '' ? 'empty':''}>
                    <span className="icon-search"><IconSearch/></span>
                    <input id="search-note" name="search-note" placeholder={t('search_note_placeholder')} autoFocus={true} value={textSearch} onChange={handleSearchInput}/>
                    <Button icon={<IconClear/>} text={t('search_clear_field')} iconOnly={true} circle={true} onClick={() => setTextSearch('')}/>
                </label>
                <Button text={t('cancel_search')} size="md" onClick={closeModal}/>
            </StyledSearch>
            <Notes isGrid={false} notes={notes} hideOptions={true}/>
            <div style={{ textAlign: 'center', marginTop: '0.5em' }}>{loading?t('search_note_loading') : footer}</div>
        </Modal>
    )
}

const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    & > label {
        flex-grow: 1;
        margin-right: 1em;
        position: relative;
        border-radius: 0.25em;
        background-color: ${({theme}) => theme?.colors?.field?.background};
        color: ${({theme}) => theme?.colors?.field?.text};
        &.empty input {
            padding-right: 1em;
        }
        &.empty button {
            display: none;
        }
        & .icon-search {
            display: block;
            width: 1.25em;
            height: 1.25em;
            position: absolute;
            top: 0.5em;
            left: 0.75em;
        }
        & button {
            position: absolute;
            top: 0.5em;
            left: unset;
            right: 0.75em;
        }
        & input {
            font-size: 1em;
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 0.5em 2.5em;
            border: 1px solid #ddd;
            border-radius: inherit;
            background-color: inherit;
            color: inherit;
            outline: none;
        }
        & input:focus {
            outline: inset 1px solid;
        }
    }
`

export default ModalSearch