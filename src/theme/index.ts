import themes from "./themes.json"
import DB from "../store/DB"
import { useContext } from "react"
import { generateNextId } from "../utils/func"
import { ThemeContext } from "../context/ThemeContext"

export async function getThemeIds() {
    return await DB.table('themes').getAllKeys<string>()
}
export async function getNextId() {
    const keys = await getThemeIds()
    return generateNextId(keys,'THEME-')
}
export async function getTheme(themeId: string) {
    return await DB.table('themes').get<any>(themeId)
}
export async function getLocalTheme() {
    const themeId = await DB.table('preferences').get<string>('theme')
    if(!themeId)return null
    return await getTheme(themeId)
}
export async function saveLocalTheme(themeId: string) {
    return await DB.table('preferences').set('theme', themeId)
}

// Populate themes in storage
(async function(){
    for (const key in themes) {
        const theme = (themes as any)[key]
        if(!theme.id)theme.id = await getNextId()
        DB.table('themes').set(theme.id,theme) // always update on init
    }
})()

export const DEFAULT_THEME = themes.light

export function useTheme() {
    const { theme, themeIds, changeTheme } = useContext(ThemeContext)

    return { theme, themeIds, changeTheme }
}