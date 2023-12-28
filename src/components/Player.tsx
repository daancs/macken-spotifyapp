
import { api } from "~/utils/api";

interface PlayerProps {
    accessToken: string
}

const Player = (access_token: PlayerProps) => {



    const {data: currentlyPlaying} = api.spotify.getCurrentSong.useQuery({access_token: access_token.accessToken});


    if (!currentlyPlaying) {
        return (
            <>
                <div>Nothing currently playing</div>
            </>
        )
    }
    return (
        <>
            <div>{currentlyPlaying?.item?.name}</div>
        </>
    )
}

export default Player;