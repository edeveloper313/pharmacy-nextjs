import Link from "next/link";

import Image from "next/image";



const Logo = () => {
  return (
    <div className="relative h-20 w-20">
      <Image src="/images/logos/pharmacy-logo.png" alt="logo"  priority={true} className="object-contain object-center" fill={true}  />
    </div>
  );
};

export default Logo;
  