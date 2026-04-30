'use client';
import PropTypes from 'prop-types';

// mui

// components
import Scrollbar from 'src/components/Scrollbar';
import Footer from './footer';
import Navbar from './navbar';

export default function MiniDrawer({ children }) {
  return (
    <Scrollbar
      sx={{
        height: 1
      }}
    >
      <Navbar />
      {children}
      <Footer />
    </Scrollbar>
  );
}
MiniDrawer.propTypes = {
  children: PropTypes.node.isRequired
};
