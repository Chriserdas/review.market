import axios from "axios";
import {React,useState,useEffect} from "react";
import NotificationPopup from "../NotificationPopup";
import Charts from "./Charts";

const AdminPanel = ()=>{
    const [clicked,setClicked] = useState("Upload");

    const [hovered,setHovered] = useState(null);
    const [selected,setSelected] = useState("Choose Data");
    const [file, setFile] = useState({
        name:'Choose File',
        file:null
    });
    const [leaderBoard,setLeaderBoard] = useState(null);
    const [userCounter,setUserCounter] = useState(0);

    const [clickSelected,setClickedSelected] = useState(false);
    const [notification,setNotification] = useState({
        show:false,
        message:'',
        color:''
    });

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
                setFile({name:'Choose File',file:null});
                setNotification({
                    show:true,
                    message:response.data.message,
                    color:response.data.color
                })
            });
             
            
        }
    }

    const handleDelete = ()=>{
        if(selected !== 'Choose Data'){
            axios.post("http://localhost:5000/api/deleteAll", {selected:selected})
            .then(response=>{
                setFile({name:'Choose File',file:null});
                setNotification({
                    show:true,
                    message:response.data.message,
                    color:response.data.color
                });
            });
        }
    }

    useEffect(()=>{
        if(clicked === 'Leaderboard'){
            axios.post('http://localhost:5000/api/leaderboard',{number:userCounter}).then(response=>{
                setLeaderBoard(response.data);   
            });
        }
    },[clicked]);

    useEffect(()=>{
        
        axios.post('http://localhost:5000/api/leaderboard',{number:userCounter}).then(response=>{
            setLeaderBoard(response.data);   
        });
    
            
    },[userCounter])

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
                                        setSelected(result)
                                    }}
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
                        onClick={()=>{handleDelete()}}
                    >Delete All</div>
                </div>
            </div>
    }
    if(clicked === 'Stats'){
        content = <Charts/>
            
    }
    if(clicked === "Leaderboard"){
        content = 
            <div className="leaderboard_container">
                <p className="leaderboard_back"
                    onClick={()=>{
                        if(userCounter !==0){
                            setUserCounter(userCounter-10);
                        }
                            
                    }}
                >&lt;</p>
                <div className="leaderboard">
                    <table>
                        <thead className='offers_table'>
                            <tr>
                            <th className='offers_header'>P</th>
                            <th className='offers_header'>Username</th>
                            <th className='offers_header'>Total Score</th>
                            <th className='offers_header'>Total Tokens</th>
                            <th className='offers_header'>Tokens Of The Month</th>
                            </tr>    
                        </thead>
                        <tbody>
                            {leaderBoard!==null || leaderBoard.length>0 ? 
                                (
                                    leaderBoard.map((user,index) => (
                                        <tr key={index}>
                                            <td className="table-data">{index+1+userCounter}</td>
                                            <td className="table-data">{user.username}</td>
                                            <td className="table-data">{user.totalScore}</td>
                                            <td className="table-data">{user.totalToken}</td>
                                            <td className="table-data">{user.token}</td>
                                        </tr>
                                    ))
                                ):<tr><td>No more users to show</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
                <p className="leaderboard_front"
                    onClick={()=>{setUserCounter(userCounter+10)}}
                >&gt;</p>
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
            <NotificationPopup
                activate={notification.show}
                color={notification.color}
                message={notification.message}
                setActivate={setNotification}
            />
        </div>
    )
}


export default AdminPanel;