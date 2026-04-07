import React from 'react';

import HeroSection from '../../components/user/homePage/HeroSection';
import CarouselSection from '../../components/user/homePage/CarouselSection';
import FeaturedReads from '../../components/user/homePage/FeaturedReads';
import FAQSection from '../../components/user/homePage/FAQSection';




const HomePage = () => {
  return (
    <>     
     <HeroSection />
      <CarouselSection />
      <FeaturedReads />
      <FAQSection />
    
    </>
  );
};

export default HomePage;
