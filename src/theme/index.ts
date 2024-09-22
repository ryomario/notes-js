import themes from "./themes.json"
import { useContext } from "react"
import { generateNextId } from "../utils/func"
import { ThemeContext } from "../context/ThemeContext"
import ThemesStore from "../store/Themes"
import Preferences from "../store/Preferences"

export async function getThemeIds() {
    return await ThemesStore.getAllKeys()
}
export async function getNextId() {
    const keys = await getThemeIds()
    return generateNextId(keys,'THEME-')
}
export async function getTheme(themeId: string) {
    return await ThemesStore.get(themeId)
}
export async function getLocalTheme(): Promise<any> {
    return new Promise((resolve, reject) => {
        Preferences.get('theme',(themeId) => {
            if(!themeId)resolve(null)
            getTheme(themeId).then(resolve).catch(reject)
        })
    })
}
export function saveLocalTheme(themeId: string) {
    Preferences.set('theme', themeId)
}

// Populate themes in storage
(async function(){
    for (const key in themes) {
        const theme = (themes as any)[key]
        if(!theme.id)theme.id = await getNextId()
        await ThemesStore.set(theme.id,theme) // always update on init
    }
})()

export const DEFAULT_THEME = themes.light

export function useTheme() {
    const { theme, themeIds, changeTheme } = useContext(ThemeContext)

    return { theme, themeIds, changeTheme }
}