import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Authentication from "../../artifacts/contracts/facets/Authentication.sol/Authentication.json";
import "../styles/Auth.scss";
import { CONTRACTADDRESS } from '../constants'
import { Navigate } from "react-router-dom";

function Auth() {
  const [registered, setRegistered] = useState(false);
  const [fullName, setFullName] = useState("");
  const [newRegistered, setNewRegistered] = useState(false);
  const contractAddress = CONTRACTADDRESS

  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };

  //removed password changes

  const registerUser = async (e) => {
    e.preventDefault();
    if ((registered == false)) {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          console.log(signer);
          const contract = new ethers.Contract(
            contractAddress,
            Authentication.abi,
            signer
          );
          console.log(fullName);
          const add = await signer.getAddress();

          //changed hardcoded address to signer address
          const tx = await contract.createUser([1, fullName, add], { gasLimit: 800000 });
          await tx.wait();
          localStorage.setItem(add);
          console.log("Successfully new User registered");
          setNewRegistered(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  //Removed the sign in user

  const isRegistered = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          Authentication.abi,
          signer
        );

        //await contract.init(contractAddress)    //This step you have to do  one time

        //changed hardcoded address to signer address
        const add = await signer.getAddress();
        const authStatus = await contract.getAuthStatus(add);
        setRegistered(authStatus);
        console.log('Register Status - ', authStatus);

        const myPass = localStorage.getItem(add);
        if (myPass == null) throw 'SignUp/SignIn to proceed'
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isRegistered();
  }, [newRegistered]);

  return (
    <div className="authDiv">
      <div className="description">
        <img src="/assets/aossie.png" alt="aossie" className="aossieLogo" />
      </div>

      <div className="authCardHolder">
        <div className="authCard">
          <center>
            <img src="/assets/agora.png" alt="agora" className="agoraLogo" />
            <font size="3" className="agoraTitle">
              <b>Agora Blockchain</b>
            </font>
          </center>

          <>
            <form onSubmit={registerUser} style={{ margin: "10px" }}>
              {
                (registered == false) &&
                <>
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter your full name"
                    onChange={handleNameChange}
                    value={fullName}
                    type="text"
                  />
                </>
              }
              <br />

              <label className="form-label">Wallet address</label>
              <input
                className="form-control"
                type="text"
                value={window?.ethereum?.selectedAddress}
                disabled
              // value={initialized ? account : "Loading..."}
              />
              <br />

              <br />
              {
                (registered == true)
                  ?
                  <Navigate to='/dashboard' />
                  :
                  <div>
                    {
                      (registered == false) &&
                      <button onClick={registerUser} className="authButtons">
                        SIGN UP
                      </button>
                    }
                  </div>
              }
            </form>

            <br />
          </>
        </div>
      </div>
    </div>
  );
}

export default Auth;
