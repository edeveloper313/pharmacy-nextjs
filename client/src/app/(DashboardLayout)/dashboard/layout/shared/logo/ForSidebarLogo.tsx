import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  isSidebarOpen?: boolean;
}

const Logo = ({ isSidebarOpen = true }: LogoProps) => {
  return (
    <Link 
      href="/" 
      className={`flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} gap-2 mt-4 mb-4 w-full transition-all duration-300`}
    >
      {/* Logo Image Container */}
      <div className={`relative shrink-0 transition-all duration-300 ${isSidebarOpen ? 'h-12 w-12' : 'h-10 w-10'}`}>
        <Image 
          src="/images/logos/pharmacy-logo.png" 
          alt="logo"  
          priority={true} 
          className="object-contain object-center" 
          fill={true}  
        />
      </div>
      
      {/* Text: Sirf tab show hoga jab sidebar open ho */}
      {isSidebarOpen && (
        <div className="overflow-hidden whitespace-nowrap">
          <h2 className="text-xl font-bold">RxPilot</h2>
        </div>
      )}
    </Link>
  );
};

export default Logo;