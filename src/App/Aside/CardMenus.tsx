import styled from "styled-components"
import { StyledCard } from "../../components/Card"

export type MenuType = {
    id: string,
    label: string,
    icon?: React.ReactNode,
    selected?: boolean,
}
type CardMenusProps = {
    menus: Array<MenuType>,
    onClickMenu: (id: string, menu: MenuType) => void,
}

function CardMenus({ menus, onClickMenu }: Readonly<CardMenusProps>) {
    if(menus.length == 0)return null
    return (
        <StyledCardList>
            {menus.map(menu => <StyledItem key={menu.id} className={menu.selected?'active':''} onClick={() => onClickMenu(menu.id, menu)}>
                {menu.icon && <span className="icon">{menu.icon}</span>}
                <span className="label">{menu.label}</span>
            </StyledItem>)}
        </StyledCardList>
    )
}

const StyledCardList = styled(StyledCard)`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const StyledItem = styled.div`
    display: flex;
    padding: 0.25em 0.5em;
    align-items: center;
    background-color: inherit;

    & .icon {
        width: 1.5em;
        height: 1.5em;
    }
    & .label {
        flex-grow: 1;
    }
    &:not(.disabled) {
        cursor: pointer;
    }
    &:not(.disabled):hover,
    &:not(.disabled).active {
        background-color: ${({ theme }) => theme?.colors?.card?.accent};
    }
`

export default CardMenus