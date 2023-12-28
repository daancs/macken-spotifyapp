/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { access } from "fs";
import { signOut } from "next-auth/react";
import { type AccessToken, type CurrentlyPlaying, type Device } from "spotify-types";

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id!}:${client_secret!}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';


export const spotifyRouter = createTRPCRouter({


    getAccessToken: protectedProcedure.input(z.object({refresh_token: z.string()}))
    .query(async ({ctx, input}) => {
        // const refreshToken = ctx.session.user.refreshToken;
        const refresh_token = input.refresh_token
        if (process.env.SPOTIFY_CLIENT_ID === undefined || process.env.SPOTIFY_CLIENT_SECRET === undefined) {
            throw Error("No env variables for spotify client id or secret");
        }

        console.log("refresh token: ",refresh_token)

        const response = await fetch(TOKEN_ENDPOINT, { 
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
              }),
            })
        

        console.log("response: ", response)

        if (response.status === 401) {
            await signOut()
            throw Error("Unauthorized");
        }


        console.log("response", response)

        if (!response) {
            throw Error("No response from Spotify");
        }


        const data = await response.json() as AccessToken;

        if (!data.access_token) {
            throw Error("Access token not found in response");
        }

        console.log("access token: ", data.access_token)

        console.log("json data: ", data)

        return data;
    }),
    


    getPlaybackState: protectedProcedure.input(z.object({ access_token: z.string() }))
    .query(async ({ctx, input}) => {
        // if (!input.access_token) {
        //     throw Error("No access token provided");
        // }
        // console.log("access token backend: ", input.access_token)

        const access_token = input.access_token

        const data = await fetch("https://api.spotify.com/v1/me/player", {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });


        console.log("playback state: ", data)

        if (data.status === 204) {
            return false
        } else {
            return true
        }
    }),



    getCurrentSong: protectedProcedure.input(z.object({ access_token: z.string() }))
    .query(async ({ctx, input}) => {
        const access_token = input.access_token
        const data = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });

        console.log("currently playing: ", data)
        if (data.status === 204) {
            throw Error("Playback is not active or unavailable")
        }

        const res = await data.json() as CurrentlyPlaying;

        console.log("res: ", res)
        return res;
    }),
    
});