import React, { createContext, useState } from "react"

export type ModalManagerContextType = {
    openedModalId: string|undefined,
    isOpen: (modalId:string) => boolean,
    openModal: (modalId:string) => void,
    closeModal: () => void,
}

const ModalManagerContext: React.Context<ModalManagerContextType> = createContext<ModalManagerContextType>({
    openedModalId: undefined,
    isOpen(modalId:string) {
        console.log('is open not handled!')
        return false
    },
    openModal(modalId:string) {
        console.log('open modal not handled!')
    },
    closeModal() {
        console.log('close modal not handled!')
    }
})

function ModalManagerProvider({ children }:Readonly<React.PropsWithChildren>) {
    const [modalId, setModalId] = useState<string|undefined>()
    const isOpen = (_modalId:string) => {
        return modalId === _modalId
    }
    const openModal = (newModalId:string) => {
        if(modalId != newModalId)setModalId(() => newModalId)
    }
    const closeModal = () => {
        setModalId(() => undefined)
    }

    return (
        <ModalManagerContext.Provider value={{ openedModalId: modalId, isOpen, openModal, closeModal }}>
            {children}
        </ModalManagerContext.Provider>
    )
}

export { ModalManagerContext, ModalManagerProvider }