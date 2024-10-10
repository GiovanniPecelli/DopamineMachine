import React, { useState, useEffect } from 'react';
import './dopamineMachine.scss'; // Assicurati che questo percorso sia corretto

const audioClips = [
  { key: 'Complete', id: 'Duolingo Complete', src: '/audio/duolingo_complete.mp3' },
  { key: 'PingDing', id: 'Iphone PINGDING', src: '/audio/IPhone_Notifaction(PINGDING) (1).mp3' },
  { key: 'Success', id: 'Duolingo Success', src: '/audio/duolingo_success.mp3' }, 
  { key: 'Iphone', id: 'Iphone Notification', src: '/audio/IPhone_Notification.mp3' },
  { key: 'Spaceline', id: 'Samsung Spaceline', src: '/audio/Spaceline.mp3' },
  { key: 'Discord', id: 'Discord Notification', src: '/audio/Discord notification.mp3' },
];

const DopamineMachine = () => {
  const [display, setDisplay] = useState('');
  const [shakeButton, setShakeButton] = useState(null);
  const [clickCounts, setClickCounts] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});
  const [isButtonVisible, setIsButtonVisible] = useState(false); // Stato per il pulsante scroll-to-top
  const clickLimit = 5; 
  const disableDuration = 60000; 

  const playSound = (key, id) => {
    if (!clickCounts[id]) {
      setClickCounts((prevCounts) => ({ ...prevCounts, [id]: 0 }));
    }

    if (clickCounts[id] >= clickLimit) {
      setDisplay(`Limit reached for ${id}! Wait for 1 minute.`);
      return;
    }

    const audio = document.getElementById(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play()
        .then(() => {
          setDisplay(id);
          setShakeButton(id);

          setClickCounts((prevCounts) => ({
            ...prevCounts,
            [id]: prevCounts[id] + 1,
          }));

          if (clickCounts[id] + 1 >= clickLimit) {
            setDisabledButtons((prevDisabled) => ({ ...prevDisabled, [id]: true }));
            setTimeout(() => {
              setDisabledButtons((prevDisabled) => ({ ...prevDisabled, [id]: false }));
              setClickCounts((prevCounts) => ({ ...prevCounts, [id]: 0 }));
              setDisplay(`${id} is now active again!`);
            }, disableDuration);
          }

          setTimeout(() => setShakeButton(null), 500);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          alert("Si è verificato un errore durante la riproduzione dell'audio.");
        });
    } else {
      console.error(`Audio element with key ${key} not found.`);
    }
  };

  // Gestisci la visibilità del pulsante per tornare in cima
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funzione per tornare in cima
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header>
        <div className="container header-content">
          <div className="logo">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              const userConfirmed = window.confirm("You are about to leave this site and will not be able to return directly. Do you want to proceed?");
              if (userConfirmed) {
                window.location.href = 'https://slipsintoslot.netlify.app/';
              }
            }}>
            </a>
          </div>

          <nav className="menu">
            <ul>
              <li>
                <button
                  className="header-button"
                  onClick={(e) => {
                    const functionalitySection = document.getElementById("functionality");
                    if (functionalitySection) {
                      functionalitySection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}                
                >
                  What is it for?
                </button>
              </li>
              <li>
                <button
                  className="header-button"
                  onClick={(e) => {
                    const userConfirmed = window.confirm("You are about to leave this site and will not be able to return directly. Do you want to proceed?");
                    if (userConfirmed) {
                      window.location.href = 'https://slipsintoslot.netlify.app/';
                    }
                  }}
                >
                  SlipsIntoSlot
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div id="dopamine-machine" className="container">
        <div id="display" className="display">{display}</div>
        <div className="drum-pads">
          {audioClips.map((clip) => (
            <div
              key={clip.key}
              className={`drum-pad ${shakeButton === clip.id ? 'shake' : ''}`} 
              id={clip.id}
              onClick={() => !disabledButtons[clip.id] && playSound(clip.key, clip.id)}
              style={disabledButtons[clip.id] ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              tabIndex="0"
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabledButtons[clip.id]) {
                  playSound(clip.key, clip.id);
                }
              }}
            >
              {clip.key}
              <audio className="clip" id={clip.key} src={clip.src}></audio>
            </div>        
          ))}
        </div>
      </div>

      <div id="functionality" className="functionality-section">
        <h2>What's Dopamine Machine for?</h2>
        <p>
          The Dopamine Machine can be used to reward yourself when you do something good for yourself, 
          for someone else, or for your career. <br />
          <br />
          Using the sound when performing a good deed will 
          trigger dopamine release, making you feel rewarded and motivating you to keep performing 
          benevolent actions for yourself or others.
          <br />
          <br />
          To avoid overuse and ensure a stronger impact, the button becomes temporarily disabled after 
          5 consecutive presses. It will re-enable after 1 minute, allowing for a more measured and 
          meaningful experience.
        </p>
      </div>

      {/* Footer with scroll-to-top button */}
      {isButtonVisible && (
        <footer className="footer">
          <button className="scroll-to-top" onClick={scrollToTop}>
            ↑
          </button>
        </footer>
      )}
    </>
  );
};

export default DopamineMachine;

