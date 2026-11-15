import Link from "next/link";

import Image from "next/image";



const Logo = () => {
  return (
    <>
   <div className="flex items-center justify-center gap-2 mt-5 mb-5">
    <div className="relative h-16 w-16">
      <Image src="/images/logos/pharmacy-logo.png" alt="logo"  priority={true} className="object-contain object-center" fill={true}  />

    </div>
     <div>
       <h2 className="text-xl font-bold ">RxPilot </h2>
      
     </div>
   </div>
    </>
  );
};

export default Logo;
  