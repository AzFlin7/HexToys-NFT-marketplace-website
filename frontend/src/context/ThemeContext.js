import { useState, createContext } from "react"

const ThemeContext = createContext({
  theme: "dark",
  setTheme: (val) => {},
})

export default ThemeContext

export function ThemeProvider(props) {
    const [theme, setTheme] = useState("dark")
    const value = { theme , setTheme }
  
    return (
      <ThemeContext.Provider value={value}>
        {props.children}
      </ThemeContext.Provider>
    )
}