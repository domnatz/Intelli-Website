
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

import CallIcon from '@mui/icons-material/Call';
import PlaceIcon from '@mui/icons-material/Place';
import EmailIcon from '@mui/icons-material/Email';   


import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import   
 TelegramIcon from '@mui/icons-material/Telegram';

import   
 Intellispeech from '../images/IntelliSpeech.png';
import iMessageIcon from '../images/imessage.svg';
import viberIcon from '../images/viber.svg';

import logo from '../images/logo.png';
import Team from '../images/weareintelli.jpg';
import All from '../images/theTeam.jpg';
import LST from '../images/LSTTeam.jpg';
import SLP from '../images/SLPTeam.jpg';
import Photo1 from '../images/Photo01.png';
import Photo2 from '../images/Photo02.png';
import Photo3 from '../images/Photo03.png';

export default function Landing({ isLoggedIn, onLogout  }) { 
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  const handleBookAppointmentClick = () => {
    if (isLoggedIn) {
      navigate('/appointment'); 
    } else {
      localStorage.setItem('intendedDestination', '/appointment'); 
      navigate('/login');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'about':
        return <AboutUs />;
      case 'services':
        return <OurServices />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Home />;
    }
  }

  return (
    <div className="Landing-Container">
      <header>
        <img className="Logo" src={logo} alt="Logo" />
        <nav>
          <button onClick={() => setActiveSection('home')}>Home</button>
          <button onClick={() => setActiveSection('about')}>About Us</button>
          <button onClick={() => setActiveSection('services')}>Our Services</button>
          <button onClick={() => setActiveSection('contact')}>Contact Us</button>
        </nav>

        <button className="apt-btn" onClick={handleBookAppointmentClick}>
          Book an Appointment 
        </button>

        {isLoggedIn && ( 
          <button className="logout-btn" onClick={onLogout}> {/* Call onLogout prop */}
            Logout
          </button>
        )}

      </header>

      <main>
        {renderSection()}
      </main>

      <footer>
        <img className="companyname" src={Intellispeech} alt="" />

        <div className="foot">
          <div className="Information">
            <div className="info">
              <PlaceIcon sx={{ color: 'white', fontSize: 40 }} />
              <p>Dao Street, Daro, Dumaguete City, Philippines</p>
            </div>

            <div className="info">
              <CallIcon sx={{ color: 'white', fontSize: 40 }} />
              <p>0955 837 7169</p>
            </div>

            <div className="info">
              <EmailIcon sx={{ color: 'white', fontSize: 40 }} />
              <p>intellispeechtherapycenter@gmail.com</p>
            </div>
          </div>

          <div className="OnlineCom">
            <h2>Join Our IntelliSpeech Community</h2>
            <div className="icons">
              <InstagramIcon sx={{ color: 'white', fontSize: 60 }} />
              <FacebookIcon sx={{ color: 'white', fontSize: 60 }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Home() {
    return <div className="Land">
        <img className="Team" src={Team} alt=""/>

        <div className="landing-cnt">
            <h2>About Us</h2>
            <p>
                Welcome to IntelliSpeech Therapy Center, the premier provider of speech-language pathology and occupational therapy services in Negros Oriental.
                We are dedicated to enhancing the quality of life for individuals across all age groups, from pediatric to geriatric. Our mission is to provide personalized,
                evidence-based therapy that addresses each client's unique needs and helps them achieve their fullest potential.
            </p>

            <p>
                At IntelliSpeech, we pride ourselves on employing certified Speech-Language Pathologists and Licensed Occupational Therapists who bring their expertise 
                and compassion to every session. Our team is committed to delivering high-quality care through innovative methods and a client-centered approach.
            </p>
        </div>
        <div className="abt-cnt">
            <button className="abt-btn"> Meet the Heart Behind the Work </button>
        </div>

        <div className="Therapists">
            <h1>Our Therapists</h1>
            
            <div className="TherapistList">
                <img className="Everyone" src={All} alt="All Therapists"/>
                <img className="SLPThera" src={SLP} alt="Speech Language Pathologists"/>
                <img className="LSTeach" src={LST} alt="Learning Support Teachers"/>
            </div>
        </div>
    </div>
}

function AboutUs() {
   return <div className="AbtUs">
        <div className="Advocacy">
            <h1>Our Advocacy</h1>
            <p>
                At IntelliSpeech Therapy Center, we are passionate about improving the lives of individuals through 
                dedicated speech-language pathology and occupational therapy services. Our advocacy is rooted in the 
                belief that everyone deserves access to high-quality, personalized therapy that addresses their unique 
                needs and helps them reach their fullest potential.
            </p>
            <p>
                We strive to empower our clients by enhancing their communication skills and promoting independence in 
                daily activities. Our certified Speech-Language Pathologists and Licensed Occupational Therapists work 
                tirelessly to create individualized therapy plans that support the personal growth and development of 
                each client.
            </p>
        </div> 

        <div className="PartnerinProgress">
            <h2> Your Partner in Progress </h2>
            <div className="Progress">
                <img className="Partnerprog" src={Photo1} alt=""/>
                <p> 
                    At IntelliSpeech Therapy Center, we are more than just a therapy provider; we are your partner in progress. 
                    Together, we can overcome challenges, celebrate successes, and achieve remarkable outcomes. Join us in our 
                    advocacy to make a meaningful difference in the lives of those we serve.
                </p>
            </div>
        </div>

        <div className="MisVis">
            <div className="Mission">
            <h2> Our Mission </h2>
                <p> 
                    At IntelliSpeech Therapy Center, our mission is to enhance the quality of life for individuals of all ages. 
                    We are dedicated to fostering growth, independence, and effective communication through compassionate care, 
                    innovative therapy techniques, and a commitment to excellence.
                </p>
            </div>

            <div className="Vision">
            <h2> Our Vision </h2>
                <p> 
                    Our vision is to be the leading therapy center in Negros Oriental, recognized for our outstanding service, 
                    client-centered approach, and positive impact on the community. We aim to create an inclusive environment 
                    where every individual has access to the highest quality therapy.
                </p>
            </div>
        </div>
    </div>
}

function OurServices() {
    return <div className="Services">
        <h1>Our Services</h1>

        <div className="SLPService">
            <div className="SpeechPath">
                <div className="photo">
                    <img className="photos" src={Photo2} alt=""/>  
                </div>
                <div className="Desc">
                    <h2> Speech Language Pathology </h2>
                    <p> 
                        Specialist in the evaluation, diagnosis, treatment, and prevention of communication disorders 
                        (speech and language impairments), cognitive-communication disorders, voice disorder across 
                        the lifespan.
                    </p>
                    <div className="btn-cnt">
                        <button className="apt-btns"> Book an Appointment </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="OTService">
            <div className="Occupational">
                <div className="photo">
                    <img className="photos" src={Photo3} alt=""/>
                </div>
                <div className="Desc">
                    <h2> Occupational Therapy </h2>
                    <p> 
                        Involves the therapeutic use of everyday activities, or occupations, to treat the physical, mental, 
                        developmental. and emotional ailments that impact patient's ability to perform daily tasks.
                    </p>
                    <div className="btn-cnt">
                        <button className="apt-btns"> Book an Appointment </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
 }

function ContactUs() {
   return <div className="Contact">
         <h1> Join Our IntelliSpeech Community </h1>
         <div className="allcontacts">
            <div className="contacts">
                <div className="con">
                    <PlaceIcon sx={{color: 'white', fontSize: 60}} />
                    <p>Dao Street, Daro, Dumaguete City, Philippines</p>
                </div>
                <div className="con">
                    <CallIcon sx={{color: 'white', fontSize: 60 }} />
                    <p>Phone Number: 0955 837 7169</p>
                    <p>Telephone Number: (035) 402 0200</p>
                </div>
                <div className="con">
                    <EmailIcon sx={{color: 'white', fontSize: 60}} />
                    <p>intellispeechtherapycenter@gmail.com</p>
                </div>
            </div>

            <div className="otherContacts">
                <div className="icons2"> 
                    <FacebookIcon sx={{color: 'white', fontSize: 60}} />
                    <InstagramIcon sx={{color: 'white', fontSize: 60}} />
                </div>
                <p> You may also contact us through: </p>
                <div className="icons2">
                    <img src={iMessageIcon} alt="" />
                    <img src={viberIcon} alt="" />
                    <WhatsAppIcon sx={{color: 'white', fontSize: 60}} />
                    <TelegramIcon sx={{color: 'white', fontSize: 60}} />
                </div>
            </div>
         </div>

        
    </div>
}

