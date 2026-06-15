import { useState } from "react";
import { createReview } from "@/api";

export default function ReviewForm({
    targetType,
    targetId,
    user,
    refreshReviews,
}: any) {

    const [rating, setRating] = useState(5);

    const [reviewText, setReviewText] =
        useState("");
    const [images, setImages] =
        useState<string[]>([]);

    const submitReview = async () => {

        if (!user) {
            alert("Please login first");
            return;
        }
        console.log(user);

        try {

            await createReview({
                targetType,
                targetId,
                userId: user.id,
                userName:
                    `${user.firstName} ${user.lastName}`,
                rating,
                reviewText,
                images
            });

            setReviewText("");

            refreshReviews();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <h3 className="font-bold text-lg mb-4">
                Write a Review
            </h3>

            <div className="mb-4">

                <label className="block mb-2">
                    Rating
                </label>

                <select
                    className="border p-2 rounded"
                    value={rating}
                    onChange={(e) =>
                        setRating(
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                </select>

            </div>

            <textarea
                className="border w-full p-3 rounded"
                rows={4}
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) =>
                    setReviewText(e.target.value)
                }
            />
            <input
                type="file"
                multiple

                onChange={(e) => {

                    const files =
                        Array.from(
                            e.target.files || []
                        );

                    files.forEach((file) => {

                        const reader =
                            new FileReader();

                        reader.onload = () => {

                            setImages(prev => [
                                ...prev,
                                reader.result as string
                            ]);
                        };

                        reader.readAsDataURL(
                            file
                        );
                    });
                }}
            />

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={submitReview}
            >
                Submit Review
            </button>

        </div>
    );
}