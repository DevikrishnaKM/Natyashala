import { useEffect } from "react";
import { preLoaderAnim } from "../../../utils/loadingAnimation";


const PreLoader = () => {
    useEffect(() => {
      preLoaderAnim();
    }, []);
  
    return (
        <div className="preloader h-screen w-full bg-black text-white flex justify-center items-center overflow-hidden">
          <div className="texts-container flex items-center justify-between h-[60px] w-[280px] text-[20px] font-bold overflow-hidden gap-10">
            <span>Create,</span>
            <span>Express,</span>
            <span>Evolve,</span>
          </div>
        </div>
      );
      
  };
  
  export default PreLoader;
  