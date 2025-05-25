import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedTools } from '../components/home/FeaturedTools';
import { CategorySection } from '../components/home/CategorySection';
import { WorkflowSection } from '../components/home/WorkflowSection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { CallToAction } from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedTools />
      <CategorySection />
      <WorkflowSection />
      <TestimonialSection />
      <CallToAction />
    </div>
  );
};

export default HomePage;