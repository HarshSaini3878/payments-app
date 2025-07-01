import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloud, FaArrowRight, FaChartLine, FaUsers, FaLock } from 'react-icons/fa';
import {Link} from "react-router-dom"
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
const LandingPage = () => {
  

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      api
        .get("/me", {
          headers: { Authorization: token },
        })
        .then((response) => {
          console.log(response.data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.log(error);
          setIsAuthenticated(false);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaCloud className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            PaySphere
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Testimonials'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-700 hover:text-indigo-600 transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-blue-600 transition duration-300 transform hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
           <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
  <Link
    to="/signup"
    className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-full hover:from-indigo-700 hover:to-blue-600 transition duration-300 transform hover:scale-105 text-center"
  >
    Sign Up / Sign In
  </Link>
  <button
    onClick={async () => {
      try {
       
        const response = await api.post("/user/signin", {
          email: "test@dtu.ac.in",
          password: "12345678",
        });
      const token = response.data.token;
      console.log(token,":token")
      localStorage.setItem("Authorization", `Bearer ${token}`);
      window.location.href = "/dashboard";
      } catch (error) {
        console.error("Test login failed:", error.response?.data || error.message);
        alert("Test login failed. Check console for details.");
      }
    }}
    className="bg-white text-indigo-600 px-6 py-2 rounded-full border border-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-105"
  >
    Sign in with Test Credentials
  </button>
</div>

          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-6 py-24 text-center relative overflow-hidden">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Simplify Your Payments
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Your Way.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Make secure transactions, manage your expenses, and connect with others effortlessly—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-3 rounded-full hover:from-indigo-700 hover:to-blue-600 transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <FaArrowRight className="ml-2 w-5 h-5" />
              </motion.a>
              <motion.a
                href="#features"
                className="bg-white text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition duration-300 border border-indigo-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg
              className="absolute w-full h-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#93C5FD"
                d="M41.2,-70.6C54.9,-64.1,68.1,-55.3,76.7,-42.9C85.3,-30.5,89.3,-15.2,88.2,-0.6C87.1,14,80.9,28,72.6,40.4C64.3,52.8,53.9,63.6,41.1,70.3C28.3,77,14.1,79.6,-0.7,80.9C-15.5,82.2,-31,82.2,-44.1,75.8C-57.2,69.4,-67.9,56.5,-75.1,42.1C-82.3,27.7,-86,13.9,-84.6,0.8C-83.2,-12.3,-76.8,-24.6,-69.1,-35.9C-61.5,-47.2,-52.7,-57.5,-41.4,-65.4C-30.1,-73.3,-15,-78.9,-0.2,-78.5C14.6,-78.1,29.2,-71.8,41.2,-70.6Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: FaLock, title: 'Secure Payments', description: 'End-to-end encryption ensures your transactions remain secure and private.' },
                { icon: FaChartLine, title: 'Expense Tracking', description: 'Stay on top of your finances with intuitive tracking tools and reports.' },
                { icon: FaUsers, title: 'Seamless Collaboration', description: 'Collaborate effortlessly with friends, family, or colleagues using payment links.' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <feature.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              How It Works
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { icon: FaCloud, title: '1. Create Account', description: 'Sign up and set up your profile with ease.' },
                { icon: FaArrowRight, title: '2. Send Requests', description: 'Request money with a few clicks from your contacts.' },
                { icon: FaArrowRight, title: '3. Add Funds', description: 'Add funds seamlessly to your account from multiple sources.' },
                { icon: FaArrowRight, title: '4. Make Payments', description: 'Pay for services or send money with a simple click.' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg max-w-xs text-center hover:shadow-xl transition duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <step.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              What Our Users Say
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { quote: "This app made my payments so much easier! The process is smooth and intuitive.", name: "John Doe", title: "Small Business Owner" },
                { quote: "I love the expense tracking feature! It's so easy to keep track of everything.", name: "Jane Smith", title: "Freelancer" },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-lg shadow-lg text-center max-w-xs"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <h4 className="font-bold text-indigo-600">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 PaymentsApp. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-indigo-300 hover:text-white mx-2">Privacy Policy</a>
            <a href="#" className="text-indigo-300 hover:text-white mx-2">Terms of Service</a>
            <a href="#" className="text-indigo-300 hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;









