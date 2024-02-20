 //Google Authentication Part
 import { auth, facebookProvider, GithubProvider, GoogleProvider } from "../../firebase";
 import {signInWithRedirect} from 'firebase/auth'
 import { toast } from "react-toastify";
 export const handleGoogleAuth = () => {
    signInWithRedirect(auth, GoogleProvider)
      .then(() => {
        toast.success("Account has been linked to Google Successfully", {
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Failed to link to Google", {
          autoClose: 5000,
        });
      });
  };
  //Facebook Authentication part
 export const handleFacebookAuth = () => {
    signInWithRedirect(auth, facebookProvider)
      .then(() => {
        toast.success("Account has been linked to Facebook Successfully", {
          autoClose: 5000,
        });
      })
      .catch((error) => {
        toast.error("Failed to link to Facebook", {
          autoClose: 5000,
        });
      });
  };
  //Github Authentication part
export  const handleGithubAuth = ()=>{
    signInWithRedirect(auth , GithubProvider).then(()=>{
      toast.success('Account has been linked to Github Successfully', {
        autoClose:5000
      })
    }).catch((error)=>{
      toast.error('Failed to link to Github', {
        autoClose:5000
      })
    })
  }