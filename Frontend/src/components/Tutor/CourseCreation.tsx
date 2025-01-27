
import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import IcourseData from "../../Types/course";
import { useCourseContext } from "../../context/courseContext";
import { Base_URL } from "../../credentials";


interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CourseCreation1: React.FC<{ onNext: (itemName: string) => void }> = ({ onNext }) => {
  
 
  const { courseData, setCourseData } = useCourseContext();
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${Base_URL}/admin/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && tags.length < 6) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
      setIsModalOpen(false);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleNextClick = () => {
    if (courseName.trim() === "" || description.trim() === "" || language.trim() === "" || !selectedCategory) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (tags.length < 3) {
      toast.warning("Add at least 3 tags.");
      return;
    }

    const newCourseData: IcourseData = {
      courseName,
      description,
      language,
      tags,
      selectedCategory
    };
    setCourseData(newCourseData);
    console.log("Course data set to context:", newCourseData);

    onNext("Add Section");
  };
  
  

  return (
    <div className="font-poppins">
      <Toaster richColors position="top-center" />
      <div className="w-full flex">
        <h2 className="font-bold mb-2">Basic details {'>'}</h2>
        <p className="ml-2 font-normal">Add sections {'>'}</p>
        
        <p className="ml-2">More details {'>'}</p>
      </div>

      <div className="bg-[#fafbfe] p-4 rounded-lg shadow-lg w-full mt-10 mb-5 pl-10 pr-10">
        <div className="mb-3 w-1/2">
          <h2 className="pb-1 font-bold">Name of your course</h2>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
          />
        </div>

        <div className="mb-3">
          <h2 className="pb-1 font-bold">Description</h2>
          <p className="text-gray-400 text-[12px] pb-1">Max 50 words.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff] p-2 outline-none"
          />
        </div>

        <div className="w-full flex gap-10">
          <div className="mb-3">
            <h2 className="pb-1 font-bold">Category</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
            >
              <option value="">Select your Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <h2 className="pb-1 font-bold">Language</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
            >
              <option value="">Select your language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Mandarin">Mandarin</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="pb-1 font-bold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="bg-green-200 text-green-800 px-4 py-1 rounded-full flex items-center mt-2"
              >
                {tag}
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => handleRemoveTag(index)}
                >
                  &times;
                </span>
              </div>
            ))}
            {tags.length < 6 && (
              <button
                type="button"
                className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full flex items-center text-[14px] mt-2 font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                + Add Tag
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded mr-2 font-semibold"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
     
      </div>
      {isModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="pb-2 font-bold">Add a Tag</h2>
            <input
              type="text"
              className="w-full h-10 border border-gray-300 rounded-lg p-2 outline-none"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <div className="flex justify-start mt-4">
              <button
                type="button"
                className="bg-white text-black hover:bg-black border-2 border-black hover:text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddTag}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default CourseCreation1;
