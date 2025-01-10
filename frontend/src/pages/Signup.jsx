import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
      <form className="space-y-4">
       
      
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account? <Link to="/signin" className="text-green-500 hover:underline">SignIn</Link>
      </p>
    </div>
  </div>
  )
}

export default Signup
