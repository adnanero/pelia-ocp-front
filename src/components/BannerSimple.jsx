import React from 'react'


import{Row, Container} from 'react-bootstrap'

export default function BannerSimple(props) {
    return(
        <div className="" style={{backgroundImage:`url(${props.banner})` , backgroundSize: "cover", verticalAlign: "middle", backgroundRepeat:"no-repeat", backgroundPosition: "center center"}}> 
        <div className="" style={{padding:"80px 0px 80px 0px", background: "linear-gradient(to right, rgba(5, 117, 230, .7), rgba(3, 141, 254, .9))"}}>
            <Container>
                <Row>
                    <div className="home-info banner-simple" style={{ padding: "4rem 2rem"}}>
                            <h1 data-wow-duration="700ms" data-wow-delay="200ms" 
                                className="wow bounceInDown animated" 
                                style={props.style}
                            >
                            {props.title} 
                            </h1>
                            <h2 data-wow-duration="700ms" data-wow-delay="500ms" 
                                className="wow bounceInUp animated"  style={props.style}>
                                    {props.subtitle} 
                            </h2>
                    </div>
                </Row>
            </Container>
        </div>
    </div>
    )
}

