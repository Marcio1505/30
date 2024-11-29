import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import './components/@vuexy/rippleButton/RippleButton';

import 'react-perfect-scrollbar/dist/css/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

const App = () => {
  useEffect(() => {
    // const script = document.createElement('script');
    // script.id = 'ze-snippet';
    // script.src =
    //   'https://static.zdassets.com/ekr/snippet.js?key=67653946-2db6-43ca-8ee4-b8c6344448d8';
    // script.async = true;
    // document.body.appendChild(script);
    // // return () => {
    // //   document.body.removeChild(script);
    // // };
  }, []);
  return <AppRouter />;
};

export default App;
