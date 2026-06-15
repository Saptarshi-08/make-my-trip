import {
    markHelpful,
    flagReview
} from "@/api";

import ReviewReplyForm
    from "./ReviewReplyForm";

export default function ReviewCard({
    review,
    user,
    refreshReviews
}: any) {

    const helpful = async () => {

        await markHelpful(
            review.id
        );

        refreshReviews();
    };

    const flag = async () => {

        const reason =
            prompt(
                "Reason for flagging?"
            );

        if (!reason) return;

        await flagReview(
            review.id,
            reason
        );

        refreshReviews();
    };

    return (

        <div className="border rounded p-4 mb-4">

            <div className="flex justify-between">

                <div>

                    <h4 className="font-semibold">
                        {review.userName}
                    </h4>

                    <p>
                        {"⭐".repeat(review.rating)}
                    </p>

                </div>

                <span>
                    Helpful:
                    {" "}
                    {review.helpfulCount}
                </span>

            </div>

            <p className="mt-3">
                {review.reviewText}
            </p>
            {
                review.images?.length > 0 && (

                    <div className="flex gap-2 mt-3 flex-wrap">

                        {
                            review.images.map(
                                (
                                    image: string,
                                    index: number
                                ) => (

                                    <img
                                        key={index}
                                        src={image}
                                        alt="review"
                                        className="
                                w-24
                                h-24
                                object-cover
                                rounded
                            "
                                    />
                                )
                            )
                        }

                    </div>
                )
            }

            <div className="flex gap-3 mt-3">

                <button
                    onClick={helpful}
                    className="text-blue-500"
                >
                    Helpful
                </button>

                <button
                    onClick={flag}
                    className="text-red-500"
                >
                    Flag
                </button>

            </div>

            {
                review.replies?.map(
                    (reply: any, index: number) => (
                        <div
                            key={index}
                            className="ml-6 mt-3 p-3 bg-gray-50 rounded"
                        >

                            <b>
                                {reply.userName}
                            </b>

                            <p>
                                {reply.message}
                            </p>

                        </div>
                    )
                )
            }

            {
                user && (
                    <ReviewReplyForm
                        reviewId={review.id}
                        user={user}
                        refreshReviews={
                            refreshReviews
                        }
                    />
                )
            }

        </div>
    );
}