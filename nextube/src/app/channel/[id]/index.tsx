import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideo from "@/components/ChannelVideo";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user} = useUser();
  // const user = {
  //   id: "1",
  //   name: "anshi",
  //   email: "svhsvcsd@gmail.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  try {
    let channel = user;
    //     id:id,
    //     name:"my channel",
    //     email:"xyz@gmail.com",
    //     description:"welcome to my channel,technology...i welcome oyou all her with love",
    //     joinedOn: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    // };
   //if (!channel){
    //notFound();
   //}
    const videos = [
      {
        _id: "1",
        videotitle: "Amazing Nature Documentary",
        filename: "nature-doc.mp4",
        filetype: "video/mp4",
        filepath: "/videos/nature-doc.mp4",
        filesize: "500MB",
        videochanel: "Nature Channel",
        Like: 1250,
        views: 45000,
        uploader: "nature_lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        videotitle: "Cooking Tutorial: Perfect Pasta",
        filename: "pasta-tutorial.mp4",
        filetype: "video/mp4",
        filepath: "/videos/pasta-tutorial.mp4",
        filesize: "300MB",
        videochanel: "Chef's Kitchen",
        Like: 890,
        views: 23000,
        uploader: "chef_master",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    return (
        <div className="flex-1 min-h-screen bg-white">
          <div className="max-w-full mx-auto">
            <ChannelHeader channel={channel} user={user} />
            <Channeltabs/>
            <div className="px-4 pb-8">
            <VideoUploader channelId={id} channelName={channel?.channelname} />
          </div>
          <div className="px-4 pb-8">
            <ChannelVideo videos={videos} />
          </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error fetching channel data:", error);
   
    }
  
  
};

export default index;