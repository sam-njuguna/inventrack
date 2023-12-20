import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import Loader from "./components/Loader";
import { AnimatePresence, motion } from "framer-motion";

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer); 
  }, []);
  return (
    <AnimatePresence>
      {loading ? (
        <Loader />
      ) : (
        <div className="content">
          <Main />
        </div>
      )}
    </AnimatePresence>
  );
};

export default App;
