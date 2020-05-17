import React from 'react'

import {TiSocialLinkedinCircular, TiSocialTwitterCircular, TiSocialInstagramCircular, TiSocialFacebookCircular} from 'react-icons/ti'
import{Col, Row, Container} from 'react-bootstrap'

import LogoPng from './../assets/img/pelia-logo.png'

import MotivationImg from './../assets/img/motivation.jpg'
import MissionImg from './../assets/img/main-croise.jpg'
import debut from './../assets/img/debut.png'

import Ahmed from './../assets/img/ahmed.JPG'
import Adnane from './../assets/img/adnane.JPG'
import Fouzia from './../assets/img/fouzia.JPG'
import Abdou from './../assets/img/abdo.jpg'

import GroupeBanner from './../assets/img/group.JPG'


import Cookies from 'js-cookie'
import BannerSimple from './../components/BannerSimple';

import '../assets/css/style.css'

let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {
    all:{
        direction: 'rtl'
    },
    text:{
        textAlign:'right'
    },
 
}: {

}


export default function About() {

    return (
        <div className="page">
            <BannerSimple title={content.title[lang]} subtitle={content.subtitle[lang]} style={{color:'white'}} banner={GroupeBanner} />
            <Container>
                <Team />
                <Motivation />
                <Mission />
                <How />

        </Container>
        </div>
        

    )
}

function How() {
    return (
        <div id="commencement" className="public-container">
            <h2 style={style.text} >{content.commencement.title[lang]} <span ></span>  </h2>
            <div className="row align-items-center justify-content-center">
            <Col lg={{span: 6}}  className="right-img wow bounceInRight animated">
                    <img className="img1 img-fluid" src={debut} alt="commencement du projet pelia" />
                </Col>
                <Col  lg={6} className="wow bounceInLeft animated left-content">
                    <p style={style.text} className='colorBlack'> {content.commencement.body[lang]} </p>
                </Col>
            </div>
    </div>
    )
}


function Team (){
    return(
        <section id="team">
            
            <Container style={style.all} >
            <div style={style.all} id="about-us" className="public-">
            <div className="row align-items-center justify-content-center">
                <Col style={style.text} lg={{span: 10, offset: 0}}>
                    <div className="wow bounceInRight animated">
                        <h2 className="" id="h2" > {content.who.title[lang]} </h2>
                        <p style={{fontFamily:'Poppins',fontSize:'16px'}}>
                            {content.who.body[0][lang]}
                        </p>
                    </div>
                </Col>
            </div>
        </div>
                
                <Row>
                    {
                        content.equipe.map((membre, index) =>
                        <Col key={index} md="6" lg="6" xs="12" className="wow bounceInLeft animated">
                        <div className="member">
                            <img src={membre.photo} className="img-fluid " alt={membre.nom[lang]} />
                            <div className="member-info">
                                <div className="member-info-content">
                                    <h4>{membre.nom[lang]}</h4>
                                    <span>{membre.specialite[lang]}</span>
                                    <div className="social">
                                        <a href={membre.facebook[lang]}><TiSocialFacebookCircular size="2rem" /></a>
                                        <a href={membre.linkedin[lang]}> <TiSocialLinkedinCircular size="2rem" /></a>
                                        <a href={membre.twitter[lang]}><TiSocialTwitterCircular size="2rem" /></a>
                                        <a href={membre.insta[lang]}><TiSocialInstagramCircular size="2rem" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                        )
                    }
                </Row>
            </Container>
        </section>
    )
}



function Motivation(){
    return(
        <div id="motivation" className="public-container">
            <h2 style={style.text} >{content.motivation.title[lang]} <span ><img src={LogoPng} width="30%" alt="" /></span>  </h2>
            <div className="row align-items-center justify-content-center">
                <Col lg={6}  className="right-img wow bounceInRight animated">
                    <img className="img1 img-fluid" src={MotivationImg} alt="motivation du projet pelia" />
                </Col>
                <Col  lg={6} className="wow bounceInLeft animated left-content">
                    <p style={style.text} className='colorBlack'> {content.motivation.body[lang]} </p>
                </Col>
               
            </div>
        </div>
    )
    
}

function Mission(){
    return(
        <div id="mission" className="public-container">
            <h2 style={style.text} className="bounceInRight wow animated" id="h2">{content.mission.title[lang]}</h2>
            <div className="row align-items-center justify-content-center">
                <Col lg={6} className="right-img wow bounceInLeft animated">
                    <img className="img1 img-fluid" src={MissionImg} alt="la mission du projet pelia" />
                </Col>
                <Col lg={6}>
                        <p style={style.text} className='colorBlack'>{content.mission.body[lang]}</p>
                </Col>
            </div>
        </div>
    )
}


let content = {
    title:{fr:"Qui sommes-nous ?",ar:"من نحن ؟"},
    subtitle:{
        fr:"À Pelia.ma, nous pensons qu'ensemble, nous pouvons dépasser cette période critique.",
        ar:"  نعتقد أنه يمكننا معا تجاوز هذه الفترة الحرجة Pelia.ma في."    
    },
    who:{
        title:{fr:"Une équipe pluridisciplinaire",ar:"فريق متعدد التخصصات"},
        body:[
            {
                fr:"Pelia.ma est une plateforme de téléconsultation, développée par une équipe de 4 personnes. Chaqu'un d'entre nous est issu d'une origine et background différent ce qui donne la force à notre équipe dans tous les domaines nécessaires pour la proposition de solutions parfaitement adaptées à vos besoins et pour faciliter vos tâches de la vie quotidienne.",
                ar:"Pelia.ma هي منصة للإستشارة عن بعد ، من إنشاء فريق من 4 أشخاص. يأتي كل منا من أصل وخلفية مختلفة مما يعطي القوة لفريقنا في جميع المجالات اللازمة لاقتراح حلول مناسبة تمامًا لاحتياجاتك ولتيسير مهامك في الحياة اليومية."
            }
        ]

    },
    motivation:{
        title:{fr:"La motivation qui nous a poussé à créer " ,ar:"الدافع الذي دفعنا إلى إنشاء"},
        body:{
            fr:"En pleine réflexion sur une manière pour contribuer aux efforts faits par l'état et les acteurs dans les domaine de santé, la sureté nationale, le commerce et tout les secteurs publics et afin d'affronter le risque lié à la propagation du virus COVID-19 dans la royaume, nous avons pensé à mettre en place une plateforme qui va permettre aux patients de consulter des médecins depuis leurs maisons.",
            ar:"في خضم التفكير في طريقة للمساهمة في الجهود التي تبذلها الدولة والجهات الفاعلة في المجال الصحي ، الأمن القومي والتجارة وجميع القطاعات العامة. لمواجهة المخاطر المتعلقة بانتشار فيروس COVID-19 في المملكة. لاحظنا أن أغلبية الأطباء إما مغلقة خلال هذه الفترة أو كله مشغول للغاية مع الأشخاص الملوثين. هذا هو السبب في إنشاء هذه المنصة التي ستساعد المرضى على مقابلة أطبائهم."
        }
    },
    mission :{
        title:{fr:"Notre mission" ,ar:"مهمتنا"},
        body:{
            fr:"Notre mission principale est de pouvoir réunir les médecins et leurs patients en même temps et sur la même plateforme pendant cette période d’épidémie et ce, tout en respectant leur vie privée et en veillant sur la sécurité de leurs informations.",
            ar:"مهمتنا الرئيسية هي أن نكون قادرين على الجمع بين الأطباء ومرضاهم في نفس الوقت وعلى نفس المنصة. من خلال إنشاء قناة اتصال بينهما خلال هذه الفترة العصيبة ، من خلال احترام حياتهم الخاصة وضمان أمن معلوماتهم."
        }
    },
    commencement:{
        title:{fr:"Comment tout a commencé" ,ar:"كيف بدأ كل شيء"},
        body:{
            fr:"Lors d'un hackathon organisée au sein de notre école YouCode et qui portait sur des sujets sociaux, nous avons eu l'idée de travailler sur un projet qui vise à aider les gens atteints d'alzheimer et notamment en ce qui concerne la prise de médicaments. Après, on a participé avec ce projet dans plusieurs événements et depuis on n'a pas arrêté de l'améliorer et de l'adapter aux besoins de notre royaume, jusqu'à ce qu'on soit arrivé à une plateforme dédiée à lier les patients avec leurs médecins tout en faisant la gestion de leurs médicaments, en les rappelant des temps de prise de ces derniers, ainsi que beaucoup d'autres fonctionnalités. Maintenant et compte tenu de cette periode dure, on a pensé à adapter notre plateforme pour qu'elle puisse contribuer à l'aide de notre pays dans sa mission à arrêter la propagation du virus COVID-19.",
            ar:"خلال هاكاثون تم تنظيمه في مدرسة YouCode التي تركز على الموضوعات الاجتماعية. كانت لدينا فكرة مساعدة الناس المصابين بالزهيمر, لإدارة أدويتهم من أجل الحصول على الاستقلال والحرية. بعد أن شاركنا بهذه الفكرة في العديد من الأحداث وبما أننا لم نتوقف عن تحسينها وتكييفها مع احتياجات مملكتنا ، حتى وصلنا إلى منصة مخصصة تجمع المرضى مع أطبائهم, وكدلك إدارة أدويتهم ، وتذكيرهم بأوقات تناولها وأشياء أخرى كثيرة. الآن وبالنظر إلى هذه الفترة العصيبة ، فكرنا في تكييف برنامجنا بحيث يمكنهم المساهمة في مساعدة الدولة في مهامهم الهادفة لوقف انتشار وباء كورنا المستجد."
        }
    },
    equipe: [
    {
        photo: Abdou,
        nom: {fr:"Abderrhmane EL FILALI", ar:"عبد الرحمان الفيلالي"},
        specialite:{fr: "Développeur mobile", ar:"مطور ويب"},
        facebook:"#",
        linkedin:"#",
        twitter:"#",
        insta:"#"
    },{
        photo: Ahmed,
        nom: {fr: "Ahmed KHACHIA ERRAHMAN", ar:"احمد خاشع الرحمن"},
        specialite:{fr: "Responsable Marketing", ar:""},
        facebook:"#",
        linkedin:"#",
        twitter:"#",
        insta:"#"
    },{
        photo: Fouzia,
        nom: {fr: "Fouzia BALIBLA", ar:"فوزية بليبلة"},
        specialite:{fr: "Community manager", ar:""},
        facebook:"#",
        linkedin:"#",
        twitter:"#",
        insta:"#"
    },{
        photo: Adnane,
        nom: {fr: "Adnane ROUHI" , ar:"عدنان الروحي"},
        specialite:{fr: "Expert en électronique", ar:""},
        facebook:"#",
        linkedin:"#",
        twitter:"#",
        insta:"#"
    },
]   }


