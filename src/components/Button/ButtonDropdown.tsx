import styled from "styled-components"
import Button, { ButtonSize, StyledButtonText } from "."
import { CSSProperties, MouseEvent, MouseEventHandler, PropsWithChildren, useState } from "react"
import Popup from "../Popup"

type ButtonAlign = 'left'|'center'|'right'

type ButtonDropdownProps = {
    items: Array<{key:number,value:string}>,
    size?: ButtonSize,
    text: string,
    iconOnly?: boolean,
    icon?: React.ReactNode,
    wrap?: boolean,
    onClick?: (itemKey: number) => void,
    disabled?: boolean,
    circle?: boolean,
    fullWidth?: boolean,
    align?: ButtonAlign,
}

const SIZE_STYLES: Map<ButtonSize,CSSProperties> = new Map()
SIZE_STYLES.set('sm',{fontSize:'0.8em'})
SIZE_STYLES.set('md',{fontSize:'1em'})
SIZE_STYLES.set('lg',{fontSize:'1.25em'})
SIZE_STYLES.set('xl',{fontSize:'1.5em'})
const ALIGN_STYLES: Map<ButtonAlign,CSSProperties> = new Map()
ALIGN_STYLES.set('left',{justifyContent:'flex-start'})
ALIGN_STYLES.set('center',{justifyContent:'center'})
ALIGN_STYLES.set('right',{justifyContent:'flex-end'})

function ButtonDropdown({ items, size = 'md',text,iconOnly,icon,onClick,wrap = true,disabled,circle,fullWidth,align='left' }: Readonly<ButtonDropdownProps>) {

    const [popupOpen, setPopupOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({x:0,y:0})
    const TogglePopup: MouseEventHandler<HTMLElement> = (e: MouseEvent<HTMLElement>) => {
        setPopupOpen(open => !open)
        // relative to button
        let x = e.currentTarget.offsetWidth
        let y = 0
        setPopupPosition({x,y})
    }

    const styles: CSSProperties = {
        ...SIZE_STYLES.get(size),
        ...ALIGN_STYLES.get(align),
        width: fullWidth ? '100%':'auto',
    }
    const classList: Array<string> = [
        (wrap?'wrap':''),
        (circle?'circle':''),
    ]

    return (
        <StyledButtonDropdown className={classList.filter(str => str != '').join(' ')} style={styles} onClick={TogglePopup} title={text} disabled={disabled}>
            {icon && <span className="icon">{icon}</span>}
            {(!iconOnly || !icon) && <span className="label">{text}</span>}
            <Popup onClose={() => setPopupOpen(false)} open={popupOpen} position={popupPosition} alignAxis={{x: 'right',y: 'top'}} width={150}>
                {items.map(item => <Button key={item.key} text={item.value} fullWidth={true} onClick={() => onClick?.(item.key)}/>)}
            </Popup>
        </StyledButtonDropdown>
    )
}

const StyledButtonDropdown = styled(StyledButtonText).attrs({
    as: 'div',
})<{onClick:MouseEventHandler<HTMLElement>}>`
position: relative;
display: inline-flex;
`

export default ButtonDropdown