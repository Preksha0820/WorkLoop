import React from 'react';
import { Hero, Inside, Features, Companies, Demo } from '../components/HomeComponents';

const Home = () => {
  return (
    <div>
      <div id="hero">
        <Hero />
      </div>
      <div id="inside">
        <Inside />
      </div>
      <div id="companies">
        <Companies />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="book-demo">
        <Demo />
      </div>
    </div>
  );
};

export default Home;
