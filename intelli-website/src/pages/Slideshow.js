import React, { useState, useEffect } from 'react';
import './Slideshow.css'; // Update your CSS file for styling.
import All from '../images/theTeam.jpg';
import SLP from '../images/SLPTeam.jpg';
import LST from '../images/LSTTeam.jpg';
import OT1 from '../images/OT1.jpg';
import OT2 from '../images/OT2.jpg';
import OT3 from '../images/OT3.jpg';

const therapists = [
  { id: 1, image: All, alt: "All Therapists" },
  { id: 2, image: SLP, alt: "Speech Language Pathologists" },
  { id: 3, image: LST, alt: "Learning Support Teachers" },
  { id: 4, image: OT1, alt: "Occupational Therapists" },
  { id: 5, image: OT2, alt: "Occupational Therapists" },
  { id: 6, image: OT3, alt: "Occupational Therapists" },
];
export default function Landing() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically move to the next slide every 3 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);
    return () => clearInterval(interval); // Cleanup on unmount.
  }, [currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % therapists.length
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? therapists.length - 1 : prevIndex - 1
    );
  };

  // Get the 3 images to display, wrapping around if needed.
  const getDisplayedTherapists = () => {
    return [
      therapists[currentIndex],
      therapists[(currentIndex + 1) % therapists.length],
      therapists[(currentIndex + 2) % therapists.length],
    ];
  };

  return (
    <div className="Therapists">
      <h1 className="TherapistLbl">Our Therapists</h1>
      <div className="carousel-container">

        <div className="carousel-slide">
          {getDisplayedTherapists().map((therapist) => (
            <img
              key={therapist.id}
              src={therapist.image}
              alt={therapist.alt}
              className="carousel-image"
            />
          ))}
        </div>

      </div>

      <div className="carousel-dots">
        {Array(therapists.length)
          .fill()
          .map((_, index) => (
            <span
              key={index}
              className={`dot ${
                index === currentIndex ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
      </div>
    </div>
  );
}
