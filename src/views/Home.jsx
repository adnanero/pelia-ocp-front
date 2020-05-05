import React from 'react'

import Banner from './../components/Banner'
import{Col, Container, Row} from 'react-bootstrap'

import Cookies from 'js-cookie'

import {TiMessages} from 'react-icons/ti'
import {IoIosTimer} from 'react-icons/io'
import {FaRegQuestionCircle} from 'react-icons/fa'

import Telemecine from './../assets/img/telemedicine.png'

import LogoPng from './../assets/img/pelia-logo.png'
import PeliaBanner from './../assets/img/pelia_banner.jpg'


import productFeature from './../assets/img/product-features.png'
import coronavirus from './../assets/img/computer-virus.png'
import infectation from './../assets/img/infections_courantes.png'
import digestion from './../assets/img/digestion.png'
import grossesse from './../assets/img/grossesse.png'
import '../assets/css/style.css';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';





let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang

let style = (lang === "ar")? {
    float: 'right',
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
                    <p className='colorBlack' style={style}>{HomeContent.quoi.body[lang]} </p>
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
                                <p style={style}className='colorBlack' >  {HomeContent.comment.body.card1.body[lang]} </p>
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
                                <p style={style} className='colorBlack' >{HomeContent.comment.body.card2.body[lang]}</p>
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
                                <p style={style} className='colorBlack'>{HomeContent.comment.body.card3.body[lang]}</p>
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
                {/* <Row className="my-5 ">
                    <div className="call-to-action home-info">
                    <Link data-wow-duration="500ms" data-wow-delay="200ms" to="/login" className="btn inscription-btn smoothScroll wow slideInUp animated"> <span> {HomeContent.objectifs.button[lang]} </span> </Link>

                    </div>
                </Row> */}
        </div>
    </section>
    )
}


let HomeContent = {
    quoi :{
        title:{fr:"Qu'est-ce que c'est ? " ,ar:"ما هذا ؟"},
        body:{
            fr:"Pelia est une plateforme de téléconsultation médicale où vous pouvez rencontrer un médecin pour avoir une réponse, un conseil, un avis et un diagnostic médical si nécessaire, à portée de clic et sans avoir à se déplacer.",
            ar:"هي منصة للاستشارات الطبية عن بعد. حيث يمكنك مقابلة الطبيب للحصول على استجابة ونصيحة ونصيحة وتشخيص طبي إذا لزم الأمر ، بنقرة واحدة فقط دون الحاجة إلى السفر."
        }
    },
    comment:{
        title:{fr:"Téléconsultation : comment ça marche ? " ,ar:"الاستشارة من المنزل: كيف تعمل؟"},
        body:{
            card1:{
                title:{fr:"Demander consultation" ,ar:"طلب استشارة"}, 
                date:{fr:"Première étape", ar:"المرحلة الأولى"},
                body :{
                    fr:"Vous voulez savoir plus sur Pelia?  Comment en bénéficier ? Vous avez besoin de nous poser une question? Le numéro de téléphone 0662495329 est mis à votre disposition." ,
                     ar:"هل تريد معرفة المزيد عن Pelia؟ كيف تستفيد منه؟ هل تريد أن تسألنا سؤالاً؟ رقم الهاتف 0662495329  متاح لك."
                }
            },
            card2:{
                title:{fr:"Attendez votre tour" ,ar:"انتظر دورك"},
                date:{fr:"Deuxième étape", ar:"الخطوة الثانية"},
                 body :{
                     fr:"Après avoir envoyé un message Whatsapp vers ce numéro '0662495329', vous recevrez un message qui vous donne toutes les villes disponibles, après que vous choissiserez votre ville, notre système vous mettra sur la liste d'attente lorsque tous les patients devant vous termineront leurs consultations et qu'un médecin deviendra libre. A ce moment, vous serez avertis pour entrer en contact avec le médecin." ,
                  ar:"بعد إرسالك لرسالة نصية. سيضعك نظامنا في قائمة الانتظار عندما يرحل جميع المرضى أمامك ويصبح الطبيب مجانيًا ، سيتم إبلاغك"
                }
                },
            card3:{
                title:{fr:"Contactez-nous", ar:"تواصل معنا"}, 
                date:{fr:"Troisième étape", ar:"الخطوة الثالثة"},
                body :{
                    fr:"Maintenant, vous êtes en consultation avec votre médecin. C'est à vous de jouer. Vous devez expliquer au médecin la raison pour laquelle vous l'avez contacter. Le medecin va faire de son mieux pour répondre à vos questions." ,
                    ar:"وانتهى الأمر الآن مع طبيبك. الأمر متروك لك الآن ، يجب أن تشرح للأطباء سبب رغبتك في الاتصال به وسيبذل الطبيب قصارى جهده للإجابة على أسئلتك" 
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
