import { useTranslation } from "react-i18next"
import Button from "../../components/Button"
import IconImport from "../../assets/icons/import.svg"
import Modal from "../../components/Modal"
import { FileJSONParse } from "../../utils/func"
import NotesStore from "../../store/Notes"
import { ChangeEvent, useContext, useState } from "react"
import styled from "styled-components"
import NoteModel, { NoteRaw } from "../../models/Note"
import { NoteAppContext } from "../../context/NoteAppContext"

type ResultJSONParse = {
    totalData?: number,
    totalInvalid?: number,
    validNotes?: Array<NoteRaw>,
    error?: Error,
} | null

function ImportNotes() {
    const { t } = useTranslation()
    const { toggleRefresh } = useContext(NoteAppContext)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error|null>(null)
    const [selectedFile, setSelectedFile] = useState<File|null>(null)
    const [resultJSONParse, setResultJSONParse] = useState<ResultJSONParse>(null)

    const onClose = () => {
        if(loading)return

        setIsOpen(false)
        setError(null)
        setSelectedFile(null)
        setResultJSONParse(null)
    }

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const file: File|undefined = (e.target as any)?.files[0]
            if(!file){
                throw new Error(t('import_notes_input_file_label_not_selected'))
            }
            if(file.type != 'application/json'){
                let type = file.type.split('/')[0]
                if(!type)throw new Error(t('import_notes_input_file_label_not_selected'))
                if(type != 'text')throw new Error(t('File type not JSON or any TEXT!'))
            }
            setError(null)
            setResultJSONParse(null)
            setSelectedFile(file)
        } catch (error: any) {
            setError(error)
            setSelectedFile(null)
            setResultJSONParse(null)
        }
    }
    const handleParseJSON = () => {
        if(!isOpen || loading || !selectedFile)return

        setLoading(true)
        setError(null)
        setResultJSONParse(null)
        FileJSONParse(selectedFile,{
            onsuccess: checkData,
            onfailed: (error) => {
                setResultJSONParse({error})
            }
        });
    }
    const checkData = (notes: Array<any>) => {
        // check structure
        if(!Array.isArray(notes))throw new Error(t('Import data type not Array!'))
        if(notes.length == 0)throw new Error(t('Import data empty!'))
        let invalidcount = 0
        let count = notes.length

        const notesObj: Array<NoteRaw> = [];
        for (const item of notes) {
            // check structure
            let isValid = NoteModel.isValidObject(item);
            // check is existing
            // if(isValid && exists)isValid = false;

            if(!isValid)invalidcount++;
            else notesObj.push(item);
        }
        setResultJSONParse({
            totalInvalid: invalidcount,
            totalData: count,
            validNotes: notesObj,
        })
        setLoading(false)
    }
    const handleSave = () => {
        if(loading || !resultJSONParse?.validNotes)return

        setLoading(true)
        NotesStore.saveNotesIfNotExist(resultJSONParse.validNotes,(notSavedNotes) => {
            window.alert(t('{{saved_count}} notes saved from total {{total}} valid notes!',{
                saved_count: (resultJSONParse.validNotes!.length - notSavedNotes.length),
                total: resultJSONParse.validNotes?.length
            }))

            toggleRefresh?.()

            setLoading(false)
            setIsOpen(false)
            setError(null)
            setSelectedFile(null)
            setResultJSONParse(null)
        })
    }
    return (
        <>
            <Button text={t('button_setting_import_notes')} wrap={true} icon={<IconImport/>} size="md"
                onClick={() => setIsOpen(true)}
            />
            <Modal open={isOpen} title={t('modal_import_notes_title')} onClose={onClose}>
                <StyledInputFileLabel className={loading?'disabled':''} label={t('import_notes_input_file_label')} filename={selectedFile?.name??t('import_notes_input_file_label_not_selected')} title={selectedFile?.name??t('import_notes_input_file_label_not_selected')}>
                    <input type="file" onChange={handleFileInput} accept="application/json,text/*" disabled={loading}/>
                </StyledInputFileLabel>
                {error && <StyledErrorLog>{error.name} : {error.message}</StyledErrorLog>}
                {selectedFile && (<>
                    <br/>
                    <Button text={t('import_notes_button_parse')} wrap={true} size="md" onClick={handleParseJSON}/>
                    {resultJSONParse?.error && <StyledErrorLog>{resultJSONParse?.error.name} : {resultJSONParse?.error.message}</StyledErrorLog>}
                    <br />
                    {(!resultJSONParse?.error && resultJSONParse?.totalData != undefined) && (<>
                        <pre>{t(resultJSONParse?.totalInvalid! > 0 ? 'Import data, {{totalInvalid}} items invalid from total {{totalData}} items!':'Import data, {{totalData}} items valid!',resultJSONParse)}</pre>
                        <br/>
                        <Button text={t('import_notes_button_save')} wrap={true} size="md" onClick={handleSave} disabled={(resultJSONParse?.totalData - resultJSONParse?.totalInvalid!) == 0}/>
                    </>)}
                </>)}
            </Modal>
        </>
    )
}

const StyledInputFileLabel = styled.label<{label:string,filename?:string}>`
    input {
        display: none;
    }
    display: flex;
    align-items: center;
    background-color: ${({theme}) => theme?.colors?.field?.background};
    color: ${({theme}) => theme?.colors?.field?.text};
    border-radius: 0.25em;
    opacity: 0.8;
    box-shadow: 1px 1px 3px #0002;
    margin-right: 3px;
    margin-bottom: 3px;
    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    &:not(.disabled):hover {
        opacity: 1;
        cursor: pointer;
    }
    &::before {
        content: attr(label);
        display: block;
        white-space: nowrap;
        padding: 0.25em 0.5em;
        background-color: ${({theme}) => theme?.colors?.field?.primary};
        border-radius: inherit;
    }
    &::after {
        content: attr(filename);
        display: block;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.25em;
        opacity: 0.5;
    }
`

const StyledErrorLog = styled.pre`
    font-size: 0.75em;
    color: red;
`

export default ImportNotes