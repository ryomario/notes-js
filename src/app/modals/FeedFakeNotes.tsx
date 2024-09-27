import { useTranslation } from "react-i18next"
import Button from "../../components/Button"
import IconRandom from "../../assets/icons/arrows-random.svg"
import Modal from "../../components/Modal"
import NotesStore from "../../store/Notes"
import { ChangeEvent, useContext, useState } from "react"
import styled from "styled-components"
import NoteModel from "../../models/Note"
import { NoteAppContext } from "../../context/NoteAppContext"
import { StyledField } from "./note/NoteTitle"

const generateAndSaveNotes: (_total: number) => Promise<number> = (total) => {
    return new Promise((resolve,reject) => {
        let count = 0
        function feed() {
            if(count >= total){
                resolve(count)
                return
            }

            try {
                const note = NoteModel.createRandomNote()
                
                NotesStore.set(note.id,note.toObject(),() => {
                    count++
                    feed()
                })
            } catch (error) {
                reject(error)
            }
        }
        feed()
    })
}

function FeedFakeNotes() {
    const { t } = useTranslation()
    const { toggleRefresh } = useContext(NoteAppContext)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error|null>(null)
    const [total, setTotal] = useState<number>(1000)
    const [countSuccess, setCountSuccess] = useState<number>(0)
    const [countDeleted, setCountDeleted] = useState<number>(0)

    const onClose = () => {
        if(loading)return

        setIsOpen(false)
        setError(null)
        setTotal(1000)
        setCountSuccess(0)
        setCountDeleted(0)
    }

    const isValidTotal = total > 0 && total < 10000

    const handleChangeTotalNotes = (e: ChangeEvent<HTMLInputElement>) => {
        let _total = Number(e.target.value)
        if(_total <= 0)_total = 1
        if(_total >= 10000)_total = 9999

        if(_total != total)setTotal(_total)
    }
    const handleFeed = () => {
        if(!isOpen || loading || !isValidTotal)return

        setLoading(true)
        setError(null)
        setCountDeleted(0)
        setCountSuccess(0)
        NotesStore.deleteAll().then((_countDeleted) => {
            setCountDeleted(_countDeleted);
            generateAndSaveNotes(total).then((count) => {
                setCountSuccess(count)
                setLoading(false)
                toggleRefresh?.()
            })
        }).catch(error => {
            setError(error);
        })
    }
    return (
        <>
            <Button text={t('button_setting_feed_notes')} wrap={true} icon={<IconRandom/>} size="md"
                onClick={() => setIsOpen(true)}
            />
            <Modal open={isOpen} title={t('modal_feed_notes_title')} onClose={onClose}>
                <StyledField className={loading?'disabled':''} label={t('feed_notes_input_total_label')}>
                    <input type="number" onChange={handleChangeTotalNotes} value={total} disabled={loading}/>
                </StyledField>
                {isValidTotal && <Button text={t('feed_notes_button_feed')} wrap={true} size="md" onClick={handleFeed} disabled={loading}/>}
                {error && <StyledErrorLog>{error.name} : {error.message}</StyledErrorLog>}
                <br/>
                <pre>{t('{{count}} notes deleted!',{count:countDeleted})}</pre>
                <pre>{loading ? t('Feeding...') : t('Feed completed!')}</pre>
                <pre>{t('{{count}} notes added!',{count:countSuccess})}</pre>
            </Modal>
        </>
    )
}


const StyledErrorLog = styled.pre`
    font-size: 0.75em;
    color: red;
`

export default FeedFakeNotes