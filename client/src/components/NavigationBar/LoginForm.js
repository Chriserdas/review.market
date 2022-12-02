import { useState } from 'react';
import './login.css';
import LoginUser from './LoginUser';
import LoginAdmin from './LoginAdmin';

function LoginForm({isShowLogin}) {
  const [appear, setAppear] = useState(true);

  function change(){
    setAppear(false);
  }
  function reverse(){
    setAppear(true)
  }
  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
        <div className="LoginForm">
        {appear && <LoginUser change={change}></LoginUser>}
        {!appear && <LoginAdmin reverse={reverse}></LoginAdmin>}
        </div>
    </div>
  );
}

export default LoginForm;
