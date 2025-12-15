import React from "react";
import Header from "../../components/common/Header";
import Hero from "../../components/home/Hero";
import Services from "../../components/home/Services";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import DownloadApp from "../../components/home/DownloadApp";
import Footer from "../../components/common/Footer";
import WhyChooseUs from './../../components/home/WhyChooseUs';

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <DownloadApp />
      <Footer />
    </div>
  );
}
