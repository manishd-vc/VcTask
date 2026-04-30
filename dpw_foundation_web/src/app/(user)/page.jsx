'use client';

import Hero from 'src/components/_main/home/hero';
import UpcomingEvents from 'src/components/_main/home/upcommingEvents';
import Volunteering from 'src/components/_main/home/volunteering';
import WelcomeDpwFoundation from 'src/components/_main/home/welcomeDpwFoundation';

/**
 * IndexPage Component
 *
 * This is the main landing page for the DPW Foundation website. It renders several key sections of the homepage
 * such as the hero section, welcome message, upcoming events, and volunteering opportunities.
 * Each component is responsible for displaying distinct parts of the homepage content.
 *
 * @returns {JSX.Element} The rendered IndexPage component containing all homepage sections
 */
export default function IndexPage() {
  return (
    <>
      <Hero />
      <WelcomeDpwFoundation />
      <UpcomingEvents />
      <Volunteering />
    </>
  );
}
