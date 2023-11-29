import { useState } from 'react';
import { useStore, useTranslate, ToggleThemeButton } from 'react-admin';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';

import { themes, ThemeName } from './themes';

export const ThemeSwapper = () => {
    const [themeName, setThemeName] = useStore<ThemeName>('themeName', 'soft');

    const currentTheme = themes.find(theme => theme.name === themeName);

    return (
        <>
            {currentTheme?.dark ? <ToggleThemeButton /> : null}
        </>
    );
};