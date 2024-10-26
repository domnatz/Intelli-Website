import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import Slideshow from './Slideshow';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button, Grid
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
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
import Photo1 from '../images/Photo01.png';
import Photo2 from '../images/Photo02.png';
import Photo3 from '../images/Photo03.png';

const iconStyle = {
  color: 'white',
  fontSize: 60,
};

const socialIconStyle = {
  color: 'white',
  fontSize: 40,
};

export default function Landing() {
  const [activeSection, setActiveSection] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

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
  };

  // Drawer toggle function
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <div className="Landing-Container">
      {/* Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#94C5B5', zIndex: 1000, height: '80px' }}>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img className="Logo" src={logo} alt="Logo" style={{ marginRight: 'px', width: '70px', height: '60px', marginBottom: 15 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
      <nav >
      <ul style={{ display: 'flex', gap: '30px', listStyle: 'none', padding: 0, marginBottom: 29 }}>
          <li className= "lia" onClick={() => setActiveSection('home')}>Home</li>
          <li className= "lia"onClick={() => setActiveSection('about')}>About Us</li>
          <li className= "lia" onClick={() => setActiveSection('services')}>Our Services</li>
          <li className= "lia" onClick={() => setActiveSection('contact')}>Contact Us</li>
          </ul>
        </nav>
      </Box>

      <button className="apt-btn" onClick={handleBookAppointmentClick}>
    Book an Appointment
  </button>

    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      

      <IconButton
        color="inherit"
        edge="end"
        onClick={() => toggleDrawer(true)}
        sx={{ display: { xs: 'block', md: 'none' }, ml: 2 }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  </Toolbar>

  <Drawer
  className="Nav-bar-drawer"
  anchor="right"
  open={drawerOpen}
  onClose={() => toggleDrawer(false)}
  PaperProps={{
    sx: {
      zIndex: 1301, // Ensure the drawer is above the AppBar
    },
  }}
>
  <List sx={{ width: 250,  }}>
    <ListItem button onClick={() => setActiveSection('home')}>
      <ListItemText
        primary="Home"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px'}}
      />
    </ListItem>

    <ListItem button onClick={() => setActiveSection('about')}>
      <ListItemText
        primary="About Us"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
      />
    </ListItem>

    <ListItem button onClick={() => setActiveSection('services')}>
      <ListItemText
        primary="Our Services"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
      />
    </ListItem>

    <ListItem button onClick={() => setActiveSection('contact')}>
      <ListItemText
        primary="Contact Us"
        primaryTypographyProps={{ fontWeight: 'bold', color: 'white', fontSize: '18px' }}
      />
    </ListItem>
  </List>

    <div className="Nav-bar-drawer-footer">
      <p>&copy; IntelliSpeech Therapy Center</p>
    </div>
    </Drawer>
      </AppBar>

      <main>
      {renderSection()}
    </main>
    

    <Box
      component="footer"
      sx={{
        backgroundColor: '#94C5B5',
        padding: '40px 20px',
        boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
        
      }}
    >

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Company Logo Section */}
        <Grid item xs={12} md={4} textAlign="center">
          <Box
            component="img"
            src={Intellispeech}
            alt="IntelliSpeech Logo"
            sx={{ width: '200px', marginBottom: '10px' }}
          />
        </Grid>

        {/* Contact Information Section */}
        <Grid item xs={12} md={4}>
          <Box>
            <Grid container spacing={2} sx={{fontWeight: 'bolder'}}>
              <Grid item xs={12} display="flex" alignItems="center" >
                <PlaceIcon
                  sx={{
                    color: 'white',
                    fontSize: 40,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    padding: '5px',
                    backgroundColor: '#2D848B',
                    marginRight: '10px',
                  }}
                />
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#3F4662' }}>Dao Street, Daro, Dumaguete City, Philippines</Typography>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center">
                <CallIcon
                  sx={{
                    color: 'white',
                    fontSize: 40,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    padding: '5px',
                    backgroundColor: '#2D848B',
                    marginRight: '10px',
                  }}
                />
                <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#3F4662' }}>0955 837 7169</Typography>
              </Grid>

              <Grid item xs={12} display="flex" alignItems="center">
                <EmailIcon
                  sx={{
                    color: 'white',
                    fontSize: 40,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    padding: '5px',
                    backgroundColor: '#2D848B',
                    marginRight: '10px',
                  }}
                />
                 <a
                    href="mailto:intellispeechtherapycenter@gmail.com"
                      style={{ textDecoration: 'none' }}
                   >
                <Typography
                    sx={{ fontWeight: 'bold', fontSize: '15px', color: '#3F4662' }}
                >
                intellispeechtherapycenter@gmail.com
                </Typography>
              </a>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} md={4} textAlign="center">
          <Typography variant="h6" sx={{ marginBottom: '20px', color: '#3F4662', fontWeight: 'bold',fontSize: '20px',  }}>
            Join Our IntelliSpeech Community
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
    {/* Instagram Link */}
    <a
      href="https://www.instagram.com/intellispeech"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <InstagramIcon
        sx={{
          color: 'white',
          fontSize: 40,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          padding: '5px',
          backgroundColor: '#2D848B',
        }}
      />
    </a>

    {/* Facebook Link */}
    <a
      href="https://www.facebook.com/intellispeechtherapycenter"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <FacebookIcon
        sx={{
          color: 'white',
          fontSize: 40,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          padding: '5px',
          backgroundColor: '#2D848B',
        }}
      />
    </a>
  </Box>
        </Grid>
      </Grid>
    </Box>
        </div>
 );

};

function Home() {
  return <div className="Land">
      <img className="Team" src={Team} alt=""/>

      <div className="landing-cnt">
          <h1 className="AboutLbl">About Us</h1>
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
      

      <div className="Therapists">
          <Slideshow />
      </div>
  </div>
}

function AboutUs() {
  return (
      <Box sx={{ padding: '60px 20px', backgroundColor: '#f7eedd', marginBottom: '5px',  }}>
        {/* Advocacy Section */}
        <Box sx={{ marginBottom: '60px', textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{ marginBottom: '10px', color: '#2d848b', fontWeight: 'bolder' }}
          >
            Our Advocacy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              margin: '0 auto', // Center the text block
              maxWidth: '1200px', // Limit width for readability
              textAlign: 'justify',
              fontWeight: 'bolder',
              fontSize: '20px',
              lineHeight: 1.6,
              textIndent: '30px',
            }}
          >
            At IntelliSpeech Therapy Center, we are passionate about improving the lives of individuals through dedicated
            speech-language pathology and occupational therapy services. Our advocacy is rooted in the belief that everyone
            deserves access to high-quality, personalized therapy that addresses their unique needs and helps them reach
            their fullest potential.
            <br />
            <br />
            We strive to empower our clients by enhancing their communication skills and promoting independence in daily activities.
            Our certified Speech-Language Pathologists and Licensed Occupational Therapists work tirelessly to create individualized
            therapy plans that support the personal growth and development of each client.
          </Typography>
        </Box>
  
        {/* Partner in Progress Section */}
        <Box
          sx={{
            marginBottom: '30px',
            padding: '30px',
            borderRadius: '15px',
            backgroundColor: '#c66b6a80',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
            maxWidth: '900px', // Center and limit the width
            margin: '0 auto',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={Photo1}
                alt="Partner in Progress"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '15px',
                  objectFit: 'cover',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{ marginBottom: '20px', color: '#2d848b', textAlign: 'center', fontWeight: 'bolder' }}
              >
                Your Partner in Progress
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'justify',
                  fontSize: '20px',
                  fontWeight: 'bolder',
                  textIndent: '30px',
                  lineHeight: 1.6,
                }}
              >
                At IntelliSpeech Therapy Center, we are more than just a therapy provider; we are your partner in progress.
                Together, we can overcome challenges, celebrate successes, and achieve remarkable outcomes. Join us in our
                advocacy to make a meaningful difference in the lives of those we serve.
              </Typography>
            </Grid>
          </Grid>
        </Box>
  
        {/* Mission and Vision Section */}
        <Grid container spacing={4} sx={{ marginBottom: '130px', }}>
          <Grid item xs={12} md={6} >
            <Box
              sx={{
                borderRadius: '15px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '50px',
                
              }}
            >
              <Typography
                variant="h4"
                sx={{ marginBottom: '10px', color: '#2d848b', textAlign: 'center' , fontWeight: 'bolder'}}
              >
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.6 , fontWeight: 'bolder', fontSize: '18px', margin: '3%'}}>
                At IntelliSpeech Therapy Center, our mission is to enhance the quality of life for individuals of all ages.
                We are dedicated to fostering growth, independence, and effective communication through compassionate care,
                innovative therapy techniques, and a commitment to excellence.
              </Typography>
            </Box>
          </Grid>
  
          <Grid item xs={12} md={6} >
            <Box
              sx={{
                
                borderRadius: '15px',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '50px',
              }}
            >
              <Typography
                variant="h4"
                sx={{ marginBottom: '6px', color: '#2d848b', textAlign: 'center', fontWeight: 'bolder' }}
              >
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.6 , fontWeight: 'bolder', fontSize: '18px',   margin: '3%' }}>
                Our vision is to be the leading therapy center in Negros Oriental, recognized for our outstanding service,
                client-centered approach, and positive impact on the community. We aim to create an inclusive environment
                where every individual has access to the highest quality therapy.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
}

function OurServices() {
  return(
  <Box sx={{ padding: '40px 20px', backgroundColor: '#f7eedd', minHeight: '100vh', marginBottom: '50px',   }}>
  <Typography 
    variant="h3" 
    component="h1" 
    sx={{ textAlign: 'center', marginBottom: '20px',marginTop:'20px', color: '#2d848b',  fontWeight: 'bolder', }}
  >
    Our Services
  </Typography>

  <Grid container spacing={4} justifyContent="center" >
    {/* Speech Language Pathology Card */}
    <Grid item xs={12} sm={6} md={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          height: '100%',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <Box component="img" src={Photo2} alt="Speech Pathology" sx={{ width: '100%', height: '200px', objectFit: 'cover', }} />
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '10px', color: '#2d848b',  fontWeight: 'bolder', }}>
            Speech Language Pathology
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px', color: '#3f4662',  fontWeight: 'bolder', }}>
            Specialist in the evaluation, diagnosis, treatment, and prevention of communication
            disorders (speech and language impairments), cognitive-communication disorders, and
            voice disorders across the lifespan.
          </Typography>
        </Box>
      </Box>
    </Grid>

    {/* Occupational Therapy Card */}
    <Grid item xs={12} sm={6} md={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
         
          height: '100%',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <Box component="img" src={Photo3} alt="Occupational Therapy" sx={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <Box sx={{ padding: '20px' }}>
          <Typography variant="h5" sx={{ marginBottom: '10px', color: '#2d848b',  fontWeight: 'bolder', }}>
            Occupational Therapy
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px', color: '#3f4662',  fontWeight: 'bolder', }}>
            Involves the therapeutic use of everyday activities, or occupations, to treat the
            physical, mental, developmental, and emotional ailments that impact a patient’s
            ability to perform daily tasks.
          </Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
</Box>
  );
 }

function ContactUs() {
   return (
    <Box sx={{ padding: '40px', backgroundColor: '#F7EEDD', marginBottom: '140px', }}>
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', marginBottom: '20px',marginTop:'20px', color: '#2d848b',  fontWeight: 'bolder' }}
      >
        Join Our IntelliSpeech Community
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Contact Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', }}>
            <ContactItem 
              icon={<PlaceIcon sx={iconStyle} />} 
              text="Dao Street, Daro, Dumaguete City, Philippines" 
            />
            <ContactItem 
              icon={<CallIcon sx={iconStyle} />} 
              text={
                <>
                  Phone Number: 0955 837 7169 <br />
                  Telephone Number: (035) 402 0200
                </>
              } 
            />
            <ContactItem 
              icon={<EmailIcon sx={iconStyle} />} 
              text="intellispeechtherapycenter@gmail.com" 
            />
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a
        href="https://www.facebook.com/intellispeechtherapycenter"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <SocialIcon icon={<FacebookIcon sx={socialIconStyle} />} />
      </a>

      <a
        href="https://www.instagram.com/intellispeech"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <SocialIcon icon={<InstagramIcon sx={socialIconStyle} />} />
      </a>
            </Box>

            <Typography variant="body1" sx={{ color: '#3F4662', fontWeight: 'bolder', fontSize: '18px' }}>
              You may also contact us through:
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <a 
                  href="https://www.apple.com/imessage/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <SocialIcon icon={<img src={iMessageIcon} alt="iMessage" style={{ width: 50, height: 50 }} />} />
                </a>

                <a 
                  href="https://www.viber.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <SocialIcon icon={<img src={viberIcon} alt="Viber" style={{ width: 50, height: 50 }} />} />
                </a>

                <a 
                  href="https://www.whatsapp.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <SocialIcon icon={<WhatsAppIcon sx={socialIconStyle} />} />
                </a>

                <a 
                  href="https://telegram.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <SocialIcon icon={<TelegramIcon sx={socialIconStyle} />} />
                </a>
              </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ContactItem({ icon, text }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        backgroundColor: '#C66B6A80', 
        padding: '15px', 
        borderRadius: '15px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        color: '#3F4662'
      }}
    >
      {icon}
      <Typography variant="body1" sx={{ color: '#3F4662', fontWeight: 'bolder', fontSize: '18px' }}>
        {text}
      </Typography>
    </Box>
  );
}

function SocialIcon({ icon }) {
  return (
    <Box 
      sx={{ 
        width: 60, 
        height: 60, 
        borderRadius: '50%', 
        backgroundColor: '#2D848B', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' 
      }}
    >
      {icon}
    </Box>
  );
}

