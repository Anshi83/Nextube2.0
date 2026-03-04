import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import axios from "axios";
interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  city?: string; // EDITED: Added city
}
const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [dislikes, setDislikes] = useState<{ [key: string]: number }>({});
  const [translatedComments, setTranslatedComments] = useState<{
    [key: string]: string;
  }>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  

  const fetchedComments = [
    {
      _id: "1",
      videoid: videoId,
      userid: "1",
      commentbody: "Great video! Really enjoyed watching this.",
      usercommented: "John Doe",
      commentedon: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "2",
      videoid: videoId,
      userid: "2",
      commentbody: "Thanks for sharing this amazing content!",
      usercommented: "Jane Smith",
      commentedon: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading history...</div>;
  }
  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
// --- EDITED: Special Character Validation ---
const specialCharRegex = /[^a-zA-Z0-9\s.,!?]/;
if (specialCharRegex.test(newComment)) {
  alert("Special characters are not allowed in comments.");
  return;
}
// --------------------------------------------
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
      });
      if (res.data.comment) {
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: newComment,
          usercommented: user.name || "Anonymous",
          commentedon: new Date().toISOString(),
        };
        setComments([newCommentObj, ...comments]);
      }
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingCommentId) return; // Added check for ID
    try {
      const res = await axiosInstance.post(
        `/comment/editcomment/${editingCommentId}`,
        { commentbody: editText }
      );
      
      // Check if res.data exists (Backend returns the updated comment object)
      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            // Update the specific comment in the list with the new text
            c._id === editingCommentId ? { ...c, commentbody: editText } : c
          )
        );
        setEditingCommentId(null);
        setEditText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      
      // Ensure we remove it from the UI immediately if the request is successful
      if (res.status === 200) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  {/*const handleDislike = (id: string) => {
    setDislikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };*/}
  const handleDislike = async (id: string) => {
    const newCount = (dislikes[id] || 0) + 1;
    
    // --- EDITED: Auto-Delete if 2 dislikes ---
    if (newCount >= 2) {
      alert("Comment removed due to 2 dislikes.");
      handleDelete(id); 
    } else {
      setDislikes((prev) => ({ ...prev, [id]: newCount }));
    }
    // -----------------------------------------
  };

  // frontend/comments.tsx

const handleTranslate = async (comment: any) => {
  // Prevent clicking again while already translating
  if (translatingId === comment._id) return;

  setTranslatingId(comment._id); // Start loading state
  try {
    const res = await axiosInstance.post("/comment/translate", {
      text: comment.commentbody,
      targetLang: selectedLanguage, // Uses the selected language from state
    });

    if (res.data && res.data.translatedText) {
      setTranslatedComments((prev) => ({
        ...prev,
        [comment._id]: res.data.translatedText,
      }));
    }
  } catch (error: any) {
    console.error("Translation error", error);
    // Show a user-friendly alert instead of just crashing
    const errorMsg = error.response?.data?.message || "Translation failed. Try again later.";
    alert(errorMsg);
  } finally {
    setTranslatingId(null); // Stop loading state
  }
};
  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) => setNewComment(e.target.value)}
              className="min-h-20 resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.usercommented}
                    {/* --- EDITED: Show City --- */}
                  <span className="ml-2 text-xs text-blue-500">({comment.city || "Unknown"})</span>
                  {/* ------------------------- */}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleUpdateComment}
                        disabled={!editText.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">
                      {translatedComments[comment._id] || comment.commentbody}
                    </p>

                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <button onClick={() => handleLike(comment._id)}>
                        👍 {likes[comment._id] || 0}
                      </button>

                      <button onClick={() => handleDislike(comment._id)}>
                        👎 {dislikes[comment._id] || 0}
                      </button>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="ar">Arabic</option>
                        <option value="ru">Russian</option>
                        <option value="zh-cn">Chinese</option>
                      </select>

                      <button
                        onClick={() => handleTranslate(comment)}
                        disabled={translatingId === comment._id}
                      >
                        {translatingId === comment._id
                          ? "Translating..."
                          : "🌍 Translate"}
                      </button>
                    </div>

                    {comment.userid === user?._id && (
                      <div className="flex gap-2 mt-2 text-sm text-gray-500">
                        <button onClick={() => handleEdit(comment)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(comment._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
