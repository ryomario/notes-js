import React, { useEffect, useState } from "react"
import styled, { ThemeProvider } from "styled-components"
import { getTheme } from "../../theme"

type ThemeCardProps = {
    themeId: string,
    active: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

function ThemeCard({ themeId, active, onClick }:Readonly<ThemeCardProps>) {
    const [theme, setTheme] = useState<any>({})

    useEffect(() => {
        getTheme(themeId).then(themeLoaded => {
            if(themeLoaded){
                setTheme(themeLoaded)
            }
        })
    },[])

    return (
        <ThemeProvider theme={theme}>
            <StyledThemeCard className={active?'active':''} onClick={onClick}>
                <StyledPreview>
                    <header>
                        <span className="text"/>
                        <span className="space"/>
                        <span className="text" style={{ width: '5em' }}/>
                        <span className="text" style={{ width: '1em' }}/>
                    </header>
                </StyledPreview>
            </StyledThemeCard>
        </ThemeProvider>
    )
}

const StyledThemeCard = styled.button`
    border-radius: 0.5em;
    background-color: #fff;
    color: #0005;
    border: 1px solid #0002;
    overflow: hidden;
    padding: 0;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    cursor: pointer;
    &::after {
        display: block;
        content: '${({ theme }) => theme?.name ?? '...'}';
        padding: 0.5em 1em;
        text-align: center;
    }
    &.active {
        border-width: 2px;
        border-color: #000;
        color: #000;
    }
`

const StyledPreview = styled.div`
    font-size: 0.5em;
    width: 100%;
    background-color: ${({ theme }) => theme?.colors?.body};
    color: ${({ theme }) => theme?.colors?.text};
    display: flex;
    flex-direction: column;
    padding-bottom: 50%;
    position: relative;
    & .text {
        display: inline-block;
        width: 3em;
        height: 0;
        border-bottom: 1em solid;
    }
    & header {
        background-color: ${({ theme }) => theme?.colors?.header?.background};
        color: ${({ theme }) => theme?.colors?.header?.text};
        display: flex;
        align-items: center;
        padding: 0.5em;
        & > :not(:last-child) {
            margin-right: 0.5em;
        }
        & .space {
            flex-grow: 1;
        }
    }
`
export default ThemeCard