import React from "react"
import styled from "styled-components"

type ButtonProps = {
    text: string,
    iconOnly?: boolean,
    size?: string,
    icon?: React.ReactNode,
    wrap?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

function Button({text,iconOnly,size,icon,onClick,wrap}:Readonly<ButtonProps>): React.ReactElement<ButtonProps> {
    const fontSize: string = ({
        'sm': '',
        'md': '1em',
        'lg': '1.25em',
        'xl': '1.5em'
    })[size!] ?? ''
    return (
        <StyledButtonText className={wrap?'wrap':''} style={{fontSize}} onClick={onClick} title={text}>
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
    &:not(:disabled):hover {
        cursor: pointer;
        opacity: 1;
    }
    &:not(:disabled):not(.wrap):hover,
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
        & {
            padding: 0.25em;
        }
        & .label {
            display: none;
        }
        & .icon.icon {
            margin-right: 0;
        }
    }
`

export default Button