import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { supportedLngs } from "../../../i18n/config"
import styled from "styled-components"

function LanguageSelector() {
    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(i18n.resolvedLanguage)
    const onChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value
        i18n.changeLanguage(lang)
        setLanguage(lang)
    }
    return (
        <div>
            {t('select_language_label')}&nbsp;
            <StyledSelect name="lang" value={language} onChange={onChange}>
                {Object.keys(supportedLngs).map(lang => <option key={lang} value={lang}>{lang} - {(supportedLngs as any)[lang]}</option>)}
            </StyledSelect>
        </div>
    )
}

const StyledSelect = styled.select`
    padding: 0.25em 0.5em;
    border: 1px solid #aaa;
    background-color: ${({ theme }) => theme?.colors?.field?.background};
    color: ${({ theme }) => theme?.colors?.field?.text};
`

export default LanguageSelector