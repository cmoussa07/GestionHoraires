import React from "react";
import Navbar from "./composants/Navbar";
import Hero from "./composants/Hero";
import Features from "./composants/Features";
import UserRoles from "./composants/UserRoles";
import DashboardSection from "./composants/DashboardSection";
import Processus from "./composants/Processus";
import Footer from "./composants/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <UserRoles />
      <DashboardSection />
      <Processus />
      <Footer />
    </div>
  );
}

export default LandingPage;
