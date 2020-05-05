import React,{useState} from 'react';


import BannerAnim from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';

import PeliaBanner from './../assets/img/pelia_banner.jpg'

import Cookies from 'js-cookie'


let lang = Cookies.get('lang')
lang = (lang === undefined)? "fr" : lang


const { Element } = BannerAnim;
const BgElement = Element.BgElement;
export default function Banner() {
  const [isOpen, setIsopen] = useState(false)

  return (
      <div className="home">
 <BannerAnim
      autoPlay
      type="across"
      sync={true}
      autoPlaySpeed={10000}
      autoPlayEffect={false}
    children={VideoShow}
    >
      <Element key="aaa"
        prefixCls="banner-user-elem"
      >
        <BgElement
          key="bg"
          className="bg"
          style={{
            backgroundImage: `url(${PeliaBanner})`,
            backgroundSize: 'cover',
          }}
        />
       <div className="overlay-banner"></div>
        <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
        <VideoShow elm = {0} isOpen={isOpen} setIsopen={setIsopen} />
        </TweenOne>
      </Element>
      <Element key="bbb"
        prefixCls="banner-user-elem"
      >
        <BgElement
          key="bg"
          className="bg"
          style={{
            backgroundImage: `url(${PeliaBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
       <div className="overlay-banner"></div>
        <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
        <VideoShow elm = {1} isOpen={isOpen} setIsopen={setIsopen} />
        </TweenOne>

      </Element>
      <Element key="ccc"
        prefixCls="banner-user-elem"
      >
        <BgElement
          key="bg"
          className="bg"
          style={{
            backgroundImage: `url(${PeliaBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="overlay-banner"></div>
        <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
        <VideoShow elm = {2} isOpen={isOpen} setIsopen={setIsopen} />
        </TweenOne>
      </Element>
      
    </BannerAnim>
      </div>
   
  );
}
function VideoShow(props) {
    return(
        <div className="container" style={{marginTop:"11%"}}>
        <div className="row">

              <div className="home-info mt-5">
                    <h1 data-wow-duration="700ms" data-wow-delay="500ms" 
                        className="wow bounceInDown animated" 
                        style={{color:'white'}}
                    >
                      <span className="bannerPelia mb-2" style={{fontFamily:'Pacifico',fontSize:'60px'}} >Pelia</span>
                      {content.title[props.elm][lang]}
                    </h1>
              </div>
        </div>
    </div>
    )
    
}
const content ={
    title : [
        {
        ar: " تمنحك فرصة الاتصال بطبيب من المنزل" , 
        fr:" vous donne la possibilité de communiquer avec un médecin depuis chez vous"
    },{
        ar: "لمساعدتك على عدم مغادرة منزلك لرؤية طبيبك" , 
        fr:" pour vous aider à ne pas quitter votre domicile pour voir votre médecin"
    },{
        ar: " تقديم المشورة لك وتجعلك على دراية بمرضك" ,
        fr:" vous conseille et vous sensibilise à propos de votre maladie"
    }
],
    button: {ar:"ابدأ المغامرة", fr:"Commencer"},
    video:{ar: "شاهد الفيديو التوضيحي", fr:"Regarder la vidéo descriptive"},
    amuser:{ar:"مشاهدة ممتعة", fr:"Vision agréable !"}
}
