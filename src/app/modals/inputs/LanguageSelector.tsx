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
                {supportedLngs.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
            </StyledSelect>
        </div>
    )
}

const StyledSelect = styled.select`
    width: 150px;
    padding: 0.25em 0.5em;
`

export default LanguageSelector