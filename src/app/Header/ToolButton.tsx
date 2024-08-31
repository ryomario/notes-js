import styled from "styled-components"

type ButtonProps = {
    text: string,
    icon?: React.ReactNode,
    iconOnly?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    wrap?: boolean,
}

function ToolButton({ text, icon, iconOnly, onClick, wrap }: Readonly<ButtonProps>) {
    return (
        <StyledToolButton onClick={onClick} title={text} className={wrap?'boxed':''}>
            {icon && <span className='icon'>{icon}</span>}
            {(!iconOnly || !icon) && <span className="label">{text}</span> }
        </StyledToolButton>
    )
}

const StyledToolButton = styled.button`
    font-size: 1em;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    border-radius: 99999px;
    padding: 0.25em;
    background-color: inherit;
    color: inherit;
    opacity: 0.8;
    &.boxed {
        background-color: ${({ theme }) => theme?.colors?.header?.text };
        color: ${({ theme }) => theme?.colors?.header?.background };
    }
    &:not(:disabled):hover {
        opacity: 1;
        cursor: pointer;
    }
    & .icon {
        display: block;
        width: 1.25em;
        height: 1.25em;
    }
    & .icon:not(:only-child) {
        margin-right: 0.25em;
    }
    & .label {
        padding-right: 0.25em;
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

export default ToolButton