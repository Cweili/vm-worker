import { createContext, useContext, createSignal, ParentComponent, Setter } from 'solid-js'

type Lang = 'en' | 'zh'

const I18nContext = createContext<{ lang: () => Lang; setLang: Setter<Lang> }>()

export const I18nProvider: ParentComponent = (props) => {
  const [lang, setLang] = createSignal<Lang>('en')
  return (
    <I18nContext.Provider value={{ lang, setLang }}>
      {props.children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
