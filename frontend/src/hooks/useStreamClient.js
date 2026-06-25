import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { sessionApi } from "../api/sessions";
import { disconnectStreamClient, initializeStreamClient } from "../lib/stream";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  const callId = session?.callId;
  const status = session?.status;

  // guards against the cleanup function running its teardown logic twice
  // (e.g. once from a status change, once from unmount)
  const hasCleanedUpRef = useRef(false);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let cancelled = false;
    hasCleanedUpRef.current = false;

    const initCall = async () => {
      if (!callId) return;
      if (!isHost && !isParticipant) return;
      if (status === "completed") return;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (cancelled) return;
        setStreamClient(client);

        videoCall = client.call("default", callId);
        await videoCall.join({ create: true });
        if (cancelled) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (cancelled) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", callId);
        await chatChannel.watch();
        if (cancelled) return;
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup - runs when the session ends (status changes) or component unmounts
    return () => {
      cancelled = true;
      if (hasCleanedUpRef.current) return;
      hasCleanedUpRef.current = true;

      // clear React state immediately so no component keeps rendering/using
      // a call or channel that's about to be disconnected
      setCall(null);
      setChannel(null);
      setChatClient(null);
      setStreamClient(null);

      // iife
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
        } catch (error) {
          console.error("Error leaving call during cleanup:", error);
        }
        try {
          if (chatClientInstance) await chatClientInstance.disconnectUser();
        } catch (error) {
          console.error("Error disconnecting chat client during cleanup:", error);
        }
        try {
          await disconnectStreamClient();
        } catch (error) {
          console.error("Error disconnecting stream client during cleanup:", error);
        }
      })();
    };
    // only re-run when the call id, status, or role actually changes —
    // not on every 5s session refetch poll
  }, [callId, status, loadingSession, isHost, isParticipant, session]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;















// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { StreamChat } from "stream-chat";
// import { sessionApi } from "../api/sessions";
// import { disconnectStreamClient, initializeStreamClient } from "../lib/stream";

// function useStreamClient(session, loadingSession, isHost, isParticipant) {
//   const [streamClient, setStreamClient] = useState(null);
//   const [call, setCall] = useState(null);
//   const [chatClient, setChatClient] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [isInitializingCall, setIsInitializingCall] = useState(true);

//   useEffect(() => {
//     let videoCall = null;
//     let chatClientInstance = null;

//     const initCall = async () => {
//       if (!session?.callId) return;
//       if (!isHost && !isParticipant) return;
//       if (session.status === "completed") return;

//       try {
//         const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

//         const client = await initializeStreamClient(
//           {
//             id: userId,
//             name: userName,
//             image: userImage,
//           },
//           token
//         );

//         setStreamClient(client);

//         videoCall = client.call("default", session.callId);
//         await videoCall.join({ create: true });
//         setCall(videoCall);

//         const apiKey = import.meta.env.VITE_STREAM_API_KEY;
//         chatClientInstance = StreamChat.getInstance(apiKey);

//         await chatClientInstance.connectUser(
//           {
//             id: userId,
//             name: userName,
//             image: userImage,
//           },
//           token
//         );
//         setChatClient(chatClientInstance);

//         const chatChannel = chatClientInstance.channel("messaging", session.callId);
//         await chatChannel.watch();
//         setChannel(chatChannel);
//       } catch (error) {
//         toast.error("Failed to join video call");
//         console.error("Error init call", error);
//       } finally {
//         setIsInitializingCall(false);
//       }
//     };

//     if (session && !loadingSession) initCall();

//     // cleanup - performance reasons
//     return () => {
//       // iife
//       (async () => {
//         try {
//           if (videoCall) await videoCall.leave();
//           if (chatClientInstance) await chatClientInstance.disconnectUser();
//           await disconnectStreamClient();
//         } catch (error) {
//           console.error("Cleanup error:", error);
//         }
//       })();
//     };
//   }, [session, loadingSession, isHost, isParticipant]);

//   return {
//     streamClient,
//     call,
//     chatClient,
//     channel,
//     isInitializingCall,
//   };
// }

// export default useStreamClient;