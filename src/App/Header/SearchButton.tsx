import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import IconSearch from "../../assets/icons/search.svg"

type SearchButtonProps = {
    size?: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

function SearchButton({ size, onClick }: Readonly<SearchButtonProps>): React.ReactElement<SearchButtonProps> {
    const { t } = useTranslation()
    const fontSize: string = ({
        'sm': '',
        'md': '1em',
        'lg': '1.25em',
        'xl': '1.5em'
    })[size!] ?? ''
    return (
        <ButtonStyled onClick={onClick} style={{fontSize}}>
            <span className="icon"><IconSearch/></span>
            <span className="label">{t('search_label')}</span>
            <span className="label-shortcut">{t('search_label_ctrl_k')}</span>
        </ButtonStyled>
    )
}

const ButtonStyled = styled.button`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 300px;
    border: none;
    outline: none;
    border-radius: 100px;
    padding: 4px;
    background-color: ${({ theme }) => theme?.colors?.header?.text };
    color: ${({ theme }) => theme?.colors?.header?.background };
    opacity: 0.9;
    &:not(:disabled):hover {
        opacity: 1;
        cursor: pointer;
        outline: 4px solid ${({ theme }) => theme?.colors?.header?.accent };
    }

    & .icon {
        width: 1.25em;
        height: 1.25em;
    }
    & .label {
        flex-grow: 1;
    }
    & .label-shortcut {
        font-family: monospace;
        display: inline-block;
        background-color: ${({ theme }) => theme?.colors?.header?.background };
        color: ${({ theme }) => theme?.colors?.header?.text };
        opacity: 0.5;
        font-size: 0.75em;
        font-weight: bold;
        padding: 0.25em;
        border-radius: 0.25em;
    }
    @media (max-width: 768px) {
        & {
            background-color: transparent;
            color: inherit;
            width: auto;
        }
        &:not(:disabled):hover {
            outline: none;
        }
        & .label,
        & .label-shortcut {
            display: none;
        }
    }
`

export default SearchButton