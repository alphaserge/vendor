import React from "react"
import { useNavigate } from "react-router-dom";

//const Home = (props) => {
export default function Home(props) {    
    //const { loggedIn, user } = props
    const navigate = useNavigate();
    
    const onButtonClick = () => {
        if (props.loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }


    console.log('props:')
    console.log(props)

    return <div className="mainContainer">
        <div className={"titleContainer"}>
            <div>Welcome!</div>
        </div>
        <div>
            This is the home page.
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={props.loggedIn ? "Log out" : "Log in"} />
            {(props.loggedIn ? <div>
                Your email address is {props.user.email}
            </div> : <div/>)}
        </div>


    </div>
}

//export default Home