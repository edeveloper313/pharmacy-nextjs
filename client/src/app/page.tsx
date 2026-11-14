import { redirect } from 'next/navigation';

const Home = () => {
  // This will immediately redirect the user
  redirect('/authentication/sign-in');

  // This code below will never run, but is needed to satisfy TypeScript
  return null; 
}

export default Home;