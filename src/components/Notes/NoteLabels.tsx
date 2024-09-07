import styled from "styled-components"
import { Color, getCSSColorRGB, getHueDegFromStr, getTextColorFromBG, transformHue } from "../../utils/colors"
import { CSSProperties } from "react"

type NoteLabelsProps = {
    labels: Array<string>,
}

function NoteLabels({ labels }: Readonly<NoteLabelsProps>) {
    const defaultBG: Color = {r:0,g:100,b:200}
    const getStyle = (label:string):CSSProperties => {
        const bg = transformHue(defaultBG,getHueDegFromStr(label))
        const textColor = getTextColorFromBG(bg)
        return {
            backgroundColor: getCSSColorRGB(bg),
            color: getCSSColorRGB(textColor),
        }
    }
    if(labels.length == 0 )return null
    return (
        <StyledContainer>
            {labels.map(label => <div key={label} className="label" style={getStyle(label)}>{label}</div>)}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    & > :not(:last-child) {
        margin-right: 0.25em;
    }
    & .label {
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
    }
`

export default NoteLabels