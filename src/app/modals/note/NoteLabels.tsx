import styled from "styled-components"
import { StyledField } from "./NoteTitle"
import { ChangeEvent, ChangeEventHandler, KeyboardEvent, useState } from "react"
import NoteLabel from "../../../components/Notes/NoteLabel"

type NotePinnedProps = {
    label: string,
    labels: Array<string>,
    loading?: boolean,
    readonly?: boolean,
    onEvent?: (type:'add'|'remove',label:string) => void
}

function NoteLabelsInput({ label, labels, readonly = false, loading = false, onEvent }: Readonly<NotePinnedProps>) {
    const [value, setValue] = useState('')
    const addLabel = (_label: string) => {
        if(readonly || loading)return
        onEvent?.('add',_label)
    }
    const removeLabel = (_label: string) => {
        if(readonly || loading)return
        onEvent?.('remove',_label)
    }
    const onChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        if(readonly || loading)return
        let val = e.target.value
        setValue(val)
    }
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.code == 'Comma' || e.code == 'Enter'){
            addLabel(value.trim())
            setValue('')
            e.preventDefault()
        }
    }
    if(readonly && labels.length == 0) return null
    return (
        <StyledLabelsField htmlFor="note-labels" label={label} className={(readonly||loading)?"readonly":labels.length == 0?'':' with-value'}>
            {loading && <span className="input-readonly text-loading">Loading...</span>}
            {!loading && <div className="labels">
                {labels.map(label => <NoteLabel key={label} label={label} readonly={readonly} onRemove={() => removeLabel(label)}/>)}
                {!(readonly||loading) && <input type="text" value={value} onChange={onChange} onKeyDown={onKeyDown} id="note-labels" placeholder={label}/>}
            </div>}
        </StyledLabelsField>
    )
}

const StyledLabelsField = styled(StyledField)`
    .labels {
        display: inline-flex;
        flex-wrap: wrap;
        & > :not(:last-child) {
            margin-right: 0.25em;
        }
        &.loading
    }
    input {
        display: inline-block;
        width: 300px;
    }
`

export default NoteLabelsInput