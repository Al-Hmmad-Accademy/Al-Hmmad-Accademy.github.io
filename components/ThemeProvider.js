 'use client';
import {createContext,useContext,useEffect,useState} from 'react';
const C=createContext();
export function ThemeProvider({children}){const [light,setLight]=useState(false);useEffect(()=>{setLight(localStorage.getItem('academyTheme')==='light')},[]);useEffect(()=>{document.documentElement.classList.toggle('light',light);localStorage.setItem('academyTheme',light?'light':'dark')},[light]);return <C.Provider value={{light,setLight}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
