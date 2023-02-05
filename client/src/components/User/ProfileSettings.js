
import axios from 'axios';
import {React,useEffect,useState} from 'react'
import NotificationPopup from '../NotificationPopup';
import AdminPanel from './AdminPanel';

function ProfileSettings(props) {
    const [clicked,setClicked] = useState("Account");

    const [hovered,setHovered] = useState(null);
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("token")));
    const [changeUsername,setChangeUsername] = useState(false);
    const [changePassword,setChangePassword] = useState(false);
    const [passwordValue,setPasswordValue] = useState({
        oldPassword:"",newPassword:""
    })

    const [offers,setOffers] = useState(null);
    const [likes,setLikes] = useState(null);
    const [usernameValue,setUsernameValue] = useState(user.username);
    const [tokens,setTokens] = useState({
        score:"",totalScore:"",tokens:"",totalTokens:""
    });

    const [notification,setNotification] = useState({
        show:false,
        message:'',
        color:''
    })

    useEffect(() => {

        if(clicked==='Account') {
            
            axios.post('http://localhost:5000/api/AccountData',{userId:user._id})
            .then(response => {
                setTokens({
                    score:response.data[0].score,
                    totalScore:response.data[0].totalScore,
                    tokens:response.data[0].token,
                    totalTokens:response.data[0].totalToken

                });
            })
        }
        else if(clicked=== 'History') {
            axios.post('http://localhost:5000/api/history',{userId:user._id})
            .then(response => {

                if(response.data.length!==0){
                    setOffers(response.data.filter(object => object.createdByUser === true));
                    setLikes(response.data.filter(object=>object.liked === true || object.disliked === true));
                }
            })
        }

    },[clicked])

    const handleProfile = () => {
        let updateUsername = true;
        //setChangeUsername(false)

        if(usernameValue === '' || usernameValue === user.username){
            setUsernameValue(user.username);
            updateUsername = false;
        }

        if(passwordValue.oldPassword==="" || passwordValue.newPassword===""){
            setChangePassword(false)
            setPasswordValue({
                oldPassword:'',
                newPassword:""
            });
        }

        axios.patch('http://localhost:5000/api/auth/updateProfile',
        {
            userId:user._id,
            updateUsername:updateUsername,
            newUsername:usernameValue,
            oldPassword:passwordValue.oldPassword,
            newPassword:passwordValue.newPassword
        })
        .then(response => {
            setChangeUsername(false);
            setChangePassword(false);
            setUser(response.data.user);
            setNotification({show:true,message:response.data.message,color:response.data.color});
            localStorage.setItem("token", JSON.stringify(response.data.user));
        })
    }

    useEffect(() => {
        if(!changePassword) {
            setPasswordValue({
                oldPassword:'',
                newPassword:''
            });
        }
    },[changePassword])

    return (
        <div className="profile-settings">
            {props.isClicked ==='Settings' ? (
                <>
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
                                        <div className="username">Welcome, {user.username}</div>
                                        <div className='tokens-scores'>
                                            <div>
                                                <div>Total Score:{tokens.totalScore}</div>
                                                <div>Score of Month:{tokens.score}</div>
                                            </div>
                                            <div>
                                                <div>Total Tokens:{tokens.totalTokens}</div>
                                                <div>Tokens:{tokens.tokens}</div>
                                            </div>
                                            
                                        </div> 
                                    </div>
                                    <div className='secondRowAcc'>
                                        <div className='username_acc'>Username
                                            <div>
                                                <input
                                                    value={usernameValue}
                                                    readOnly={!changeUsername}
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
                                                        value={passwordValue.oldPassword}
                                                        onChange={(e)=>{
                                                            setPasswordValue({
                                                                oldPassword:e.target.value,
                                                                newPassword:passwordValue.newPassword
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div>New Password
                                                    <input
                                                        className='passAcc' 
                                                        type="password"
                                                        value={passwordValue.newPassword}
                                                        onChange={(e)=>{
                                                            setPasswordValue({
                                                                oldPassword:passwordValue.oldPassword,
                                                                newPassword:e.target.value
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className='save'
                                            onClick={()=>{handleProfile()}}
                                        >save changes</div>
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
                                                <div>Total Score: {tokens.totalScore}</div>
                                                <div>Score of Month:{tokens.score}</div> 
                                            </div>
                                            <div>
                                                <div>Total Tokens:{tokens.totalTokens}</div>
                                                <div>Tokens of Month:{tokens.tokens}</div>
                                            </div>
                                            
                                        </div> 
                                    </div>
                                    <div className='secondRowHist'>
                                        <div>
                                            <div className='offers'>Offers</div>
                                            <div className='table_container'>
                                                <table>
                                                    <thead className='offers_table'>
                                                        <tr>
                                                        <th className='offers_header'>Product Name</th>
                                                        <th className='offers_header'>Supermarket</th>
                                                        <th className='offers_header'>Date</th>
                                                        </tr>    
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            offers!==null ? 
                                                                (
                                                                    offers.map((offer,index)=>(
                                                                        <tr key={index}> 
                                                                            <td className="table-data">{offer.products[0].name}</td>
                                                                            <td className="table-data">{offer.supermarkets[0].properties.name || offer.supermarkets[0].properties.shop}</td>
                                                                            <td className="table-data">{new Date(offer.createdDate).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))

                                                                )
                                                                :<tr><td className='no_cont'>You have not created offers yet</td></tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="likes_dislikes">
                                            <div className='offers'>Likes/Dislikes</div>
                                            <div className='table_container'>
                                                <table>
                                                    <thead className='offers_table'>
                                                        <tr>
                                                        <th className='offers_header'>Product Name</th>
                                                        <th className='offers_header'>Supermarket</th>
                                                        <th className='offers_header'>React</th>
                                                        <th className='offers_header'>Date</th>
                                                        </tr>    
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            likes!==null ? 
                                                                (
                                                                    likes.map((offer,index)=>(
                                                                        <tr key={index}> 
                                                                            <td className="table-data">{offer.products[0].name}</td>
                                                                            <td className="table-data">{offer.supermarkets[0].properties.name || offer.supermarkets[0].properties.shop}</td>
                                                                            <td className="table-data">{offer.liked===true? 'like' : "dislike"}</td>
                                                                            <td className="table-data">{new Date(offer.createdDate).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))

                                                                )
                                                                :<tr><td className='no_cont'>You have not reacted to any offers yet</td></tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }     
                    </div>
                    
                    {/*<NotificationPopup
                        activate=
                    />*/}
                </>)
                :<AdminPanel/>
            }
        </div>
    )
}

export default ProfileSettings