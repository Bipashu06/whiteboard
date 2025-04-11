import './welcome.css'
import board from './assets/board.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
export default function Welcome(){
    return(
        <div className="welcome-content-container">
            <h1>Welcome To Whiteboard</h1>
            <div className="start-button">
                 New Page
                <FontAwesomeIcon icon = {faPlus} id = "plus_btn"/>
            </div>
        </div>
    )
}