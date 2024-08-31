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
    return (
        <StyledLabel className={isSave?'checked':''} onClick={toggleIsSave}>
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
    & .toggle {
        box-sizing: border-box;
        display: inline-flex;
        font-size: 3em;
        width: 1em;
        height: 0.5em;
        background-color: ${({ theme }) => theme?.colors?.field?.background};
        color: ${({ theme }) => theme?.colors?.field?.text};
        border: 1px solid;
        border-radius: 9999px;
        vertical-align: middle;
        opacity: 0.5;
        transition: opacity 200ms;
    }
    & .toggle::before {
        content: '';
        display: block;
        height: 100%;
        border-radius: 50%;
        border-left: 0.5em solid;
        margin-left: -1px;
        transition: margin-left 200ms;
    }
    & .label {
        vertical-align: middle;
        margin-left: 0.5em;
    }
    &.checked .toggle {
        opacity: 1;
    }
    &.checked .toggle::before {
        margin-left: 0.5em;
    }
`

export default ToggleSaveState