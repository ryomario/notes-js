import { useTranslation } from "react-i18next"
import Button from "../../components/Button"
import Content, { ContentProps } from "./Content"
import { useState } from "react"
import IconGrid from "../../assets/icons/layout-grid.svg"
import IconList from "../../assets/icons/layout-list.svg"

function AllNotesContent({ open }: Readonly<ContentProps>) {
    const { t } = useTranslation()
    const [isGrid, setIsGrid] = useState(true)
    const toggleGrid = () => {
        setIsGrid(old => !old)
    }
    if(!open)return null
    return (
        <Content open={open}>
            <div className="content-header">
                <div className="content-title">{t('content_allnotes_title')}</div>
                <div className="content-tools">
                    <Button text={t(isGrid?'content_tools_changelist':'content_tools_changegrid')} wrap={true} icon={isGrid?<IconList/>:<IconGrid/>} iconOnly={true}
                        onClick={toggleGrid}
                    />
                </div>
            </div>
        </Content>
    )
}

export default AllNotesContent