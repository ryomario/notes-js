import { CSSProperties, ReactNode } from "react"
import styled from "styled-components"
import ClickAwayListener from "react-click-away-listener"

type Align = 'top'|'left'|'right'|'bottom'|'center'

type PopupProps = {
    open: boolean,
    onClose: Function,
    children: ReactNode,
    position: {x: number, y: number},
    alignAxis?: {x: Align, y: Align},
    width?: number,
}

function Popup({ open, children, position, onClose, alignAxis = {x:'left',y:'top'}, width }: Readonly<PopupProps>) {
    const transformPositionStyles: CSSProperties = ({
        'left|top': { },
        'left|bottom': { translate: '0 -100%' },
        'left|center': { translate: '0 -50%' },
        'right|top': { translate: '-100% 0' },
    } as any)[alignAxis.x + '|' + alignAxis.y]
    const HandleOnClickAway = () => {
        onClose()
    }
    if(!open)return null
    return (
        <ClickAwayListener onClickAway={HandleOnClickAway}>
            <StyledContainer style={{ top: position.y + 'px', left: position.x + 'px', ...transformPositionStyles, maxWidth: !width? 'auto':width }}>
                {children}
            </StyledContainer>
        </ClickAwayListener>
    )
}

const StyledContainer = styled.div`
    display: block;
    position: absolute;
    top: -99999px;
    left: -999999px;
    background-color: ${({ theme }) => theme?.colors?.modal?.background};
    color: ${({ theme }) => theme?.colors?.modal?.text};
    border: 1px solid;
    padding: 0.5em;
    box-shadow: 4px 4px 8px #0002;
    border-radius: 0.5em;
    z-index: 4;
`

export default Popup