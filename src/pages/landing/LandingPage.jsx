import React from "react";
import Header from "../../components/header/Header";
import {
  SectionOne,
  SectionTwo,
  SectionThree,
  SectionFour,
  SectionFive,
  FAQSection,
  TrustedBy,
  Footer
} from "../../components/landingPageComponents/index";
import WidgetFAB from "@/components/reservationwidgets/WidgetFAB";
import WidgetEntry from "@/components/reservationwidgets/WidgetEntry";

const LandingPage = () => {
  return (
    <div className="font-inter overflow-x-hidden px-10">
      {/* <WidgetFAB /> */}
      <WidgetEntry />
      <div className="">
        <Header />
      </div>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <FAQSection />
      <TrustedBy />
      <Footer />
    </div>
  );
};

export default LandingPage;
