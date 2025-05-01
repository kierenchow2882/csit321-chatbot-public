import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Testimonials } from '../components/Testimonials';
import { Cta } from '../components/Cta';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Cta />
    </>
  );
};

export default HomePage;
