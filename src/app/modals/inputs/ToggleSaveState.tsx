import { useEffect, useState } from "react"
import styled from "styled-components"
import Preferences from "../../../store/Preferences"
import { useTranslation } from "react-i18next"

function ToggleSaveState() {
    const { t } = useTranslation()
    const [isSave, setIsSave] = useState<boolean|null>(null)
    const toggleIsSave = () => {
        setIsSave(old => !old)
    }
    useEffect(() => {
        Preferences.get('save-last-state',(_isSave: boolean) => {
            setIsSave(_isSave)
        })
    },[])
    useEffect(() => {
        if(isSave !== null) {
            Preferences.set('save-last-state',isSave,() => {
                console.log('saved', isSave)
            })
        }
    },[isSave])

    const className = isSave ? 'checked' : ''
    return (
        <StyledLabel className={isSave == null ? 'disabled' :  className} onClick={toggleIsSave}>
            <span className="toggle"></span>
            <span className="label">{t('settings_save_last_state_label')}</span>
        </StyledLabel>
    )
}

const StyledLabel = styled.label`
    display: inline-block;
    &:not(.disabled) {
        cursor: pointer;
    }
    &.disabled {
        opacity: 0.5;
    }
    & .toggle {
        box-sizing: border-box;
        display: inline-flex;
        font-size: 3em;
        width: 1em;
        height: 0.5em;
        background-color: #ccc;
        color: ${({ theme }) => theme?.colors?.field?.text};
        border: 1px solid #ccc;
        border-radius: 9999px;
        vertical-align: middle;
        transition: opacity 200ms;
    }
    & .toggle::before {
        content: '';
        display: block;
        height: 100%;
        width: 0.5em;
        border-radius: 50%;
        box-shadow: 1px 1px 3px #0002;
        background-color: ${({ theme }) => theme?.colors?.field?.background};
        transition: margin-left 200ms;
    }
    & .label {
        vertical-align: middle;
        margin-left: 0.5em;
    }
    &.checked .toggle {
        background-color: ${({ theme }) => theme?.colors?.field?.primary};
        border-color: ${({ theme }) => theme?.colors?.field?.primary};
    }
    &.checked .toggle::before {
        margin-left: 0.5em;
    }
`

export default ToggleSaveState