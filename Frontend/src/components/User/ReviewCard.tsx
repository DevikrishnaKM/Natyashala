import type React from "react"
import { FaStar } from "react-icons/fa"

interface ReviewProps {
  name: string
  rating: number
  comment: string
  date: string
}

const Review: React.FC<ReviewProps> = ({ name, rating, comment, date }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{comment}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  )
}

export default Review

