import Logo from '../../assets/icons/icon.svg'
import styled from 'styled-components'
import IconPlus from '../../assets/icons/plus.svg'
import IconCog from '../../assets/icons/cog.svg'
import { useTranslation } from 'react-i18next'
import SearchButton from './SearchButton'
import Modal from '../../components/Modal'
import { useContext } from 'react'
import { ModalManagerContext } from '../../context/ModalManagerContext'
import ModalSettings, { MODAL_ID as SETTINGS_MODAL_ID } from '../modals/ModalSettings'
import ToolButton from './ToolButton'
import ModalSearch, { MODAL_ID as SEARCH_MODAL_ID } from '../modals/ModalSearch'
import { NoteAppContext } from '../../context/NoteAppContext'

function Header(){
    const { t } = useTranslation()
    const { openedModalId, isOpen, openModal, closeModal } = useContext(ModalManagerContext)
    const { openNoteModal } = useContext(NoteAppContext)

    document.onkeydown = function(e) {
        if(e.ctrlKey && e.key.toLowerCase() == 'k') {
            if(!openedModalId){
                openModal('modal-search')
                e.stopPropagation()
                e.preventDefault()
            }
        }
    }
    
    return (
        <StyledHeader>
            <div className="header-container">
                <Brand>
                    <div className="logo"><Logo/></div>
                    <div className="app-name">{t('appname')}</div>
                </Brand>
                <div className="space"></div>
                <SearchButton
                    onClick={() => {
                        openModal(SEARCH_MODAL_ID)
                    }}
                />
                <ToolButton text={t('settings')} icon={<IconCog/>}  iconOnly={true} wrap={false}
                    onClick={() => {
                        openModal(SETTINGS_MODAL_ID)
                    }}
                />
                <ToolButton text={t('new_note')} icon={<IconPlus/>}  iconOnly={false} wrap={true}
                    onClick={() => {
                        openNoteModal?.()
                    }}
                />
            </div>
            <ModalSettings/>
            <ModalSearch/>
        </StyledHeader>
    )
}

const StyledHeader = styled.header`
    background-color: ${({ theme }) => theme?.colors?.header?.background };
    color: ${({ theme }) => theme?.colors?.header?.text };
    padding: 8px;
    user-select: none;
    box-shadow: 0 4px 8px #0002;
    z-index: 5;
    & .header-container {
        display: flex;
        align-items: center;
        & .space {
            flex-grow: 1;
        }
        & > :not(:last-child) {
            margin-right: 8px;
        }
    }
`

const Brand = styled.div`
    display: flex;
    align-items: center;
    & .logo {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }
    & .app-name {
        margin-right: 8px;
        font-weight: bold;
        font-size: 1.25em;
    }
    @media (max-width: 768px) {
        & .app-name {
            display: none;
        }
    }
`

export default Header