import React from 'react';
import Header from './header';
import Features from './features';
import Team from './Team';
import JsonData from './data.json';
import './css/bootstrap.scoped.css';
import './css/style.scoped.css';

const LandingPage = () => {
  const [landingPageData, setLandingPageData] = React.useState(JsonData);
  return (
    <div>
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <Team data={landingPageData.Team} />
    </div>
  );
};

export default LandingPage;
