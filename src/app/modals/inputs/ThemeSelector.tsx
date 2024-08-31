import { getTheme, useTheme } from "../../../theme"
import ThemeCard from "../../../components/Theme/ThemeCard"
import styled from "styled-components"

function ThemeSelector() {
    const { theme, themeIds, changeTheme } = useTheme()

    return (
        <StyledContainer>
            {themeIds.map(id => <ThemeCard key={id} themeId={id} active={id === theme.id} onClick={() => changeTheme(id)}/>)}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    & > * {
        min-width: 200px;
    }
`


export default ThemeSelector