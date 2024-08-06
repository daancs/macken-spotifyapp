
import { type Track } from "spotify-types";
import { api } from "~/utils/api";
import Image from 'next/image';

interface PlayerProps {
    accessToken: string
}

const Player = (access_token: PlayerProps) => {


    const { data: currentlyPlaying } = api.spotify.getCurrentSong.useQuery({ access_token: access_token.accessToken });

    // console.log("artist: ", currentlyPlaying?.item?.artists[0]?.name)


    if (currentlyPlaying?.currently_playing_type === 'track') {
        currentlyPlaying.item = currentlyPlaying?.item as Track;
        return (
            <>
                <div className="flex mb-32 w-[15%] h-[15%] flex-col p-4 justify-evenly items-center bg-[#222] rounded-xl">
                    <div className="text-white font-bold truncate max-w-full">{currentlyPlaying?.item?.name}</div>

                    {currentlyPlaying.item?.artists ?
                        <div className="text-white flex flex-wrap">{currentlyPlaying.item?.artists.map((artist, index) => ((index ? ', ' : '') + artist.name))}</div>
                        :
                        <div className="text-white">No artist found</div>
                    }
                    <div className="flex justify-evenly content-evenly items-center w-full">
                            <Image src="/previous.svg" width={200} height={200} alt="previousbutton" className="max-w-[40px] filter invert-[100%]" />
                            <Image src="/play.svg" width={200} height={200} alt="playbutton" className="max-w-[40px] filter invert-[100%]" />
                            <Image src="/next.svg" width={200} height={200} alt="nextbutton" className="max-w-[40px] filter invert-[100%]" />
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div>Nothing currently playing</div>
            </>
        )
    }
}

export default Player;