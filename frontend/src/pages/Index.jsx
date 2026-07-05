import Navbar from "./landing/composants/Navbar";
import Hero from "./landing/composants/Hero";
import Features from "./landing/composants/Features";
import UserRoles from "./landing/composants/UserRoles";
import DashboardSection from "./landing/composants/DashboardSection";
import Processus from "./landing/composants/Processus";
import Footer from "./landing/composants/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <UserRoles />
        <DashboardSection />
        <Processus />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
