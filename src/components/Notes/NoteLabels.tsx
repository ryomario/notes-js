import styled from "styled-components"
import NoteLabel from "./NoteLabel"

type NoteLabelsProps = {
    labels: Array<string>,
    readonly?: boolean,
    onRemove?: (label: string) => void,
}

function NoteLabels({ labels, readonly = true, onRemove }: Readonly<NoteLabelsProps>) {
    if(labels.length == 0 )return null
    return (
        <StyledContainer>
            {labels.map(label => <NoteLabel key={label} label={label} readonly={readonly} onRemove={() => onRemove?.(label)}/>)}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    & > :not(:last-child) {
        margin-right: 0.25em;
    }
`

export default NoteLabels