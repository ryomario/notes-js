import React from "react"
import styled from "styled-components"

type CardProps = {
    style?: React.CSSProperties
} & React.PropsWithChildren

function Card({ children, style }: Readonly<CardProps>) {
    return (
        <StyledCard style={style}>
            { children }
        </StyledCard>
    )
}

export const StyledCard = styled.div`
    padding: 0;
    border: 1px solid;
    border-radius: 0.5em;
    background-color: ${({ theme }) => theme?.colors?.card?.background};
    color: ${({ theme }) => theme?.colors?.card?.text};
`

export default Card