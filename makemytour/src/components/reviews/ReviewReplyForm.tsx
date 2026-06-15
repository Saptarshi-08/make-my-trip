import { useState } from "react";
import { addReply } from "@/api";

export default function ReviewReplyForm({
    reviewId,
    user,
    refreshReviews,
}: any) {

    const [message, setMessage] =
        useState("");

    const submitReply = async () => {

        if (!user) {
            return;
        }

        await addReply(
            reviewId,
            {
                userId: user.id,
                userName:
                    `${user.firstName} ${user.lastName}`,
                message
            }
        );

        setMessage("");

        refreshReviews();
    };

    return (
        <div className="mt-3">

            <textarea
                className="border w-full p-2 rounded"
                rows={2}
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            />

            <button
                className="bg-gray-800 text-white px-3 py-1 rounded mt-2"
                onClick={submitReply}
            >
                Reply
            </button>

        </div>
    );
}