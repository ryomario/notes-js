import Logo from '../../assets/icons/icon.svg'
import styled from 'styled-components'
import Button from '../../components/Button'
import IconPlus from '../../assets/icons/plus.svg'
import IconCog from '../../assets/icons/cog.svg'
import { useTranslation } from 'react-i18next'
import SearchButton from './SearchButton'
import Modal from '../../components/Modal'
import { useContext } from 'react'
import { ModalManagerContext } from '../../context/ModalManagerContext'
import { MODAL_ID as SETTINGS_MODAL_ID } from '../modals/ModalSettings'

function Header(){
    const { t } = useTranslation()
    const { openedModalId, isOpen, openModal, closeModal } = useContext(ModalManagerContext)

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
                <SearchButton size='md'
                    onClick={() => {
                        console.log('onClick button search')
                        openModal('modal-search')
                    }}
                />
                <Button text={t('settings')} icon={<IconCog/>}  iconOnly={true} size='sm' wrap={false}
                    onClick={() => {
                        openModal(SETTINGS_MODAL_ID)
                    }}
                />
                <Button text={t('new_note')} icon={<IconPlus/>}  iconOnly={false} size='sm' wrap={true}
                    onClick={() => {
                        console.log('onClick button ass')
                        openModal('modal-add-note')
                    }}
                />
            </div>
            <Modal open={isOpen('modal-search')} title='Search' onClose={closeModal} supportFullscreen={true}/>
            <Modal open={isOpen('modal-add-note')} title='Modal title' onClose={closeModal} supportFullscreen={true}/>
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