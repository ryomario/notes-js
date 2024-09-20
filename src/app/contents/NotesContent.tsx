import { useTranslation } from "react-i18next"
import Button from "../../components/Button"
import Content, { ContentProps } from "./Content"
import IconGrid from "../../assets/icons/layout-grid.svg"
import IconList from "../../assets/icons/layout-list.svg"
import IconExport from "../../assets/icons/export.svg"
import { useSavedState } from "../../store/Preferences"
import { useContext, useEffect, useState } from "react"
import Notes from "../../components/Notes"
import NotesStore from "../../store/Notes"
import Note, { NoteRaw } from "../../models/Note"
import Pagination from "../../components/Pagination"
import { NoteAppContext } from "../../context/NoteAppContext"
import styled from "styled-components"
import { downloadAsJSON } from "../../utils/func"

type NotesContentProps = ContentProps & {
    id: string,
    title: string,
    filterAttr?: Partial<NoteRaw>,
}

function NotesContent({ open, title, id, filterAttr }: Readonly<NotesContentProps>) {
    const { refreshHelper } = useContext(NoteAppContext)
    const { t } = useTranslation()
    const {state:isGrid, setState:setIsGrid} = useSavedState<boolean>('last-isgrid-content-'+id,true)
    const toggleGrid = () => {
        setIsGrid(old => !old)
    }

    const [loading, setLoading] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [notes, setNotes] = useState<Array<Note>>([])
    const [currPage, setCurrPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const notesPerPage = 10

    const HandlePagination = (page: number) => {
        setCurrPage(page)
    }

    const loadNotes = () => {
        if(loading)return
        setLoading(true)
        NotesStore.getAllWithPagination(((currPage - 1) * notesPerPage),notesPerPage,(allNotes, _, __, _totalPage, _totalItems) => {
            setTotalPage(_totalPage)
            setTotalItems(_totalItems??0)
            const _notes: Array<Note> = []
            allNotes.forEach(note => {
                _notes.push(Note.createFromObject(note))
            })
            if(currPage > _totalPage) {
                setCurrPage(_totalPage)
            }
            setNotes(_notes)
            setLoading(false)
        },filterAttr)
    }

    const handleExportNotes = () => {
        if(exporting)return

        setExporting(true)
        NotesStore.getAllWithFilter(filterAttr!, (allFilteredData) => {
            const _datas: Array<any> = []
            allFilteredData.forEach(data => {
                _datas.push(data)
            })
            const process = window.confirm(t('confirm_export_notes',{count:_datas.length}))
            if(process) {
                downloadAsJSON(_datas,t('export_note_name',{id,unique: Date.now()}),() => {
                    setExporting(false)
                },true)
            }
        })
    }

    useEffect(() => {
        loadNotes()
    },[])
    useEffect(() => {
        loadNotes()
    },[currPage,refreshHelper])

    if(!open)return null
    return (
        <Content open={open}>
            <div className="content-header">
                <div className="content-title">{title}</div>
                <div className="content-tools">
                    <Button text={t(isGrid?'content_tools_changelist':'content_tools_changegrid')} wrap={true} icon={isGrid?<IconList/>:<IconGrid/>} iconOnly={true}
                        onClick={toggleGrid}
                    />
                    <Button text={notes.length > 0 ? t('content_tools_export_{{count}}_items',{count: totalItems}) : t('content_tools_export')} wrap={true} icon={<IconExport/>} disabled={notes.length == 0}
                        onClick={handleExportNotes}
                    />
                </div>
            </div>
            <StyledContentNotes className={loading?'loading':(notes.length==0?'empty':'')}>
                {loading?t('loading'):notes.length==0?t('empty_notes'):<Notes isGrid={isGrid!} notes={notes}/>}
            </StyledContentNotes>
            <div className="content-footer">
                <span style={{ fontSize: '0.8em' }}>{t('show_{{count}}_items',{count: notes.length})} {t('from_total_{{count}}_items',{count: totalItems})}</span>
                <div style={{ flexGrow: 1 }}>
                    {totalPage > 1 && <Pagination loading={loading} currentPage={currPage} totalPage={totalPage} handlePagination={HandlePagination} maxPad={1}/>}
                </div>
            </div>
        </Content>
    )
}

const StyledContentNotes = styled.div`
    display: block;
    &.empty,&.loading {
        color: #aaa;
        text-align: center;
    }
`

export default NotesContent