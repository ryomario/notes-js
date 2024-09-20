import React from "react";
import styled from "styled-components";

export type ContentProps = {
    open: boolean,
}

type Props = ContentProps & React.PropsWithChildren

function Content({ open, children }: Readonly<Props>) {
    if(!open)return null
    return (
        <StyledContentContainer>
            {children}
        </StyledContentContainer>
    )
}

const StyledContentContainer = styled.div`
    display: block;
    padding: 0.5em;
    & .content-header {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1em;
        & .content-title {
            flex-grow: 1;
            font-weight: bold;
            font-size: 1.25em;
            text-align: center;
        }
        & .content-tools {
            display: flex;
            & > :not(:last-child) {
                margin-right: 0.5em;
            }
        }
    }
    & .content-footer {
        margin-top: 1em;
        display: flex;
        flex-wrap: wrap;
    }
`

export default Content