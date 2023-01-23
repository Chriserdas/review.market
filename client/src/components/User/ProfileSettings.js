
import {React,useEffect,useState} from 'react'


function ProfileSettings(props) {
    const [clicked,setClicked] = useState("Account");

    const [hovered,setHovered] = useState(null);
    const user = JSON.parse(localStorage.getItem("token")).user
    const [changeUsername,setChangeUsername] = useState(false);
    const [changePassword,setChangePassword] = useState(false);
    const [passwordValue,setPasswordValue] = useState({
        oldPassword:"",newPassword:""
    })
    const [usernameValue,setUsernameValue] = useState(user.username);


    useEffect(() => {

        if(clicked==='Account') {

        }
        else if(clicked=== 'History') {
            console.log(user._id);
        }

    },[clicked])
    return (
        <div className="profile-settings">
            <div className="profile-options">
                <div>Settings</div>
                <ul>
                    <li             
                        style={{
                            backgroundColor:clicked==='Account'|| hovered==="Account"? "#3a3a3a":"transparent",
                            color:clicked==='Account'|| hovered==="Account"? "#E2E3DD":"#aaaaaa",
                            letterSpacing:clicked==='Account'|| hovered==="Account"? "1px":"0px",
                            justifyContent:clicked==='Account'|| hovered==="Account"? "flex-end":"center",
                        }}
                        onClick={()=>{
                            setClicked("Account");
                        }}             
        
                        onMouseEnter={()=>{
                            setHovered("Account");
                        }}       

                        onMouseLeave={()=>{
                            setHovered(null);
                        }}
                    >Account</li>

                    <li
                        style={{
                            backgroundColor:clicked==='History'|| hovered==="History"? "#3a3a3a":"transparent",
                            color:clicked==='History'|| hovered==="History"? "#E2E3DD":"#aaaaaa",
                            letterSpacing:clicked==='History'|| hovered==="History"? "1px":"0px",
                            justifyContent:clicked==='History'|| hovered==="History"? "flex-end":"center",
                        }}
                        onClick={()=>{
                            setClicked("History");
                        }} 
                        onMouseEnter={()=>{
                            setHovered("History");
                        }} 
                        onMouseLeave={()=>{
                            setHovered(null);
                        }}
                    >History</li>
                </ul>
            </div>
            <div className="action_div">
                
                {clicked=== 'Account'? 
                    (
                        <div className='Info'>
                            <div className='firstRowAcc'>
                                <div className='title'>My Account</div>
                                <div className="username">{user.username}</div>
                                <div className='tokens-scores'>
                                    <div>
                                        <div>Total Score:</div>
                                        <div>Score of Month:</div>
                                    </div>
                                    <div>
                                        <div>Total Tokens:</div>
                                        <div>Tokens of Month:</div>
                                    </div>
                                    
                                </div> 
                            </div>
                            <div className='secondRowAcc'>
                                <div className='username_acc'>Username
                                    <div>
                                        <input
                                            value={usernameValue}
                                            readOnly={!changeUsername}
                                            //placeholder={user.username}
                                            style={{borderBottom: changeUsername ===true ? '1px solid white':'none'}}
                                            onChange={(e)=>{setUsernameValue(e.target.value)}}
                                        />
                                        <p onClick={()=>{setChangeUsername(!changeUsername)}}>edit</p>
                                    </div>
                                    
                                </div>
                                <div className='email'>Email
                                    <p>
                                        {user.email}
                                    </p>
                                    
                                </div>
                                <div className='password_acc'>Password
                                    <div>
                                        <input
                                            readOnly={true}
                                            placeholder='*****'
                                        />
                                        <p onClick={()=>{setChangePassword(!changePassword)}}>change</p>
                                    </div>
                                    <div className='oldpass' style={{display:changePassword===true? 'block':'none'}}>
                                        <div>Old Password
                                            <input
                                                className='passAcc' 
                                                type="password"
                                                
                                            />
                                        </div>
                                        <div>New Password
                                            <input
                                                className='passAcc' 
                                                type="password"
                                                
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='save'>save changes</div>
                            </div>

                        </div>
                    )
                    :
                    (
                        <div className='Info'>
                            <div className='firstRowAcc'>
                                <div className='title'>History</div>
                                <div className="username">{user.username}</div>
                                <div className='tokens-scores'>
                                    <div>
                                        <div>Total Score:</div>
                                        <div>Score of Month:</div>
                                    </div>
                                    <div>
                                        <div>Total Tokens:</div>
                                        <div>Tokens of Month:</div>
                                    </div>
                                    
                                </div> 
                            </div>
                            <div className='secondRowHist'>
                                <div>
                                    <div className='offers'>Offers</div>
                                </div>
                            </div>
                        </div>
                    )
                }     
            </div>
           
        </div>
    )
}

export default ProfileSettings