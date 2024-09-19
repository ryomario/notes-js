import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react"
import { ModalManagerContext } from "./ModalManagerContext"
import { MODAL_ID as NOTE_MODAL_ID } from '../app/modals/note'

type openNoteModalType = (noteId?: string,readonly?:boolean) => void
export type NoteAppContextType = {
    openNoteModal?: openNoteModalType,
    addOnOpenNoteModal?: (id:string,callback:openNoteModalType) => void,
    toogleRefresh?: () => void,
    refreshHelper?: boolean,
}
  
export const NoteAppContext = createContext<NoteAppContextType>({})


export function NoteAppContextProvider({ children }: Readonly<PropsWithChildren>) {
    const [refreshHelper, setRefreshHelper] = useState(false)
    const openNoteModalListeners: Map<string,openNoteModalType> = useMemo(() => new Map<string, openNoteModalType>(),[])

    const toogleRefresh = () => {
        setRefreshHelper(old => !old)
    }
    const { openModal } = useContext(ModalManagerContext)

    const addOnOpenNoteModal = useCallback((id:string,callback:openNoteModalType) => {
        openNoteModalListeners.set(id,callback)
    },[])

    const openNoteModal = (noteId?: string, readonly: boolean = false) => {
        openNoteModalListeners.get(NOTE_MODAL_ID)?.(noteId,readonly)
        openModal(NOTE_MODAL_ID)
    }

    return (
        <NoteAppContext.Provider value={{ openNoteModal, addOnOpenNoteModal, toogleRefresh, refreshHelper }}>
            {children}
        </NoteAppContext.Provider>
    )
}