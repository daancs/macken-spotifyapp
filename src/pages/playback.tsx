import { type NextPage } from "next"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Page from "~/components/Page";
import { api } from "~/utils/api";
import Player from "~/components/Player"; // Import the Player component correctly




const Playback: NextPage = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const access_token = session?.user?.accessToken;
    console.log("before query")
    const { data: accessToken } = api.spotify.getAccessToken.useQuery({refresh_token: access_token!});
    console.log("after query")

    
    const handleSignOut =  () => {
        void signOut();
        void router.push("/");
    }

    

    return (
        <>
            <Page accessToken={accessToken?.access_token}/*bg-image={currentSongImage}*/>
                <button className="fixed top-2 left-2 m-4 p-3 rounded-full bg-green-500" onClick={() => handleSignOut()}>Sign out</button>
            {accessToken?.access_token ? 
                <Player accessToken={accessToken.access_token}></Player> 
                :
                <div className="text-white">no playback currently</div> 
                }
            </Page>
        </>
    )

}

export default Playback;