import { useState } from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewList({
    reviews,
    user,
    refreshReviews
}: any) {

    const [ratingFilter, setRatingFilter] =
        useState("ALL");

    const [photoOnly, setPhotoOnly] =
        useState(false);

    const filteredReviews =
        reviews.filter((review: any) => {

            const matchesRating =
                ratingFilter === "ALL"
                    ? true
                    : review.rating === Number(ratingFilter);

            const matchesPhoto =
                !photoOnly
                    ? true
                    : Array.isArray(review.images) &&
                    review.images.length > 0;

            return (
                matchesRating &&
                matchesPhoto
            );
        });

    return (
        <div>

            {/* FILTERS */}

            <div className="flex gap-4 mb-4 flex-wrap">

                <select
                    value={ratingFilter}
                    onChange={(e) =>
                        setRatingFilter(
                            e.target.value
                        )
                    }
                    className="border p-2 rounded"
                >
                    <option value="ALL">
                        All Ratings
                    </option>

                    <option value="5">
                        5 Stars
                    </option>

                    <option value="4">
                        4 Stars
                    </option>

                    <option value="3">
                        3 Stars
                    </option>

                    <option value="2">
                        2 Stars
                    </option>

                    <option value="1">
                        1 Star
                    </option>
                </select>

                <label
                    className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    "
                >
                    <input
                        type="checkbox"
                        checked={photoOnly}
                        onChange={(e) =>
                            setPhotoOnly(
                                e.target.checked
                            )
                        }
                    />

                    Reviews With Photos
                </label>

            </div>

            {
                filteredReviews.length === 0 &&
                (
                    <p>
                        No Reviews Found
                    </p>
                )
            }

            {
                filteredReviews.map(
                    (review: any) => (
                        <ReviewCard
                            key={review.id || review._id}
                            review={review}
                            user={user}
                            refreshReviews={
                                refreshReviews
                            }
                        />
                    )
                )
            }

        </div>
    );
}