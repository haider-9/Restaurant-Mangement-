import { Mail, Phone, User } from 'lucide-react';
import MainButton from '../../common/buttons/MainButton'; 
import Logo from '../../../assets/images/landing/textLogo.svg'; 

const Footer = () => {
  return (
    <footer id='contact' className="w-full">

      {/* Top Section */}
      <div className="bg-primary text-white px-6 py-10 rounded-2xl">
        <div className="max-w-7xl mx-auto flex flex-col justify-between items-center gap-6">
          
          {/* Left - Trusted Profiles */}
          <div className="hidden md:flex items-center ">
            {[1, 2, 3].map((_, idx) => (
              <User key={idx} className={`w-7 h-7 bg-white text-primary border-2 border-primary rounded-full p-1 ${idx > 0 ? '-ml-2' : ''}`} />
            ))}
            <span className="ml-2 font-light text-sm">Trusted by millions worldwide</span>
          </div>

          {/* Center - Heading */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Streamline Your Restaurant Operations with <span className="">Diniiz</span>
            </h3>
          </div>

          {/* Right - Sign Up Button */}
          <MainButton radius='rounded-lg' className='bg-white text-textPrimary text-xs md:text-sm cursor-pointer px-4 shadow-none'>Sign Up for Free</MainButton>
        </div>
      </div>

      {/* Bottom Section */}
      <div className=" px-6 pt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:items-start gap-12 md:flex-row md:justify-between mb-5">

          {/* Left - Contact Info */}
          <div className="flex md:flex-col gap-4 justify-center w-full md:w-1/3 lg:w-1/4">
            <img src={Logo} alt="Diniiz Logo" className="w-20 md:w-32" />
            <div className="flex flex-col md:items-start gap-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className='text-primary'/>
                <span className='text-xs'>support@diniiz.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className='text-primary'/>
                <span className='text-xs'>+1 (800) 555-1234</span>
              </div>
            </div>
          </div>

          {/* Center - Links */}
          <div className="grid grid-cols-3 gap-8 md:w-1/3 text-xs lg:w-2/4 lg:text-sm">
            <div>
              <h4 className="font-semibold mb-2">Links</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Overview</li>
                <li>Features</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1 text-gray-600">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resources</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Help Center</li>
                <li>Terms of Use</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          {/* Right - Newsletter */}
          <div className="flex flex-col gap-3 md:w-1/3 lg:w-1/4">
            <h4 className="font-semibold text-textPrimary text-lg">Newsletter</h4>
            <p className="text-xs text-textSecondary">Stay up to date</p>
            <div className="flex border border-gray-300 justify-between rounded-full ">
              <input
                type="email"
                placeholder="Your email"
                className="w-8/12 px-4 py-2 text-sm outline-none"
              />
              <button className="bg-primary text-white rounded-full px-4 text-sm ">Subscribe</button>
            </div>
          </div>
        </div>

        <div className='border-b border-b-gray-300'/>

        <div className='flex items-center justify-center p-5 text-xs md:text-sm'>
            <p>Copyright ⓒ 2025 By Synctom. All rights reserved</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
