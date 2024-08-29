import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import IconClose from "../../assets/icons/x.svg"
import IconMaximize from "../../assets/icons/maximize.svg"
import IconMinimize from "../../assets/icons/minimize.svg"
import { useTranslation } from "react-i18next"

type Props = {
    open: boolean,
    onClose?: () => void,
    title: string,
    size?: 'sm'|'md'|'lg'|'full',
    supportFullscreen?: boolean
}
type ModalProps = Props & React.PropsWithChildren

function Modal({ open, title, onClose = () => {}, size = 'sm', supportFullscreen, children }:Readonly<ModalProps>): React.ReactElement<ModalProps>|null {
    const enableFullscreen = document.fullscreenEnabled && supportFullscreen
    const { t } = useTranslation()
    const [fullscreen, setFullscreen] = useState(false)
    
    const toggleFullscreen = () => {
        setFullscreen(old => !old)
    }

    const boxStyles = ({
        'sm': { width:'480px' },
        'md': { width:'768px' },
        'lg': { width:'1024px' },
        'full': { width:'100%', maxHeight: '100%', height: '100%', borderRadius: 0 }
    } as any)[fullscreen ? 'full':size]
    
    if(!open)return null
    return (
        <StyledContainer onClick={function(event) {
            if(event.target !== event.currentTarget)return
            onClose()
        }}>
            <div className="box" style={boxStyles}>
                <StyledHeader>
                    <span className="title">{title}</span>
                    {enableFullscreen && <button title={t(fullscreen?'exit_fullscreen':'enter_fullscreen')} onClick={toggleFullscreen}>{fullscreen?<IconMinimize/>:<IconMaximize/>}</button>}
                    <button title={t('close_modal')} style={{ marginLeft: '1em' }} onClick={onClose}><IconClose/></button>
                </StyledHeader>
                <StyledContent>
                    {children}
                </StyledContent>
            </div>
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    position: fixed;
    top: 0;left: 0;right: 0;bottom: 0;
    background-color: #0002;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    & .box {
        box-sizing: border-box;
        background-color: ${({ theme }) => theme?.colors?.modal?.background };
        color: ${({ theme }) => theme?.colors?.modal?.text };
        padding: 1em;
        border-radius: 0.5em;
        box-shadow: 4px 4px 8px #0002;
        display: flex;
        flex-direction: column;
        max-height: calc(100% - 50px);
    }
`

const StyledHeader = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 1em;
    & .title {
        font-size: 1.25em;
        font-weight: bold;
        margin-right: auto;
    }
    & button {
        display: block;
        width: 2em;
        height: 2em;
        padding: 0;
        cursor: pointer;
        background-color: transparent;
        color: inherit;
        border: none;
        outline: none;
        opacity: 0.8;
    }
    & button:hover {
        opacity: 1;
    }
    & button:not(:last-child) {
        margin-right: 0.5em;
    }
`

const StyledContent = styled.div`
    overflow: auto;
`

export default Modal