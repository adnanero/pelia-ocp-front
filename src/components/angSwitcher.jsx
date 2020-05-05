import React from 'react'
import Cookies from 'js-cookie'
import '../assets/css/style.css'

export default function angSwitcher(props) {
    let lang = Cookies.get('lang');
    lang = (lang === undefined) ? "fr" : lang
    const switchLang = (e) =>{
        Cookies.set('lang', e.currentTarget.getAttribute('id'))
        window.location.reload(false);  
    }

    return (
        lang === 'ar' ?
        <div className="switch-lang"> 
        <div style={{direction:"rtl" , textAlign:"right"}} className="current-lang">
            <img className="lang-flag mx-2" src="https://img.icons8.com/color/48/000000/morocco-circular.png" alt="arab"/>
            <p style={{direction:"rtl", textAlign:"right"}} className="lang-text">عربي</p>
        </div>
        <div className="lang-dropdown">
            <div className="selecting-lang" id="fr" onClick={switchLang}>
                <img className="lang-flag mx-2"  src="https://cdn2.iconfinder.com/data/icons/world-flag-icons/128/Flag_of_France.png" alt="français"/>
                <p className="lang-text">Français</p>
            </div>
        </div>
        </div>
        :
        <div className="switch-lang"> 
            <div className="current-lang" >
                <img className="lang-flag mx-2" src="https://cdn2.iconfinder.com/data/icons/world-flag-icons/128/Flag_of_France.png" alt="français"/>
                <p className="lang-text" >Français</p>
                <div style={{direction:"rtl" , textAlign:"right"}} className="lang-dropdown">
                    <div className="selecting-lang" id="ar" onClick={switchLang}>
                        <img className="lang-flag mx-2" src="https://img.icons8.com/color/48/000000/morocco-circular.png" alt="arab"/>
                        <p className="lang-text">عربي</p>
                        </div>

                    </div>
            </div>
        </div>
    )
}
