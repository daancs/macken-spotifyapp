import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Head from "next/head";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import type { Provider } from "next-auth/providers";


type HomeProps = {
  providers: Record<string, Provider>;
};

const Home: NextPage<HomeProps> = ({ providers }) => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Macken Spotify App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0a4a21] to-[#102615]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Log in to <span className="from-[#1ed760] text-transparent to-[#4cf3e5] bg-gradient-to-tl bg-clip-text">macken-spotify</span> App
          </h1>

          {providers ? Object.values(providers).map((provider) => (
            <div key={provider.name}>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <button className="flex text-white font-bold text-2xl w-[20vw] h-16 transition-all justify-center hover:bg-[rgba(20,20,20,0.9)] bg-[rgba(20,20,20,0.5)] p-4 items-center rounded-lg" onClick={() => signIn(provider.id, { callbackUrl: "/playback", redirect: false })}>
                Sign in with {provider.name}
              </button>
            </div>
          )) : ""}
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/playback" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers
    },
  }
}