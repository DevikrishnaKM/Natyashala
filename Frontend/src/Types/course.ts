interface IcourseData {
    courseName: string;
    description: string;
    language: string;
    tags: string[];
    selectedCategory ?: any;
    [key: string]: any;
  }

  export default IcourseData