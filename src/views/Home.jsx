import React from 'react'

import Banner from './../components/Banner'
import{Col, Container, Row} from 'react-bootstrap'

import Cookies from 'js-cookie'

import {TiMessages} from 'react-icons/ti'
import {IoIosTimer} from 'react-icons/io'
import {FaRegQuestionCircle} from 'react-icons/fa'

import Telemecine from './../assets/img/telemedicine.png'

import LogoPng from './../assets/img/pelia_logo.png'
import PeliaBanner from './../assets/img/pelia_banner.svg'


import productFeature from './../assets/img/product-features.png'
import coronavirus from './../assets/img/computer-virus.png'
import infectation from './../assets/img/infections_courantes.png'
import digestion from './../assets/img/digestion.png'
import grossesse from './../assets/img/grossesse.png'
import '../assets/css/style.css';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import {Link } from 'react-router-dom'



let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {
    direction: 'rtl'  /* Right to Left */,
    textAlign:'right',
    

}: {

}
export default function Home() {

    return (
        <div className="page">
        <Banner />
            <Container className="mt-5"> 
                <Quois />
                <Comment />
            </Container>
            <Objectifs />
        </div>
    )
}

function Quois(){
    return(
        <div id="qouis" className="public-container">
            <h2 style={style} className="bounceInRight wow animated" id="h2"> {HomeContent.quoi.title[lang]}</h2>
            <div className="row align-items-center justify-content-center">
                <Col lg={6} className="right-img wow bounceInLeft animated">
                    <img className="img1 img-fluid" src={Telemecine} alt="" />
                </Col>
                <Col lg={ {span: 5, offset: 1}}>
	    		<div dangerouslySetInnerHTML={{__html:HomeContent.quoi.body[lang]}}></div>
                </Col>
            </div>
        </div>
    )
}


function Comment(){
    return(
        <div id="comment" className="public-container">
            <div className="row align-items-center justify-content-center">
                <h2 className="bounceInRight wow animated mx-4" style={style}>{HomeContent.comment.title[lang]} </h2>
                        <VerticalTimeline>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)' } }
                                contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}
                                date={HomeContent.comment.body.card1.date[lang]}
                                iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                                icon={<FaRegQuestionCircle />}
                            >
                                <h3 style={style} className="vertical-timeline-element-title">{HomeContent.comment.body.card1.title[lang]}</h3>
                                <p dangerouslySetInnerHTML={{__html:HomeContent.comment.body.card1.body[lang]}} style={style}className='colorBlack'></p>
                            </VerticalTimelineElement>

                            <VerticalTimelineElement
                                className="vertical-timeline-element--education"
                                date={HomeContent.comment.body.card2.date[lang]}
                                contentStyle={{ background: '#fff', color: '#000', borderTop:'2px solid #00F260' }}
                                contentArrowStyle={{ borderRight: '7px solid  #00F260' }}

                                iconStyle={{ background: '#00F260', color: '#fff' }}
                                icon={<IoIosTimer />}
                            >
                                <h3 style={style} className="vertical-timeline-element-title">{HomeContent.comment.body.card2.title[lang]}</h3>
                                <p dangerouslySetInnerHTML={{__html:HomeContent.comment.body.card2.body[lang]}} style={style}className='colorBlack'></p>
                            </VerticalTimelineElement>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)'  }}
                                contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}   
                                 date={HomeContent.comment.body.card3.date[lang]}
                                iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                                icon={<TiMessages />}
                            >
                                <h3 style={style} className="vertical-timeline-element-title">{HomeContent.comment.body.card3.title[lang]}</h3>
                                <p dangerouslySetInnerHTML={{__html:HomeContent.comment.body.card3.body[lang]}} style={style}className='colorBlack'></p>
                            </VerticalTimelineElement>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}
                                iconStyle={{ background: '#00F260', color: '#fff' }}
                                icon={<TiMessages />}
                            >
                            
                            </VerticalTimelineElement>
                            
                            </VerticalTimeline>
                           
                </div>
        </div>
    )
}



function Objectifs (){
    
    return(
        <section id="objectif">
            <div className="section-header wow fadeIn" data-wow-duration="700ms" data-wow-delay="500ms">
                <h2 className="section-title wow bounceIn animated">
                    {HomeContent.objectifs.title[lang]} 
                    <span id=""><img src={LogoPng} width="8%" alt="" /></span>
                </h2>
                <span className="section-divider"></span>
            </div>
            <div id="features" style={{background: `url(${PeliaBanner}) no-repeat center center`, backgroundSize:"cover"}}>
            <div className="overlay-banner"></div>
                <Row className="mx-5 justify-content-around w-100" >
                    <Col lg="4" md="2" className="features-img">
                        <img src={productFeature} alt="" className="wow fadeInLeft" />
                    </Col>
                    <Col lg="8" md="10" className="">
                        <Row>{
                                HomeContent.objectifs.body.map((feature,index) =>
                                <Col key={index} lg="6" md="12" className="wow fadeIn animated mt-4"  data-wow-delay={ index * 100 + 250 +"ms"}>
                                    <div className="box">
                                        <div className="icon d-flex justify-content-center">
                                            <img  src={feature.image} alt={feature.title[lang]} />
                                        </div>
                                        <h3 className="title ">{feature.title[lang]}</h3>
                                        <ul className="">{
                                                feature.liste.map((e, index) =>
                                                <li key={index}>{e[lang]}</li>
                                                )
                                            }</ul>
                                    </div>
                            </Col>
                             )
                        }</Row>
                    </Col>
                </Row>
                <Row className="my-5 ">
                    <div className="call-to-action home-info">
                    <Link data-wow-duration="500ms" data-wow-delay="200ms" to="/consultation" className="btn inscription-btn smoothScroll wow slideInUp animated"> <span> {HomeContent.objectifs.button[lang]} </span> </Link>

                    </div>
                </Row> 
        </div>
    </section>
    )
}


let HomeContent = {
    quoi :{
        title:{fr:"Qu'est-ce que c'est ? " ,ar:"ما هذا ؟"},
        body:{
            fr:"<p>Pelia.ma est une plateforme de téléconsultation médicale où vous pouvez rencontrer un médecin pour avoir une réponse, un conseil, un avis et un diagnostic médical si nécessaire, à portée de clic et sans avoir à se déplacer</p>",
            ar:"هي منصة للاستشارات الطبية عن بعد. حيث يمكنك مقابلة الطبيب للحصول على استجابة ونصيحة ونصيحة وتشخيص طبي إذا لزم الأمر ، بنقرة واحدة فقط دون الحاجة إلى التنقل."
        }
    },
    comment:{
        title:{fr:"Téléconsultation : comment ça marche ? " ,ar:"الاستشارة من المنزل: كيف تعمل؟"},
        body:{
            card1:{
                title:{fr:"Demander consultation" ,ar:"طلب استشارة طبية"}, 
                date:{fr:"Première étape", ar:"المرحلة الأولى"},
                body :{
                    fr:"<p>1- Cliquez sur <a href='/consultation'>consultation</a> <br></br>2- Choisissez le site dans lequel vous êtes présents<br></br> 3- Choisissez le médecin disponible</p>" ,
                     ar:"<p className='mt-5'>1- أولا تضغط على<a href='/consultation'> استشارة طبية</a><br> </br> 2- اختر الموقع الذي تتواجد فيه<br> </br> 3- اختر الطبيب المتاح</p>"
                }
            },
            card2:{
                title:{fr:"Attendez votre tour" ,ar:"انتظر دورك"},
                date:{fr:"Deuxième étape", ar:"الخطوة الثانية"},
                 body :{
			        fr:"<p>Vous êtes ajoutés à la file d'attente du médecin disponible. Une fois votre tour viendra, vous serez en contact avec lui.</p>" ,
                    ar:"<p>تمت إضافتك إلى قائمة انتظار طبيبك, بمجرد أن يأتي دورك, سوف تكون على اتصال معه</p>"
                }
                },
            card3:{
                title:{fr:"Démarrer une consultation", ar:"إبدأاستشارتك"}, 
                date:{fr:"Troisième étape", ar:"الخطوة الثالثة"},
                body :{
                    fr:"<p>Vous allez commencer la consultation avec le médecin. Bonne consultation.</p>" ,
                    ar:"<p>ستبدأ الإستشارة مع الطبيب, أتمنى لك استشارة جيدة.</p>" 
                }
            }
        }
    },
   
    objectifs:{
        title:{fr:"Quelles sont les raisons d'utiliser",ar:"ماهي أسباب للاستخدام"},
        button: {ar:"ابدأ المغامرة", fr:"Commencer"},
        body:[
            {
                image: coronavirus,
                title:{fr:"Symptômes du virus Corona", ar:"اعراض فيروس كورونا"}, 
                liste:[
                    {fr:"Troubles digestifs", ar:"مشاكل في الجهاز الهضمي"},
                    {fr:"Toux (toux sèche irritante)", ar:"سعال (سعال جاف مهيج)"},
                    {fr:"Maux de gorge", ar:"إلتهاب الحلق"},
                    {fr:"Insuffisance respiratoire", ar:"صعوبة التنفس"},
                    {fr:"Fièvre, sensation de fièvre", ar:"حمى ، شعور بالحمى"}
                ]
            },
            {
                image: infectation,
                title:{fr:"INFECTIONS COURANTES", ar:"الالتهابات الشائعة"},
                liste:[
                    {fr:"Conjonctivite", ar:"التهاب الملتحمة"},
                    {fr:"Infection urinaire", ar:"عدوى بولية"},
                    {fr:"Rhume et syndrome grippal", ar:"متلازمة نزلات البرد والانفلونزا"},
                    {fr:"Signes évocateurs d’allergie", ar:"علامات الحساسية"}
                ]
            },
            {
                image: digestion,
                title:{fr:"PROBLÈMES DIGESTIFS", ar:"مشاكل الجهاز الهضمي"},
                liste:[
                    {fr:"Constipation", ar:"الإمساك"},
                    {fr:"Diarrhée ou vomissements", ar:"الإسهال أو القيء"},
                    {fr:"Douleur abdominale", ar:"آلام البطن"},
                    {fr:"Brûlures d’estomac et reflux", ar:"الحموضة المعوية والارتجاع"}
                ]
            },
            {
                image: grossesse,
                title:{fr:"La periode de grossesse", ar:"فترة الحمل"},
                liste:[
                    {fr:"Découverte de grossesse", ar:"اكتشاف الحمل"},
                    {fr:"Conseils pour l’allaitement", ar:"نصائح للرضاعة الطبيعية"}
                ]
            }
            
        ]
    }
        
}
