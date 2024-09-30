import './staffHome.css';
import Sidebar from './Sidebar'; 
import intelliHome from '../../images/weareintelli.jpg';

<meta name="viewport" content="initial-scale=1, width=device-width" />


export default function StaffHome() {
    return (
        
        <div className = "Staff-home">
            <Sidebar />
            <div className="content">
            <img src={intelliHome} alt="ItelliSpeech" className="intelliH" />
            </div>
        </div>
       
    );
}