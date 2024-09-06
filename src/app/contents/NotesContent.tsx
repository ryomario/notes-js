import { useTranslation } from "react-i18next"
import Button from "../../components/Button"
import Content, { ContentProps } from "./Content"
import IconGrid from "../../assets/icons/layout-grid.svg"
import IconList from "../../assets/icons/layout-list.svg"
import IconImport from "../../assets/icons/import.svg"
import IconExport from "../../assets/icons/export.svg"
import { useSavedState } from "../../store/Preferences"
import { useEffect, useState } from "react"
import Notes from "../../components/Notes"
import NotesStore from "../../store/Notes"
import Note, { NoteRaw } from "../../models/Note"
import { FileJSONParse, importFile } from "../../utils/func"

type NotesContentProps = ContentProps & {
    id: string,
    title: string,
    filterAttr?: Partial<NoteRaw>,
}

function NotesContent({ open, title, id, filterAttr }: Readonly<NotesContentProps>) {
    const { t } = useTranslation()
    const {state:isGrid, setState:setIsGrid} = useSavedState<boolean>('last-isgrid-content-'+id,true)
    const toggleGrid = () => {
        setIsGrid(old => !old)
    }

    const [notes, setNotes] = useState<Array<Note>|null>(null)

    useEffect(() => {
        NotesStore.getAll(note => {
            // console.log(note)
            // setNotes(oldNotes => {
            //     if(!oldNotes)oldNotes = []
            //     oldNotes.push(Note.createFromObject(note))
            //     return oldNotes
            // })
            // trigerred twice 
        },(allNotes) => {
            // console.log('loaded all')
            const _notes: Array<Note> = []
            allNotes.forEach(note => {
                let pass = true
                if(filterAttr) {
                    for (const key in filterAttr) {
                        if((note as any)[key] != (filterAttr as any)[key])pass = false
                    }
                }
                if(pass)_notes.push(Note.createFromObject(note))
            })
            setNotes(_notes)
        })
    },[])

    const handleClickImport = () => {
        importFile('application/json,text/*',{
            onimported: (file) => {
                if(file.type != 'application/json'){
                    let type = file.type.split('/')[0];
                    if(!type)throw new Error('File not selected!');
                    if(type != 'text')throw new Error('File type not JSON or any TEXT!');
                }
                FileJSONParse(file,{
                    onsuccess: (data) => {
                        NotesStore.importNotes(data,(note) => {
                            console.log('saved', note.title)
                        },t);
                    },
                    onfailed: (error) => {
                        window.alert('Import error JSONParse : \n' + error.message);
                    }
                });
            },
            onfailed: (error) => {
                window.alert('Import error : \n' + error.message);
            }
        })
    }
    if(!open)return null
    return (
        <Content open={open}>
            <div className="content-header">
                <div className="content-title">{title}</div>
                <div className="content-tools">
                    <Button text={t(isGrid?'content_tools_changelist':'content_tools_changegrid')} wrap={true} icon={isGrid?<IconList/>:<IconGrid/>} iconOnly={true}
                        onClick={toggleGrid}
                    />
                    <Button text={t('content_tools_import')} wrap={true} icon={<IconImport/>}
                        onClick={handleClickImport}
                    />
                    <Button text={t('content_tools_export')} wrap={true} icon={<IconExport/>} disabled={true}
                        // onClick={}
                    />
                </div>
            </div>
            <div className="content-notes">
                {!notes?"Loading":<Notes isGrid={isGrid!} notes={notes!}/>}
            </div>
        </Content>
    )
}

export default NotesContent