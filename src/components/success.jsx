import React from 'react'

import Cookies from 'js-cookie'

let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {  
  all:{
    // float: 'right',
    direction: 'rtl'  /* Right to Left */,
    // textAlign:'right'
  },
  text:{
    textAlign: "right"
  }
}: {

}

export default function success(props) {
    const fermer =() =>{
        props.fermer()
    }
    return (
        <div style={{zIndex:"9"}}>
<div className="intro-circle"></div>
<div className="intro-circle second"></div>
<div className="intro-circle third"></div>
       

<div className="wave-long-wrapper">
  <div className="wave-long-line left">
    <svg viewBox="0 0 751.5 25">
  
      <path className="wave-bottom" d="M344.1,803c14.3,0,14.3,16,28.6,16s14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16" transform="translate(-339.6 -798.5)"></path>
    </svg>
  </div>
  <div className="wave-long-line right">
    <svg viewBox="0 0 751.5 25">
    
      <path className="wave-bottom" d="M344.1,803c14.3,0,14.3,16,28.6,16s14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16,14.3,16,28.6,16,14.3-16,28.6-16" transform="translate(-339.6 -798.5)"></path>
    </svg>
  </div>
</div>
<div className="scoreboard-wrapper">
  <div style={style.all} className="scoreboard-content">
    <h2 className="scoreboard-title" style={style.text}> {content.title[lang]} </h2>
    <h3 className="scoreboard-score" style={style.text}> {content.subtitle[lang]} </h3>
  </div>
  <div className="scoreboard-bg"></div>
</div>
<div className="fireworks-wrapper">
  <div className="firework left wave yellow">
    <svg viewBox="0 0 27 128">
      <path fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="8" d="M2.27373675e-13,119.1 C2.27373675e-13,109.3 18,109.4 18.1,99.5 C18.2,89.6 0.1,89.6 0.2,79.7 C0.3,69.8 18.2,70 18.3,60.1 C18.4,50.2 0.3,50.2 0.4,40.3 C0.5,30.4 18.4,30.5 18.5,20.7 C18.6,10.9 0.5,10.8 0.6,0.9" transform="translate(4 4)"></path>
    </svg>
  </div>
  <div className="firework left wave yellow large">
    <svg viewBox="56 94 26 264">
      <path d="M61.2 353.9c-.1-10.6 15.9-10.7 15.9-21.3 0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2" stroke="#FFF" strokeWidth="8" fill="none" strokeLinecap="round"></path>
    </svg>
  </div>
  <div className="firework left wave cyan">
    <svg viewBox="0 0 27 128">
      <path fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="8" d="M2.27373675e-13,119.1 C2.27373675e-13,109.3 18,109.4 18.1,99.5 C18.2,89.6 0.1,89.6 0.2,79.7 C0.3,69.8 18.2,70 18.3,60.1 C18.4,50.2 0.3,50.2 0.4,40.3 C0.5,30.4 18.4,30.5 18.5,20.7 C18.6,10.9 0.5,10.8 0.6,0.9" transform="translate(4 4)"></path>
    </svg>
  </div>
  <div className="firework left figure hex">
    <svg viewBox="285 -12 30 27">
      <path d="M291.5 11.8l-4.9-8.4c-.82-1.42-.82-3.18 0-4.6l4.9-8.4c.82-1.43 2.35-2.3 4-2.3h9.8c1.65 0 3.18.87 4 2.3l4.9 8.4c.82 1.42.82 3.18 0 4.6l-4.9 8.4c-.82 1.43-2.35 2.3-4 2.3h-9.8c-1.65 0-3.18-.87-4-2.3z" fill="#FFF"></path>
    </svg>
  </div>
  <div className="firework left figure square">
    <svg viewBox="366 -10 25 25">
      <rect width="25" height="24.98" rx="5.4" fill="#FFF" transform="translate(366 -10)"></rect>
    </svg>
  </div>
  <div className="firework right wave white">
    <svg viewBox="0 0 27 128">
      <path fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="8" d="M2.27373675e-13,119.1 C2.27373675e-13,109.3 18,109.4 18.1,99.5 C18.2,89.6 0.1,89.6 0.2,79.7 C0.3,69.8 18.2,70 18.3,60.1 C18.4,50.2 0.3,50.2 0.4,40.3 C0.5,30.4 18.4,30.5 18.5,20.7 C18.6,10.9 0.5,10.8 0.6,0.9" transform="translate(4 4)"></path>
    </svg>
  </div>
  <div className="firework right wave cyan">
    <svg viewBox="0 0 27 128">
      <path fill="none" stroke="#FFF" strokeLinecap="round" strokeWidth="8" d="M2.27373675e-13,119.1 C2.27373675e-13,109.3 18,109.4 18.1,99.5 C18.2,89.6 0.1,89.6 0.2,79.7 C0.3,69.8 18.2,70 18.3,60.1 C18.4,50.2 0.3,50.2 0.4,40.3 C0.5,30.4 18.4,30.5 18.5,20.7 C18.6,10.9 0.5,10.8 0.6,0.9" transform="translate(4 4)"></path>
    </svg>
  </div>
  <div className="firework right wave yellow large">
    <svg viewBox="56 94 26 264">
      <path d="M61.2 353.9c-.1-10.6 15.9-10.7 15.9-21.3 0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2s15.9-10.7 15.9-21.3c0-10.6-16.1-10.5-16.1-21.2" stroke="#FFF" strokeWidth="8" fill="none" strokeLinecap="round"></path>
    </svg>
  </div>
  <div className="firework right figure triangle">
    <svg viewBox="443 -9 26 24">
      <path d="M452.3-7c.74-1.22 2.07-1.96 3.5-1.96 1.43 0 2.76.74 3.5 1.96l4.4 7.5 4.4 7.5c.7 1.26.7 2.8-.02 4.04-.72 1.25-2.04 2.03-3.48 2.06h-17.5c-1.44-.03-2.76-.8-3.48-2.06-.7-1.25-.72-2.78-.02-4.04L448 .5l4.3-7.5z" fill="#6cf0f2"></path>
    </svg>
  </div>
  <div className="firework right figure plus">
    <svg viewBox="212 -16 34 34">
      <path d="M228.9-12v25.9M216 .9h25.9" stroke="#FFF" strokeWidth="8" fill="none" strokeLinecap="round"></path>
    </svg>
  </div>
  <div className="firework line top">
    <svg viewBox="289 515 290 298">
      <path d="M291.1 810s27.7-55.57 142.94-170.9C549.3 523.77 577 517 577 517" stroke="#FFF" strokeWidth="5" strokeDasharray="5 31" fill="none"></path>
    </svg>
  </div>
  <div className="firework line left">
    <svg viewBox="289 515 290 298">
      <path d="M291.1 810s27.7-55.57 142.94-170.9C549.3 523.77 577 517 577 517" stroke="#FFF" strokeWidth="5" strokeDasharray="5 31" fill="none"></path>
    </svg>
  </div>
  <div className="firework line bottom">
    <svg viewBox="289 515 290 298">
      <path d="M291.1 810s27.7-55.57 142.94-170.9C549.3 523.77 577 517 577 517" stroke="#FFF" strokeWidth="5" strokeDasharray="5 31" fill="none"></path>
    </svg>
  </div>
</div>
<div className="close-btn-wrapper" onClick={fermer}>
  <div className="close-btn"><span>+</span></div>
</div>
        </div>
    )
}


let content = {
    title:{
        fr:"Nous sommes très honorés de vous compter parmis nous et nous vous remercions infiniment de vous porter volontaire pour donner un coup de main durant cette période difficile",
        ar:"نحن فخورون جدًا بوجودك بيننا ، ونشكرك كثيرًا على تطوعك للمساعدة للسكان  في هذا الوضع الصعب "
    },
    subtitle:{
        fr:"Un responsable va vous contacter dans les plus brefs délais pour confirmer avec vous les informations données afin de finaliser avec vous votre inscription.",
        ar:"سيتصل بك الشخص المسؤول في أقرب وقت ممكن ليؤكد معك المعلومات المقدمة وإنهاء تسجيلك"
    }
}