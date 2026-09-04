import { useState } from "react";

export default function ImageSlider(props) {
    // It's common to destructure props for cleaner code
    const { images } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- FIX: ADD THIS GUARD CLAUSE ---
    // If images is not an array or is an empty array, render nothing.
    if (!images || images.length === 0) {
        // You could also return a loading spinner or a placeholder image here
        return null;
    }
    // ------------------------------------

    return (
        <div className="w-[90%] md:w-[500px] h-[600px] ">
            {/* This line is now safe because of the check above */}
            <img src={images[currentIndex]} className="w-full h-[500px] object-cover rounded-3xl" />
            <div className="w-full h-[100px] flex justify-center items-center">
                {
                    images.map( // No need for optional chaining here now, but it doesn't hurt
                        (image, index) => {
                            return (
                                <img
                                    key={index}
                                    className={"w-[90px] h-[90px] m-2 rounded-2xl object-cover cursor-pointer hover:border-4 hover:border-accent " + (index == currentIndex && "border-accent border-4")}
                                    src={image}
                                    onClick={() => {
                                        setCurrentIndex(index)
                                    }}
                                />
                            )
                        }
                    )
                }
            </div>
        </div>
    );
}