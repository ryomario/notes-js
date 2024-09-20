import { useContext } from "react";
import { ModalManagerContext } from "../../context/ModalManagerContext";
import Modal from "../../components/Modal";
import { useTranslation } from "react-i18next";
import ThemeSelector from "./inputs/ThemeSelector";
import ToggleSaveState from "./inputs/ToggleSaveState";
import LanguageSelector from "./inputs/LanguageSelector";
import ImportNotes from "./ImportNotes";

export const MODAL_ID = 'modal-settings'
function ModalSettings() {
    const { openedModalId, isOpen, closeModal } = useContext(ModalManagerContext)
    const { t } = useTranslation()

    return (
        <Modal open={isOpen(MODAL_ID)} onClose={closeModal} title={t('modal_settings_title')} size="md">
            <ToggleSaveState/>
            <br /><br />
            <LanguageSelector/>
            <br />
            <ThemeSelector/>
            <br />
            <ImportNotes/>
        </Modal>
    )
}

export default ModalSettings