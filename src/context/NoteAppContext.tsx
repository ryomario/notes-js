import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from "react"
import { ModalManagerContext } from "./ModalManagerContext"
import { MODAL_ID as NOTE_MODAL_ID } from '../app/modals/note'
import { MODAL_ID as NOTE_MODAL_DELETE_ID } from '../app/modals/note/ModalDelete'

type openNoteModalType = (noteId?: string,readonly?:boolean) => void
export type NoteAppContextType = {
    openNoteModal?: openNoteModalType,
    openDeleteNoteModal?: openNoteModalType,
    addOnOpenNoteModal?: (id:string,callback:openNoteModalType) => void,
    toggleRefresh?: () => void,
    refreshHelper?: boolean,
}
  
export const NoteAppContext = createContext<NoteAppContextType>({})


export function NoteAppContextProvider({ children }: Readonly<PropsWithChildren>) {
    const [refreshHelper, setRefreshHelper] = useState(false)
    const openNoteModalListeners: Map<string,openNoteModalType> = useMemo(() => new Map<string, openNoteModalType>(),[])

    const toggleRefresh = () => {
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

    const openDeleteNoteModal = (noteId?: string) => {
        openNoteModalListeners.get(NOTE_MODAL_DELETE_ID)?.(noteId)
        openModal(NOTE_MODAL_DELETE_ID)
    }

    return (
        <NoteAppContext.Provider value={{ openNoteModal, addOnOpenNoteModal, openDeleteNoteModal, toggleRefresh, refreshHelper }}>
            {children}
        </NoteAppContext.Provider>
    )
}