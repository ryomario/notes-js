import styled from "styled-components"
import Button from "../Button"

type PaginatinoProps = {
    currentPage: number,
    totalPage: number,
    loading: boolean,
    handlePagination: (page:number) => void,
    maxPad?: number,
}

type Tool = number|'prev'|'others'|'current'|'next'

function Pagination({ loading, currentPage, totalPage, maxPad = 2, handlePagination }: Readonly<PaginatinoProps>) {
    const arrTools: Array<Tool> = []
    if(currentPage > 1)arrTools.push('prev')
    if((currentPage - maxPad) > 1)arrTools.push(1)
    if((currentPage - maxPad) > 2)arrTools.push('others')
    if(currentPage > 1){
        let showNum = currentPage - maxPad
        while(showNum < currentPage){
            if(showNum >= 1)arrTools.push(showNum)
            showNum++
        }
    }
    arrTools.push('current')
    let showNum = currentPage + 1
    while(showNum <= totalPage && showNum <= (currentPage + maxPad)){
        arrTools.push(showNum)
        showNum++
    }
    if((currentPage + maxPad) < (totalPage - 1))arrTools.push('others')
    if((currentPage + maxPad) < totalPage)arrTools.push(totalPage)
    if(currentPage < totalPage)arrTools.push('next')

    const onClickTool = (tool: Tool) => {
        if(tool == 'current' || tool == 'others')return
        let page = 0
        if(tool == 'prev')page = currentPage - 1
        if(tool == 'next')page = currentPage + 1
        if(typeof tool === 'number')page = tool

        handlePagination(page)
    }
    const getLabel = (tool: Tool): string => ({
        'prev': '<',
        'next': '>',
        'others': '...',
        'current': currentPage.toString(),
    } as any)[tool] ?? (tool as string)
    return (
        <StyledContainer>
            {loading?'Loading...':arrTools.map((tool, i) => <Button 
                key={'pagination-'+i} 
                text={getLabel(tool)} 
                wrap={!['others','next','prev'].includes(tool.toString())} 
                disabled={tool == 'others' || tool == 'current'} 
                onClick={() => onClickTool(tool)}
            />)}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.8em;
    & > :not(:last-child) {
        margin-right: 0.5em;
    }
`

export default Pagination