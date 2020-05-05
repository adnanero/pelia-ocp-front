import React from 'react'

import{Col, Container} from 'react-bootstrap'

import BannerSimple from './../components/BannerSimple';

import {TiMessages} from 'react-icons/ti'
import {IoIosTimer} from 'react-icons/io'
import {FaRegQuestionCircle} from 'react-icons/fa'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import MedecinBanner from './../assets/img/rencontreMedecin.jpg'
import Pray from './../assets/img/pray.png'
import confinement from './../assets/img/confinement.jpg'
import '../assets/css/style.css'
import Cookies from 'js-cookie'

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
    paragrapges:{
        fontSize:"16px"
    }

}
export default function medecin() {
    return (
        <div className="page">
            <BannerSimple title={content.title[lang]} banner={MedecinBanner} subtitle={content.subtitle[lang]} style={{color:'white'}} />
            <Container>
                <What />
                <Demande />
                <Comment />
            </Container>
        </div>
    )
}

function What(){
    return(
        <div id="motivation" className="public-container" >
            <h2 style={style.text} >{content.what.title[lang]} </h2>
            <div style={style.all} className="row align-items-center justify-content-center">
                <Col lg={6}  className="right-img wow bounceInRight animated">
                    <img className="img1 img-fluid" src={confinement} alt="notre motivation" />
                </Col>
                <Col  lg={6} className="wow bounceInLeft animated left-content">
                    <article style={style.text}>
                    {content.what.body[lang]} 
                    </article>
                </Col>
            </div>
        </div>
    )
    
}


function Demande(){
    return(
        <div id="demande" className="public-container">
            <h2 style={style.text} className="bounceInRight wow animated" id="h2">{content.demande.title[lang]}</h2>
            <div style={style.all} className="row align-items-center justify-content-center">
                <Col lg={6} className="right-img wow bounceInLeft animated">
                    <img className="img1 img-fluid" src={Pray} alt="notr mission" />
                </Col>
                <Col lg={6}>
                    <article style={style.text} >{content.demande.body[lang]}</article>
                </Col>
            </div>
    </div>
    )
    
}

export function Comment(){
    return(
        <div id="comment" className="public-container">
            <div className="row align-items-center justify-content-center">
                <h2 className="bounceInRight wow animated mx-4" id="h2" style={style}>{content.comment.title[lang]} </h2>
                        <VerticalTimeline>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)' } }
                                contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}
                                date={content.comment.body.card1.date[lang]}
                                iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                                icon={<FaRegQuestionCircle />}
                            >
                                <h3 style={style.text} className="vertical-timeline-element-title">{content.comment.body.card1.title[lang]}</h3>
                                <p style={style.text} className='colorBlack'>  {content.comment.body.card1.body[lang]} </p>
                            </VerticalTimelineElement>

                            <VerticalTimelineElement
                                className="vertical-timeline-element--education"
                                date={content.comment.body.card2.date[lang]}
                                contentStyle={{ background: '#fff', color: '#000', borderTop:'2px solid #00F260' }}
                                contentArrowStyle={{ borderRight: '7px solid  #00F260' }}

                                iconStyle={{ background: '#00F260', color: '#fff' }}
                                icon={<IoIosTimer />}
                            >
                                <h3 style={style.text} className="vertical-timeline-element-title">{content.comment.body.card2.title[lang]}</h3>
                                <p style={style.text} className='colorBlack'>{content.comment.body.card2.body[lang]}</p>
                            </VerticalTimelineElement>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: '#fff', color: '#000', borderTop: '2px solid rgba(54,149,235,1)'  }}
                                contentArrowStyle={{ borderRight: '7px solid  rgba(54,149,235,1)' }}   
                                 date={content.comment.body.card3.date[lang]}
                                iconStyle={{ background: 'rgba(54,149,235,1)', color: '#fff' }}
                                icon={<TiMessages />}
                            >
                                <h3 style={style.text} className="vertical-timeline-element-title">{content.comment.body.card3.title[lang]}</h3>
                                <p style={style.text} className='colorBlack'>{content.comment.body.card3.body[lang]}</p>
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





let content = {
    title:{fr:"Bienvenue chers médecins. On a encore plus besoin de vous en cette période. Merci pour votre aide",ar:"نرحب الأطباء الأعزاء. نحتاجك أكثر خلال هذا الوقت"},
    subtitle:{fr:"Ici on vous propose l'opportunité d'aider des milliers de gens durant cette quarantaine.", ar:"هنا نقدم لك الفرصة لمساعدة آلاف الأشخاص خلال هذا الحجر الصحي"},
    what:{
        title:{fr:"La quarantaine pose de nombreux problèmes " ,ar:"الحجر الصحي يطرح العديد من المشاكل"},
        body:{
            fr:[
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={0}>Au mépris des mesures de limitation de la propagation du virus Covid-19, le gouvernement marocain a pris des dispositions en interdisant tout regroupement ainsi que la fermeture de nombreux commerces afin de limiter la circulation des personnes et freiner la propagation de l'épidémie.</p>, 
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={1}>Cela a conduit à de nombreuses difficultés pour les gens de trouver ou de consulter un médecin pour obtenir des conseils médicaux, sachant qu'au cours de la même période, le désir de ces personnes de parler à leurs médecins a augmenté en raison de leur grande crainte sur leur santé.</p>,
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={2}>Pour remédier à ces problèmes, le Ministère de la Santé a attribué un service supplémentaire pour communiquer et fournir des informations sur la maladie de Covid-19. Il est lié au service médical d'urgence «allo SAMU 141», en plus du service «allo Epidemic Alert» 080 100 47 47, qui était auparavant activé au niveau du Centre National des opérations d'urgences de Santé Publique.</p>,
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={3}>Le lancement de ce service intervient après une pression croissante sur le centre d'appels pour le service d'alerte épidémique, mais le problème est que ces deux services ne peuvent pas répondre à tous les besoins des citoyens. Ils atteignent donc des milliers d'appels par jour.</p>
        ],
            ar: [
                <p key={0}> في ضل تفشي وباء كورونا قررت الحكومة المغربية حظر التجوال وغلق العديد من المحلات بما في دلك بعض العيادات و المستوصفات للحد من حركة الناس و كبح انتشار الوباء. مما ادى لصعوبات عديدة في اجاد او الوصول لطبيب من اجل استشارة طبية من طرف الساكنة علما انه في نفس هته الفترة تزايدة رغبات هؤلاء على التكلم مع اطبائهم اثر خوفهم الكبير على صحتهم.</p>,
                <p key={1}> لعلاج هذه المشاكل قامت وزارة الصحة بتخصيص خدمة إضافية للتواصل وتقديم معلومات حول مرض كوفيد-19. يتعلق الأمر بخدمة 
                 "ألو 141 للمساعدة الطبية الاستعجالية" ( Allô SAMU 141) وذلك إلى جانب خدمة "ألو اليقظة الوبائية 080 100 47 47" التي تم تفعيلها سابقا على مستوى المركز الوطني لعمليات طوارئ الصحة العامة.</p>,
                 <p key={2}> ويأتي إطلاق هذه الخدمة بعد تزايد الضغط على مركز النداء الخاص بخدمة ألو اليقظة الوبائية، لاكن المشكل هو انه هاتان الخدمتان لا يمكنهما تلبية كل حاجيات المواطنينبحيت تصل الاف التصلات في كل ساعة.</p>
        ]
        }
    },
    demande:{
        title:{
            fr:"Qu'est ce que vous pouvez faire en tant que médecin ?", 
            ar:"ماذا يمكنك ان تفعل كطبيب"
        },
        body:{
            fr:[
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={0}>Dans les mêmes orientations du Ministère de la Santé en particulier et de l'État en général, le groupe Pelia a décidé de donner aux médecins la possibilité d'aider le Ministère dans ses tâches en répondant aux questions des citoyens et en prenant soin de leur santé, et cela à travers l'application whatsapp. Ce qui rend cette fonctionnalité facile à utiliser par tous les médecins grâce à l'adaptation de chacun avec cette méthode. </p>
            ],
            ar:[
                <p style={{fontSize: "16px",fontFamily:'Poppins'}} key={0}>في نفس توجهات وزارة الصحة بصفة خاصة  و الدولة بصفة عامة قررت مجموعة Pelia منح الاطباء الفرصة  لمساعدة الوزارة في مهامها بالاجابة على اسئلة المواطنين و الاعتناء بصحتهم و الكشف على المريض لتشخيص المرض عن بعد باستخدام تطبيق الواتسابكوسيلة تواصل بينه وبين المريض مما يجعل هذه الميزة سهلة الاستعمال من طرف جميع الاطباء لتناسب الجميع مع هذه الوسيلة.</p>
            ]
        }
    },
    comment:{
        title:{fr:"Téléconsultation : comment ça marche ? " ,ar:"تقديم استشارة عن بعد : كيف تعمل ؟"},
        body:{
            card1:{
                title:{fr:"Inscription et confirmation" ,ar:"التسجيل والتأكيد"}, 
                date:{fr:"Première étape", ar:"المرحلة الأولى"},
                body :{
                    // Après avoir reçu le lien d'inscription de la part de votre administration vous devez remplir tous les champs du formulaire puis attendez la confirmation de votre compte
                    fr:"Entrez à la page d'inscription à partir du bouton \"nous rejoindre\" en haut et remplissez tous les champs du formulaire puis attendez la confirmation." ,
                     ar:"ادخل صفحة التسجيل من الزر انضم إلينا في الأعلى واملأ جميع حقول النماذج ثم انتظر التأكيد مع موظفينا"
                }
            },
            card2:{
                title:{fr:"Une entrée à la session Pelia" ,ar:"WhatsApp على Pelia دخول إلى جلسة"},
                date:{fr:"Deuxième étape", ar:"الخطوة الثانية"},
                 body :{
                     fr:"Après avoir été accepté, vous aurez l'accès à la session des médecins où vous allez répondre aux questions des patients et diagnostiquer leurs états. Quand vous terminer votre discussion avec un patient, vous serez invités à terminer la consultation en clôturant le ticket ouvert pour passer à la prochaine consultation." ,
                  ar:"بعد قبولك ، ستتمكن من الوصول إلى جلسة الأطباء على واتس اب حيث ستجيب على أسئلة المرضى وتشخص حالتهم. عند إنهاء مناقشتك مع مريض ، سيُطلب منك التحدث مع مريض آخر إذا كان هناك أي مريض ينتظر. لديك الحق في المغادرة في أي وقت "
                }
                },
            card3:{
                title:{fr:"Soyez en contact", ar:"تواصل مع مريضك"}, 
                date:{fr:"Troisième étape", ar:"الخطوة الثالثة"},
                body :{
                    fr:"Maintenant, vous êtes avec votre patient. Diagnostiquer son état comme s'il était devant vous, lui prescrire des médicaments si nécessaire." ,
                    ar:"أنت الآن مع مريضك. قم بتشخيص حالته كما لو كانت أمامك ، ووصف الدواء إذا لزم الأمر." 
                }
            }
        }
    }
}


