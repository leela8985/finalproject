import React from 'react';
import image3 from '../images/anubabu3.png';
import image4 from '../images/vision1.png';
import image5 from '../images/mission1.png';
import image6 from '../images/maps.png';
import image7 from '../images/college_logo.png';
import '../styles/MainHome.css'


function MainHome() {
  return (
    <div className="main">
      <header className="header">
        <img src={image7} alt="logo" />
        <h5>ADARSH COLLEGE OF ENGINEERING</h5>
    </header>
    <br /><br />
      <div className="college" id="college">
        <h1>ADARSH COLLEGE OF ENGINEERING</h1>
        <p>NH-216,Gollaprolu , Near Kakinada, Chebrolu, Andhra Pradesh 533449, India</p>
        <a href="/login">
        <button>Login</button>
        </a>
        
      </div>
      <div className="more-about">
      <img src={image3} alt="Chairman" />
      <div className="about"id="about">
      <h1>ABOUT <span>ADARSH </span> </h1>
      <p>Adarsh College of Engineering is a private engineering college located in Chebrolu, Andhra Pradesh, India. It was established in 2008 and is affiliated with Jawaharlal Nehru Technological University, Kakinada. The college offers undergraduate and postgraduate courses in engineering. The college is accredited by the National Board of Accreditation (NBA) and is approved by the All India Council for Technical Education (AICTE).
      </p>
      <p style={{}}>Sri Burra Anubabu MBA from the village Mallaam of Pithapuram constituency, East Godavari District. Hailing from a very well known family which is known for its charity and service. Sri Burra Anubabu had a rich experience in varied fields. 
His leadership qualities and managerial skills which were being exhibited from his student life fetched him many more people to him. 
Technical Education is the backbone of every nation and is the stepping stone for a country to move into the niche of a developed nation. Adarsh Educational Society has been contributing in the mission of transforming rural India into developed nation by running Adarsh College of engineering with innovation, creativity, human intelligence and patience. 
"Service to Human being is Service to God". 
It gives me immense pleasure in welcoming you to Adarsh College of engineering. 
Our vision is to create an institution par excellence with innovative concepts for imparting quality education and enable our students serve the society better. 
At Adarsh, we have taken every possible step to develop the necessary infrastructure, technology, facilities, curriculum and extracurricular activities. 
</p>
      </div>
      </div>
      <div className="more-about" >
      <img style={{float: 'right', height: '320px'}} src={image4} alt="vision" />
      <div className="about">
      <h1>OUR <span>VISION</span></h1>
        <p>Our vision is to create an institution par excellence with innovative concepts for imparting quality education and enable our students serve the society better.</p>
        <p>ACEE envisions to become a world className technical institution whose students achieve excellence in technical education, with realized social responsibilities to combat the current and impending challenges faced by the industry and the nation. 
"To be a leader in transforming lives through an innovative, rigorous, and compassionate approach to education." 
Known as an institution that "makes a difference" Education with compassion "acknowledging the whole person, working with integrity, caring, accepting people moving forward with standards and expectations; bringing joy, honesty and understanding with achievements". 
That's why you should focus with success team.</p>
        </div>
      </div>
      <div className="more-about">
      <img style={{float: 'left', height: '320px'}} src={image5} alt="vision" />
      <div className="about">
        <h1>OUR<span> MISSION</span></h1>
        <p>Our mission is to produce world-className professionals by encouraging leadership, entrepreneurship through high quality education and training with a relentless focus on their personality development Objectives... Adarsh Educational Society is established for producing quality human resource with a human endeavour and humanistic approach. </p>
        <p>ACEE, a premier institution for advance learning & research, created to impart technical & management education relevant to professional & entrepreneurial development in India. The founders of ACEE include some of the finest brains in academia and industry. They felt the need of centre of excellence that would complement the rising technical & managerial industry in present era. With this vision, ACEE strives to promote universal recognized technical & management education by aligning academic theory, industrial knowledge & business practices. The curriculum, which has the string global perspective, prepares students to manage, lead & succeed in the increasingly competitive business environment. The institution has close association with the industry. ACEE provides state of the art infrastructure, qualified & experienced faculty, and innovative, contemporary programs for the all-round development of the students.</p>
        </div>
      </div>
      <section className="contact" id="contact">
        <div className="contact-text">
          <h1>CONTACT<span> US</span></h1>
          <p>ADARSH COLLEGE OF ENGINEERING</p>
          <p>NH-216,Gollaprolu , Near Kakinada, Chebrolu, Andhra Pradesh 533449, India</p>
          <p>Email: adarshedu@gmail.com</p>
          <p>Phone: 08869-253766</p>
        </div>
        <div className="map">
          <form>
            <br />
            <br /><br />
            <a href="https://www.google.com/maps/place/Adarsh+College+of+Engineering/@16.973679,82.224658,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35f2c7d8e9b2b5:0x7f8a0c4e2d6f8c9b!8m2!3d16.973679!4d82.224658!16s%2Fg%2F11c1gqjv_5?entry=ttu" target="_blank" rel="noopener noreferrer">
            <img src={image6} alt="map" />
            </a>
          </form>
        </div>
      </section>
    
      <div className="last-text"> 
        <p>Developed by  M Chiranjeevi & K Leelamohan  © 2025</p>
    </div>
    </div>
  );
}

export default MainHome;