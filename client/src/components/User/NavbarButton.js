import {React,useState,useEffect} from "react";
import {motion,useAnimation} from "framer-motion";


const NavbarButton = (props)=>{

    const imgSrc = props.imgSrc;
    const text = props.text;
    const clicked = props.clicked;
    const [ishovered,setHover] = useState(false);
    const animateDiv = useAnimation();
    const animateText = useAnimation();
    const animateImg = useAnimation();
    useEffect(()=>{
        if (ishovered || clicked === text) {

            animateDiv.start({
                x:"flex-start",
                backgroundColor: "#ED474A",  
                width: "100%"            
            });

            animateImg.start({
                backgroundColor:"#ED474A",
                padding:"0px 0xp 0px 0px",
            });

            animateText.start({
                display:'block',
                x:"flex-start"
            });

            if(clicked === text){
                animateDiv.start({
                    x:"flex-start",
                    borderLeft:"1px solid white",
                    backgroundColor: "#ED474A",
                    width: "100%"
                });

                animateImg.start({
                    backgroundColor:"#ED474A",
                    padding:"0px 0xp 0px 0px",
                });
    
                animateText.start({
                    display:'block',
                    x:"flex-start"
                });
            }
            
        }

        else{
            animateDiv.start({
                x:0,
                borderLeft:"0px solid white",
                backgroundColor: "#353535"
            });

            animateText.start({
                display:'none',
                x:0
            });

            animateImg.start({
                backgroundColor:"#555555",
                padding:"5px 5px 5px 5px",
            });
        }
    },[ishovered,clicked]);

    return (
        <>
             <motion.div className = "navbar_button_container"
                        onMouseEnter={()=>{
                            setHover(true);
                        }}
                        onMouseLeave={()=>{
                            setHover(false);
                        }}

                        animate = {animateDiv}
                    > 
                        <motion.img src={imgSrc} alt=""
                            animate = {animateImg}
                        />
                        <motion.div className = "navbar_button_name"
                            animate = {animateText}
                        >{text}
                        </motion.div> 
                    </motion.div>
        </>
    );
}

export default NavbarButton