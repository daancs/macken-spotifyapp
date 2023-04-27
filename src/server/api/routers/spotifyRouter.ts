/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AccessToken, type CurrentlyPlaying } from "spotify-types";

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


export const spotifyRouter = createTRPCRouter({
    getAccessToken: protectedProcedure.query(async ({ctx}) => {
        const refreshToken = ctx.session.user.accessToken;
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET!}`).toString("base64")}`,
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        });
        if (!response) {
            throw Error("No response from Spotify");
        }
        const data = await response.json() as AccessToken;

        console.log("json data: ", data)

        return data;
    }),
    getCurrentSong: protectedProcedure.input(z.object({ access_token: z.string() }))
    .query(async ({ctx, input}) => {
        const data = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${input.access_token}`,
            },
        });

        console.log("currebtly playing: ", data)

        const res = await data.json() as CurrentlyPlaying;

        console.log("res: ", res)
        return res;
    }),
    
});