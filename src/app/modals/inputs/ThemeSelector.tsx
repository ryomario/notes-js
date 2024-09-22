import { useTheme } from "../../../theme"
import ThemeCard from "../../../components/Theme/ThemeCard"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

function ThemeSelector() {
    const { t } = useTranslation()
    const { theme, themeIds, changeTheme } = useTheme()

    return (
        <>
            <div>{t('settings_theme_selector_label')}</div>
            <StyledContainer>
                {themeIds.map(id => <ThemeCard key={id} themeId={id} active={id === theme.id} onClick={() => changeTheme(id)}/>)}
            </StyledContainer>
        </>
    )
}

const StyledContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    & > * {
        min-width: 150px;
    }
`


export default ThemeSelector