import React from "react"
import styled from "styled-components"

type NoteTitleProps = {
    label: string,
    title: string,
    loading?: boolean,
    readonly?: boolean,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function NoteTitle({ label, title, readonly = false, loading = false, onChange }: Readonly<NoteTitleProps>) {
    return (
        <StyledField label={label} className={(readonly||loading)?"readonly":""}>
            {loading && <span className="input-readonly text-loading">Loading...</span>}
            {!loading && (readonly?<span className="input-readonly">{title}</span>:<input type="text" placeholder={label} value={title} onChange={onChange}/>)}
        </StyledField>
    )
}

export const StyledField = styled.label<{label:string}>`
    display: inline-block;
    width: fit-content;
    background-color: ${({ theme }) => theme?.colors?.field?.background};
    color: ${({ theme }) => theme?.colors?.field?.text};
    box-shadow: 1px 1px 2px #0002;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    border-radius: 0.25em;
    padding: 0.5em 1em;
    overflow: hidden;

    vertical-align: top;
    &[label].readonly {
        cursor: auto;
        box-shadow: inset 1px 1px 2px #0002;
    }
    &:not(.disabled) {
        cursor: text;
    }
    &[label] {
        position: relative;
    }
    &[label]::before,
    &[label]::after {
        content: attr(label);
        display: block;
        line-height: 1;
        height: 1em;
    }
    &[label]::before{
        visibility: hidden;
    }
    &[label].readonly::after {
        display: none;
    }
    &[label]::after {
        display: flex;
        align-items: center;
        position: absolute;
        padding: inherit;
        top: calc(50% - 1em);
        left: 0;
        font-size: inherit;
        opacity: 1;
        transition-duration: 200ms;
        transition-property: top, font-size, opacity;
    }
    &[label].readonly::before,
    &[label].focus::after,
    &[label].with-value::after,
    &[label]:has(input:focus)::after,
    &[label]:has(input:not(:placeholder-shown))::after {
        visibility: visible;
        font-size: 0.8em;
        opacity: 0.5;
        top: 0;
        transform: translateY(0);
    }
    &[label]:has(:focus)::after {
        color: ${({ theme }) => theme?.colors?.field?.text_active};
    }
    &[label] input::placeholder {
        visibility: hidden;
    }
    input,
    .input-readonly {
        display: block;
        width: 100%;
        border: 0;
        outline: none;
        background-color: transparent;
        color: inherit;
        font-size: inherit;
        padding: 0;
    }
    input.inline {
        display: inline-block;
        width: auto;
    }
    input.inline:focus {
        box-shadow: inset 0 -1px 0; /* underline */
    }
    &.with-hint {
        position: relative;
        margin-bottom: 1em;
        overflow: visible;
    }
    .input-hint {
        position: absolute;
        top: calc(100% + 0.1em);
        left: 0;
        width: 100%;
        display: block;
        font-size: 0.8em;
        opacity: 0.5;
        color: inherit;
        text-wrap: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .text-loading {
        opacity: 1;
        animation: blink 1s ease infinite alternate;
        @keyframes blink {
            to {
                opacity: 0;
            }
        }
    }
`

export default NoteTitle