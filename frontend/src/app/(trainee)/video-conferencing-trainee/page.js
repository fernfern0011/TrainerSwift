"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


export default function Page() {
  // TODO: get user input for room and name
  const room = "test";
  const [token, setToken] = useState("");
  const [checkToken, setCheckToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token')
    const traineeinfo = Cookies.get('traineeinfo')
    var traineeid
    var bookedby

    if (!token) {
      router.replace('/') // If no token is found, redirect to login page
      return
    }

    if (!(traineeinfo === undefined)) {
      traineeid = JSON.parse(traineeinfo)
    }

    setCheckToken(token)
    const fetchBookedBy = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/trainee-booking/${traineeid.traineeid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch trainer information');
        }
        const data = await response.json();
        console.log(data)
        bookedby = data.data.bookedby[0].bookedbyid;
        console.log(bookedby)

      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBookedBy();

    (async () => {
      try {
        const resp = await fetch(
          `http://localhost:3000/api/get-participant-token?room=${bookedby}&username=${traineeid.traineeid}`
          , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          });
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <div>
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={"wss://esd-4lxjb4te.livekit.cloud"}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
    </div>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
