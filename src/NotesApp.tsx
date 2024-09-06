import Header from './app/Header'
import { createGlobalStyle } from 'styled-components'
import CardMenus, { MenuType } from './app/Aside/CardMenus'
import { useTranslation } from 'react-i18next'
import NotesContent from './app/contents/NotesContent'
import { useSavedState } from './store/Preferences'

function NotesApp() {
  const { t } = useTranslation()
  const {state:menuId, setState:setMenuId} = useSavedState<string>('last-opened-menu','all-notes')
  function openMenu(id: string) {
    if(!id)id = 'all-notes'
    if(menuId != id)setMenuId(id)
  }
  return (
    <>
      <GlobalStyles/>
      <Header/>
      <main>
        <aside>
          <CardMenus menus={[
            {
              id: 'all-notes',
              label: t('all_notes_label'),
              selected: menuId == 'all-notes',
            },{
              id: 'pinned-notes',
              label: t('pinned_notes_label'),
              selected: menuId == 'pinned-notes',
            }
          ] as Array<MenuType>} onClickMenu={(id, menu) => {
            openMenu(id)
          }}/>
        </aside>
        <div id="content">
          <NotesContent open={menuId == 'all-notes'} title={t('content_allnotes_title')} id='allnotes'/>
          <NotesContent open={menuId == 'pinned-notes'} title={t('content_pinnednotes_title')} id='pinnednotes' filterAttr={{ pinned: true }}/>
        </div>
      </main>
    </>
  )
}

const GlobalStyles = createGlobalStyle`
:root {
  background: ${({ theme }) => theme?.colors?.body };
  color: ${({ theme }) => theme?.colors?.text };
  font-family: ${({ theme }) => theme?.font }, sans-serif;
}
body {
  margin: 0;
}
button {
  font-family: inherit;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  & > main {
    flex-grow: 1;
    overflow: auto;
    padding: 8px;
    display: block;
    & aside {
      box-sizing: border-box;
      display: block;
      float: left;
      position: sticky;
      top: 0;
      padding: 8px;
      width: 300px;
    }
    & #content {
      box-sizing: border-box;
      width: 100%;
      padding-left: 300px;
    }
    @media (max-width: 768px) {
      & aside {
        float: none;
        position: static;
        width: auto;
      }
      & #content {
        padding-left: 0;
      }
    }
  }
}
`

export default NotesApp
