import styled from "styled-components"
import { ButtonSize } from "."
import { CSSProperties, PropsWithChildren } from "react"

type ButtonGroupDirection = 'vertical'|'horizontal'

type ButtonGroupProps = {
    direction?: ButtonGroupDirection,
    size?: ButtonSize,
} & PropsWithChildren

const SIZE_STYLES: Map<ButtonSize,CSSProperties> = new Map()
SIZE_STYLES.set('sm',{fontSize:'0.8em'})
SIZE_STYLES.set('md',{fontSize:'1em'})
SIZE_STYLES.set('lg',{fontSize:'1.25em'})
SIZE_STYLES.set('xl',{fontSize:'1.5em'})
const DIRECTOIN_CLASSLIST: Map<ButtonGroupDirection,Array<string>> = new Map()
DIRECTOIN_CLASSLIST.set('horizontal',['btn-group-h'])
DIRECTOIN_CLASSLIST.set('vertical',['btn-group-v'])

function ButtonGroup({ children, direction = 'horizontal', size = 'md' }: Readonly<ButtonGroupProps>) {
    const styles: CSSProperties = {
        ...SIZE_STYLES.get(size),
    }
    const classList: Array<string> = [
        ...DIRECTOIN_CLASSLIST.get(direction)??[],
    ]
    return (
        <StyledButtonBroup className={classList.join(' ')} style={styles}>
            { children }
        </StyledButtonBroup>
    )
}

const StyledButtonBroup = styled.div`
display: flex;
flex-wrap: wrap;
> * {
    font-size: inherit !important;
}

&.btn-group-h > :first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
&.btn-group-h > :last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
&.btn-group-h > :not(:last-child):not(:first-child) {
    border-radius: 0;
}


&.btn-group-v {
    flex-direction: column;
}

&.btn-group-v > :first-child {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
&.btn-group-v > :last-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
&.btn-group-v > :not(:last-child):not(:first-child) {
    border-radius: 0;
}
`

export default ButtonGroup