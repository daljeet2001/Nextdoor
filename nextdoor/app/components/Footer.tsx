"use client";

import { Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 ">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
     

          {/* Nextdoor Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Nextdoor</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <Link href="/find-neighborhood">Neighborhoods</Link>
          
            </ul>
          </div>

          {/* Neighbors */}
          {/* <div>
            <h4 className="font-semibold text-gray-900 mb-3">Neighbors</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Get Started</li>
              <li>Events</li>
              <li>Neighborhoods</li>
              <li>Guidelines</li>
            </ul>
          </div> */}

          {/* Partners */}
          {/* <div>
            <h4 className="font-semibold text-gray-900 mb-3">Partners</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Small Business</li>
              <li>Brands and Media Agencies</li>
              <li>Public Agencies</li>
              <li>Publishers</li>
              <li>Businesses on Nextdoor</li>
              <li>For Developers</li>
              <li>Agencies on Nextdoor</li>
            </ul>
          </div> */}

          {/* Industries & Legal */}
          {/* <div>
            <h4 className="font-semibold text-gray-900 mb-3">Industries</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Home & Garden</li>
              <li>Real Estate</li>
              <li>Professional Services</li>
              <li>Food & Entertainment</li>
              <li>Shopping & Retail</li>
              <li>Medical & Dental</li>
            </ul>
      
          </div> */}

          {/* <div>
            <h4 className="font-semibold text-gray-900  mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>Privacy</li>
              <li>Legal & Terms</li>
              <li>Cookies</li>
              <li>Self-Service Ad Terms</li>
            </ul>

          </div>  */}
         </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center   p-6 text-sm text-gray-600">
          <p>© Nextdoor 2025</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <Globe size={16} /> English (US)
            </button>
         
          </div>
        </div>
      </div>
    </footer>
  );
}
