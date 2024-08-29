import React, { createContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { DEFAULT_THEME, getLocalTheme, getTheme, getThemeIds, saveLocalTheme } from "../theme";

type ThemeContextType = {
    theme: any,
    themeIds: Array<string>,
    changeTheme: (theme: any) => void,
}

const ThemeContext = createContext<ThemeContextType>({
    theme: undefined,
    themeIds: [],
    changeTheme: () => {}
})

function ThemeProvider({ children }: Readonly<React.PropsWithChildren>) {
    const [themeLoaded, setThemeLoaded] = useState(false)
    const [theme, setTheme] = useState(DEFAULT_THEME)
    const [themeIds, setThemeIds] = useState([] as Array<string>)

    const changeTheme = (themeId: string) => {
        getTheme(themeId).then(loadedTheme => {
            if(loadedTheme){
                setTheme(loadedTheme)
                saveLocalTheme(themeId)
            }
        })
    }

    useEffect(() => {
        getLocalTheme().then(localTheme => {
            localTheme ? setTheme(localTheme) : setTheme(DEFAULT_THEME)
            setThemeLoaded(true)
        })
        getThemeIds().then(ids => setThemeIds(ids))
    },[])

    const data: ThemeContextType = {
        theme,
        themeIds,
        changeTheme,
    }
    return (
        <ThemeContext.Provider value={data}>
            {themeLoaded && <StyledThemeProvider theme={theme}>
                { children }
            </StyledThemeProvider>}
        </ThemeContext.Provider>
    )
}

export { ThemeContext, ThemeProvider }