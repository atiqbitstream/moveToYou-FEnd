import { Injectable } from "@angular/core";

@Injectable({providedIn:"root"})

export class ThemeService
{

private _currentTheme : 'light' | 'dark' = 'light';

toggleTheme()
{
    this._currentTheme=this._currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
}

get currentTheme()
{
    return this._currentTheme;
}


}