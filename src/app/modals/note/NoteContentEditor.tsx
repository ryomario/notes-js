import { ContentEditableEvent, Editor, EditorProvider, Separator, Toolbar, createButton, createDropdown, useEditorState } from "react-simple-wysiwyg"
import { StyledField } from "./NoteTitle"
import styled from "styled-components"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import BoldIcon from "../../../assets/icons/bold.svg"
import ItalicIcon from "../../../assets/icons/italic.svg"
import UnderlineIcon from "../../../assets/icons/underline.svg"
import StrikeThroughIcon from "../../../assets/icons/strikethrough.svg"
import ListNumberIcon from "../../../assets/icons/list-numbers.svg"
import ListBulletIcon from "../../../assets/icons/list.svg"
import LinkIcon from "../../../assets/icons/link.svg"
import ClearFormatIcon from "../../../assets/icons/clear-formatting.svg"
import CodeIcon from "../../../assets/icons/code.svg"

type NoteContentEditorProps = {
    label: string,
    value: string,
    loading?: boolean,
    readonly?: boolean,
    onChange?: (value: string) => void,
}

function NoteContentEditor({ label, value, loading, readonly, onChange }: Readonly<NoteContentEditorProps>) {
    const { t } = useTranslation()
    const BtnToolBold = useMemo(() => createButton(t('editor_bold'),<BoldIcon/>,'bold'),[])
    const BtnToolItalic = useMemo(() => createButton(t('editor_italic'),<ItalicIcon/>,'italic'),[])
    const BtnToolUnderline = useMemo(() => createButton(t('editor_underline'),<UnderlineIcon/>,'underline'),[])
    const BtnToolStrikeThrough = useMemo(() => createButton(t('editor_strikethrough'),<StrikeThroughIcon/>,'strikeThrough'),[])
    const BtnToolNumberedList = useMemo(() => createButton(t('editor_list_numbered'),<ListNumberIcon/>,'insertOrderedList'),[])
    const BtnToolBulletList = useMemo(() => createButton(t('editor_list_bullet'),<ListBulletIcon/>,'insertUnorderedList'),[])
    const BtnToolLink = useMemo(() => createButton(t('editor_link'),<LinkIcon/>,function (_a) {
        const $selection = _a.$selection;
        if (($selection === null || $selection === void 0 ? void 0 : $selection.nodeName) === 'A') {
            document.execCommand('unlink');
        }
        else {
            // eslint-disable-next-line no-alert
            document.execCommand('createLink', false, prompt('URL', '') ?? undefined);
        }
    }),[])
    const BtnToolClearFormat = useMemo(() => createButton(t('editor_clear_format'),<ClearFormatIcon/>,'removeFormat'),[])
    const BtnToolStyles = useMemo(() => createDropdown(t('editor_styles'),[
        [t('editor_style_normal'), 'formatBlock', 'DIV'],
        [t('editor_style_header1'), 'formatBlock', 'H1'],
        [t('editor_style_header2'), 'formatBlock', 'H2'],
        [t('editor_style_code'), 'formatBlock', 'PRE'],
    ]),[])

    const HandleChange = (event: ContentEditableEvent) => {
        if(readonly)return
        onChange?.(event.target.value)
    }

    return (
        <StyledFieldContent className={"focus " + ((loading||readonly)?'readonly':'')} label={label}>
            {loading && <span className="input-readonly text-loading">Loading...</span>}
            {(readonly && !loading) && <div dangerouslySetInnerHTML={{__html: value}}></div>}
            {(!readonly && !loading) && (
                <EditorProvider>
                    <Editor value={value} onChange={HandleChange}>
                        <Toolbar>
                            <BtnToolBold/>
                            <BtnToolItalic/>
                            <BtnToolUnderline/>
                            <BtnToolStrikeThrough/>
                            <Separator/>
                            <BtnToolNumberedList/>
                            <BtnToolBulletList/>
                            <Separator/>
                            <BtnToolLink/>
                            <BtnToolClearFormat/>
                            <BtnToolToggleHTML/>
                            <Separator/>
                            <BtnToolStyles/>
                        </Toolbar>
                    </Editor>
                </EditorProvider>
            )}
        </StyledFieldContent>
    )
}

const StyledFieldContent = styled(StyledField).attrs({
    as: 'div',
})`
    display: block;
    width: auto;
    &:not(.readonly) {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 0;
    }
    &[label]::before {
        visibility: hidden !important;
        padding-bottom: 0.25em;
    }
    &[label]::after {
        padding-left: 1.2em;
        padding-bottom: 0.25em;
        display: block !important;
        right: 0;
        border-bottom: 1px solid #0002;
    }
    .rsw-editor {
        border: 0;
        border-radius: 0;
    }
    .rsw-btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .rsw-dd {
        padding: 0.125em 0.25em;
    }
    .rsw-ce {
        overflow: auto;
        max-height: 60vh;
    }
`
function BtnToolToggleHTML({ ...rest }) {
    const { t } = useTranslation()
    const editorState = useEditorState()
  
    function onClick() {
      editorState.update({
        htmlMode: !editorState.htmlMode,
      })
    }
  
    return (
      <button
        className="rsw-btn"
        data-active={editorState.htmlMode}
        onClick={onClick}
        tabIndex={-1}
        title={t('editor_html_mode')}
        type="button"
        {...rest}
      >
        <CodeIcon/>
      </button>
    );
  }

export default NoteContentEditor