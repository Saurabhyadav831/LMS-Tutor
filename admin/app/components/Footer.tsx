"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-[#111C43] text-white py-8 mt-20">
      <div className="w-[90%] m-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[25px] font-Poppins font-[600] text-white mb-4">
              ELearning
            </h3>
            <p className="text-[16px] font-Poppins font-[400] text-white opacity-80">
              ELearning is a platform for students to learn and get help from teachers.
            </p>
          </div>
          
          <div>
            <h4 className="text-[20px] font-Poppins font-[600] text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[16px] font-Poppins font-[400] text-white opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-[16px] font-Poppins font-[400] text-white opacity-80 hover:opacity-100 transition-opacity">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[16px] font-Poppins font-[400] text-white opacity-80 hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-[16px] font-Poppins font-[400] text-white opacity-80 hover:opacity-100 transition-opacity">
                  Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[20px] font-Poppins font-[600] text-white mb-4">
              Contact Info
            </h4>
            <p className="text-[16px] font-Poppins font-[400] text-white opacity-80 mb-2">
              Email: info@elearning.com
            </p>
            <p className="text-[16px] font-Poppins font-[400] text-white opacity-80">
              Phone: +1 234 567 890
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-[16px] font-Poppins font-[400] text-white opacity-80">
            © 2024 ELearning. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
