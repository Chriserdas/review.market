import axios from "axios";
import {React,useState} from "react";

const AdminPanel = ()=>{
    const [clicked,setClicked] = useState("Upload");

    const [hovered,setHovered] = useState(null);
    const [selected,setSelected] = useState("Choose Data");
    const [file, setFile] = useState({
        name:'Choose File',
        file:null
    });
    const [clickSelected,setClickedSelected] = useState(false);

    const handleFileChange = (event)=>{
        
        if(event.target.files.length!==0){
            setFile({
                name:event.target.files[0].name,
                file:event.target.files[0]
            });
        }
    }

    const handleUpload = ()=>{
        if(file.file !==null && selected !== 'Choose Data'){
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('selected', selected);
            // Handle upload file 
            axios.post('http://localhost:5000/uploadData',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log(response)
            });
             
            
        }
    }

    let content;

    if(clicked === "Upload") {
        content = 
            <div className="adminContentContainer">
                <div className="choose_type">
                    <div className="choose_container">
                        <div className="choose_category_title"  onClick={()=>{setClickedSelected(!clickSelected)}}>{selected}</div>
                        <div 
                            className="categories" 
                            style={{
                                display: clickSelected===true ? "flex" : "none",
                                flexDirection:clickSelected===true ? "column" : "",
                                alignItems: clickSelected===true ? "center" : "",
                                justifyContent: clickSelected===true ? "flex-start" : "",
                            }}
                        >
                            {["Products","Categories","Supermarkets"].map((result,index) =>(
                                <div 
                                    key={index}
                                    className="category" 
                                    onClick={()=>{
                                        setClickedSelected(!clickSelected)
                                        setSelected(result)}}
                                >{result}</div>
                            ))
                            }
                            
                        </div>
                    </div>
                    <label htmlFor="file"> {file.name}
                        <input id="file" type="file" onChange={handleFileChange}/>
                    </label>
                    
                </div>
                <div className="up_container">
                    <div 
                        style={{backgroundColor: 'rgb(16, 175, 16)'}}
                        onClick={()=>{handleUpload()}}
                    >Upload</div>

                    <div 
                        style={{backgroundColor:'red'}}

                    >Delete All</div>
                </div>
            </div>
    }

    return (
        <div className="adminPanel">
            <div className="navbar_admin">
                <div className="title">Administrator Panel</div>
                <div className="upload-file">
                    <div 
                        style={{
                            borderBottom: clicked === 'Upload' || hovered === 'Upload' ? '3px solid #E2E3DD' : '3px solid transparent',
                            letterSpacing: clicked === 'Upload' || hovered === 'Upload' ? '1px' : '0px'
                        }}

                        onClick={()=>{setClicked('Upload')}}
                        onMouseEnter={()=>{setHovered("Upload")}}
                        onMouseLeave={()=>{setHovered(null)}}
                    >Upload
                    </div>
                    <div 
                        style={{
                            borderBottom: clicked === 'Stats' || hovered === 'Stats' ? '3px solid #E2E3DD' : '3px solid transparent',
                            letterSpacing: clicked === 'Stats' || hovered === 'Stats' ? '1px' : '0px'
                        }}
                        onClick={()=>{setClicked('Stats')}}
                        onMouseEnter={()=>{setHovered("Stats")}}
                        onMouseLeave={()=>{setHovered(null)}}
                    >Stats
                    </div>
                    <div 
                        style={{
                            borderBottom: clicked === 'Leaderboard' || hovered === 'Leaderboard' ? '3px solid #E2E3DD' : '3px solid transparent',
                            letterSpacing: clicked === 'Leaderboard' || hovered === 'Leaderboard' ? '1px' : '0px'
                        }}
                        onClick={()=>{setClicked('Leaderboard')}}
                        onMouseEnter={()=>{setHovered("Leaderboard")}}
                        onMouseLeave={()=>{setHovered(null)}}
                    >Leaderboard
                    </div>
                </div>
            </div>
            {content}
        </div>
    )
}


export default AdminPanel;