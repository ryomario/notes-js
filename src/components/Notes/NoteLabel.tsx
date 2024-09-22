import styled from "styled-components"
import { Color, getCSSColorRGB, getHueDegFromStr, getTextColorFromBG, transformHue } from "../../utils/colors"
import { CSSProperties } from "react"
import IconX from "../../assets/icons/x.svg"

type NoteLabelProps = {
    label: string,
    readonly?: boolean,
    onRemove?: () => void,
}

const defaultBG: Color = {r:0,g:100,b:200}
const getStyle = (label:string):CSSProperties => {
    const bg = transformHue(defaultBG,getHueDegFromStr(label))
    const textColor = getTextColorFromBG(bg)
    return {
        backgroundColor: getCSSColorRGB(bg),
        color: getCSSColorRGB(textColor),
    }
}

function NoteLabel({ label, readonly = true, onRemove }: Readonly<NoteLabelProps>) {
    return (
        <StyledLabel style={getStyle(label)}>
            {label}
            {!readonly && <button onClick={onRemove}><IconX/></button>}
        </StyledLabel>
    )
}

const StyledLabel = styled.div`
display: inline-flex;
background-color: #fff;
color: #000;
margin-bottom: 0.25em;
font-size: 0.8em;
line-height: 1;
vertical-align: baseline;
font-weight: 700;
white-space: nowrap;
border-radius: 1em;
padding: 0.25em 0.4em;
& button {
    font-size: inherit;
    padding: 0;
    border: 0;
    background-color: transparent;
    color: inherit;

    height: 1em;
    display: inline-block;
    margin-left: 0.5em;
    pointer-events: all;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
        opacity: 1;
    }
}
`

export default NoteLabel