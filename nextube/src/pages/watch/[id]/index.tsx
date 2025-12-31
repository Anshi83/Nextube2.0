import RelatedVideos from "@/components/RelatedVideos";
import Videoinfo from "@/components/Videoinfo";
import Videoplayer from "@/components/Videoplayer";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const relatedVideos = [
    {
      _id: "1",
      videotitle: "Amazing Nature Documentary",
      filename: "nature-doc.mp4",
      filetype: "video/mp4",
      filepath: "/videos/nature-doc.mp4",
      filesize: "500MB",
      videochanel: "Nature Channel",
      Like: 1250,
      Dislike: 50,
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
      Dislike: 20,
      views: 23000,
      uploader: "chef_master",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  const video = useMemo(() => {
    const stringid = Array.isArray(id) ? id[0] : id;
    return relatedVideos.find((video) => video._id === stringid);
  }, [id]);
  if (!video) {
    return <div>video not found</div>;
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl max-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videoplayer video={video} />
            <Videoinfo video={video} />
            {/*<Comments videoId={id} />*/}
          </div>
          <div className="space-y-4">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
