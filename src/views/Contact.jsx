import React from 'react'

import ContactForm from './../components/contact'
import BannerSimple from './../components/BannerSimple';

import ContactBanner from './../assets/img/contact.png'

import Cookies from 'js-cookie'

let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang



export default function Contact() {

    return (
        <div className="page">
            <BannerSimple title={content.title[lang]} subtitle={content.subtitle[lang]} style={{color:'white'}} banner={ContactBanner} />
            <ContactForm />
        </div>
    )
}

let content = {
    title:{fr:"Contactez-nous",ar:"اتصل بنا"},
    subtitle:{fr:"Que vous ayez une question sur les fonctionnalités, les essais, la tarification, le besoin d'une démo ou toute autre chose, notre équipe est prête à répondre à toutes vos questions", 
        ar:"سواء كان لديك سؤال حول الميزات أو التجارب أو الأسعار أو تحتاج إلى عرض توضيحي أو أي شيء آخر ، فإن فريقنا على استعداد للإجابة على جميع أسئلتك"}
}
