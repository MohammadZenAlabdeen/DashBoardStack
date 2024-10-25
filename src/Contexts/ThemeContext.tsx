import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<string>(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.body.className = theme;

        if (theme === 'light') {
            document.body.style.setProperty('--background-color', '#F5F6FA');
            document.body.style.setProperty('--secondary-background-color', 'white');
            document.body.style.setProperty('--input-bg',"#F1F4F9")
            document.body.style.setProperty('--search-bg',"#f4f4f9");
            document.body.style.setProperty('--button-bg',"#e0e7f5");
            document.body.style.setProperty('--text-color', 'black');
        } else {
            document.body.style.setProperty('--background-color', '#1c2433');
            document.body.style.setProperty('--input-bg',"#323c50")
            document.body.style.setProperty('--secondary-background-color', '#273044');
            document.body.style.setProperty('--search-bg',"#323c50");
            document.body.style.setProperty('--button-bg',"#4e586c");
            document.body.style.setProperty('--text-color', 'white');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
