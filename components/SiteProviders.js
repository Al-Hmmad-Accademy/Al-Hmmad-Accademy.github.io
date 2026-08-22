 'use client';
import {useEffect,useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import {ThemeProvider} from './ThemeProvider';
import {AuthProvider} from './AuthProvider';
import AIWidget from './AIWidget';
export function SiteProviders({children}){
 const [toast,setToast]=useState('');
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)}},[toast]);
 return <ThemeProvider><AuthProvider><Header/><main>{children}</main><Footer/><button className="icon-btn top-btn" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>↑</button>{toast&&<div className="toast">{toast}</div>}<AIWidget/></AuthProvider></ThemeProvider>
}
