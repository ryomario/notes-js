import styled from "styled-components"
import { StyledField } from "./NoteTitle"

type NotePinnedProps = {
    label: string,
    pinned: boolean,
    loading?: boolean,
    readonly?: boolean,
    onChange?: (pinned: boolean) => void
}

function NotePinned({ label, pinned, readonly = false, loading = false, onChange }: Readonly<NotePinnedProps>) {
    const togglePinned = () => {
        if(readonly || loading)return
        onChange?.(!pinned)
    }
    return (
        <StyledPinnedField label={label} className={((readonly||loading)?"readonly":"")+(pinned?' checked':'')} onClick={togglePinned}>
            <span className="toggle-preview"></span>
        </StyledPinnedField>
    )
}

const StyledPinnedField = styled(StyledField)`
    background-color: transparent;
    box-shadow: none !important;
    position: static;
    cursor: default !important;
    padding: 0.5em;
    &.readonly .toggle-preview {
        opacity: 0.5;
    }
    &[label]::after {
        position: static;
        display: inline-block;
        vertical-align: middle;
        font-size: inherit !important;
        opacity: 1 !important;
        padding-left: 0.5em;
    }
    &[label]::before {
        display: none;
    }
    &:not(.readonly):hover {
        color: ${({ theme }) => theme?.colors?.field?.text_active};
    }
    &.readonly[label]::after {
        display: inline-block;
    }
    .toggle-preview {
        position: relative;
        display: inline-block;
        width: 3em;
        height: 1.7em;
        vertical-align: middle;
        background-color: #ccc;
        transition: background-color 200ms;
        box-shadow: inset 1px 1px 2px #0002;
        border-radius: 2em;
    }
    .toggle-preview::after {
        content: '';
        position: absolute;
        display: block;
        width: 1.5em;
        height: 1.5em;
        top: 0.1em;
        left: 0.1em;
        background-color: ${({ theme }) => theme?.colors?.field?.background};
        box-shadow: 1px 1px 2px #0002;
        border-radius: 2em;
        transition: left 200ms;
    }
    &.readonly.checked .toggle-preview,
    &.checked .toggle-preview {
        background-color: ${({ theme }) => theme?.colors?.field?.primary};
    }
    &.readonly.checked .toggle-preview::after,
    &.checked .toggle-preview::after {
        left: 1.4em;
    }
`

export default NotePinned