import { Track } from "spotify-types";
import { api } from "~/utils/api";

interface PageProps {
  blackout?: boolean
  children?: React.ReactNode
  currentSongImage?: string
  accessToken?: string
}

export default function Page(props: PageProps) {

  const { accessToken } = props;
  const { data: currentSong } = api.spotify.getCurrentSong.useQuery({access_token: accessToken!});
  let currentSongImage = "/mkloggabla.png";

  if (currentSong?.currently_playing_type === "track") {
    const currentSongItem = currentSong.item as Track;
    currentSongImage = currentSongItem.album.images[0]!.url;
  } else if (currentSong?.currently_playing_type === "episode") {
    const currentSongItem = currentSong.item as Track;
    currentSongImage = currentSongItem.album.images[0]!.url;
  }

  return (
    <>
      {/* Background */}
      <div className="fixed w-screen h-screen bg-black overflow-hidden flex flex-col items-cente -z-50">
        <div style={{backgroundImage: `url(${currentSongImage})`}} className={`bg-cover bg-center w-full h-full blur-lg`}></div>
      </div>

      {props.children ? props.children : ""}


    </>
  )

}