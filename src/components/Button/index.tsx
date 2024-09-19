import React from "react"
import styled from "styled-components"

type ButtonProps = {
    text: string,
    iconOnly?: boolean,
    size?: string,
    icon?: React.ReactNode,
    wrap?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    circle?: boolean,
    fullWidth?: boolean,
}

function Button({text,iconOnly,size,icon,onClick,wrap,disabled,circle,fullWidth}:Readonly<ButtonProps>): React.ReactElement<ButtonProps> {
    const fontSize: string = ({
        'sm': '',
        'md': '1em',
        'lg': '1.25em',
        'xl': '1.5em'
    })[size!] ?? ''
    const className: string = `${wrap?'wrap':''} ${circle?'circle':''}`
    return (
        <StyledButtonText className={className} style={{fontSize, width: fullWidth ? '100%':'auto'}} onClick={onClick} title={text} disabled={disabled}>
            {icon && <span className="icon">{icon}</span>}
            {(!iconOnly || !icon) && <span className="label">{text}</span>}
        </StyledButtonText>
    )
}

const StyledButtonText = styled.button`
    background-color: transparent;
    color: inherit;
    border: none;
    outline: none;
    padding: 0.25em 0.5em;
    border-radius: 0.2em;
    display: inline-flex;
    align-items: center;
    opacity: 0.9;
    transition: background-color 200ms;
    &.circle {
        border-radius: 50%;
        padding: 0.25em;
    }
    &:disabled, &.disabled {
        opacity: 0.5 !important;
        cursor: not-allowed;
    }
    &:not(:disabled):hover {
        cursor: pointer;
        opacity: 1;
    }
    &:not(:disabled):not(.disabled):not(.wrap):hover,
    &.wrap {
        background-color: ${({ theme }) => theme?.colors?.button?.background };
        color: ${({ theme }) => theme?.colors?.button?.text };
    }
    & .icon {
        display: block;
        width: 1.25em;
        height: 1.25em;
    }
    & .icon:not(:only-child) {
        margin-right: 0.25em;
    }
    & span {
        text-wrap: nowrap;
    }
    @media (max-width: 768px) {
        & .label:not(:only-child) {
            display: none;
        }
        & .icon.icon {
            margin-right: 0;
        }
    }
`

export default Button