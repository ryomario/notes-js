import Header from './App/Header'
import { createGlobalStyle } from 'styled-components'
import Button from './components/Button'
import { useTheme } from './theme'
import ModalManager from './App/ModalManager'

function NotesApp() {
  const { theme, changeTheme, themeIds } = useTheme()
  return (
    <>
      <GlobalStyles/>
      <Header/>
      <main>
        <aside>ASIDE</aside>
        <div id="content">CONTENT theme { theme?.name }
          <br />
          {themeIds.map(id => {
              // const thm = await getTheme(id)
              return <Button key={id} text={'Change theme '+id} onClick={() => changeTheme(id)}/>
            }
          )}
        </div>
      </main>
      <ModalManager/>
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
#app {
  display: flex;
  flex-direction: column;
  max-height: 100dvh;
}
`

export default NotesApp
