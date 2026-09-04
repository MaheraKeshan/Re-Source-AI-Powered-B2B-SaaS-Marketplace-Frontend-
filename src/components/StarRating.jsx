import React from "react";

const StarRating = ({ rating = 0, editable = false, onRatingChange }) => {
	const handleClick = (newRating) => {
		if (editable && onRatingChange) {
		onRatingChange(newRating);
		}
	};

	return (
		<div className="flex">
		{[1, 2, 3, 4, 5].map((star) => (
			<button
			key={star}
			type={editable ? "button" : "span"}
			onClick={() => handleClick(star)}
			className={`text-2xl ${editable ? "cursor-pointer" : "cursor-default"} ${
				star <= rating ? "text-yellow-400" : "text-gray-300"
			}`}
			>
			★
			</button>
		))}
		</div>
	);
	};

export default StarRating;