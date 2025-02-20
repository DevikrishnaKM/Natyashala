import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { BsSendFill } from "react-icons/bs";
import io from "socket.io-client";
import { Base_URL } from "../../credentials";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import  defaultProfile  from "../../assets/defualt.webp";
import Msg from "./Message";

interface UserDetails {
 name: string;
  email: string;
  profileUrl: string;
}

interface Message {
  _id :string;
  userId: string;
  message: string;
  timestamp: string;
  deleted : boolean;
  userDetails: UserDetails;
}

interface TypingUser {
  userId: string;
  username: string;
}

const TypingIndicator: React.FC<{ typingUsers: TypingUser[] }> = ({
  typingUsers,
}) => {
  if (typingUsers.length === 0) return null;
  return (
    <p className="text-gray-200 text-sm italic">
      {typingUsers.map((user) => user.username).join(", ")} is typing...
    </p>
  );
};

const GroupChat: React.FC = React.memo(() => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const selectedCourseData = useMemo(() => {
    return courseData.find(
      (course: any) => course?.courseId === selectedCourse
    );
  }, [courseData, selectedCourse]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${Base_URL}/auth/mycourses/${userInfo?.userId}`
        );
        setCourseData(response.data);

      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();

    if (userInfo?.userId) {
      socketRef.current = io(Base_URL + "/auth");
      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      
      return () => {
        socket.disconnect();
        console.log("Disconnected from socket server");
      };
    }
  }, [userInfo?.userId]);

    const fetchMessages = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        try {
          const response = await userAxiosInstance.get(
            `${Base_URL}/community/messages/${selectedCourse}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    useEffect(()=>{
      fetchMessages();
      if (selectedCourse) {
        socketRef.current = io(Base_URL);
        const socket = socketRef.current;
  
        socket.emit("joinRoom", selectedCourse);
  
        socket.on("receiveMessage", (payload: Message) => {
          setMessages((prevMsgs) => [...prevMsgs, payload]);
        });
  
        socket.on("userTyping", (userId: string, user: string) => {
          const username = user;
          const existingUser = typingUsers.find((user) => user.userId === userId);
          if (!existingUser) {
            setTypingUsers((prevTypingUsers) => [
              ...prevTypingUsers,
              { userId, username },
            ]);
          }
        });
  
        socket.on("userStoppedTyping", (userId: string) => {
          setTypingUsers((prevTypingUsers) =>
            prevTypingUsers.filter((user) => user.userId !== userId)
          );
        });
  
        return () => {
          socket.off("receiveMessage");
          socket.off("userTyping");
          socket.off("userStoppedTyping");
          socket.disconnect();
        };
      }
    },[selectedCourse])
    

    
  

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
   
      setMessage(e.target.value);
      if (selectedCourse && socketRef.current && !isTypingRef.current) {
        isTypingRef.current = true;
        socketRef.current.emit("typing", {
          courseId: selectedCourse,
          userId: userInfo?.userId,
          username: userInfo?.name || "Unknown User",
        });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          socketRef.current.emit("stopTyping", {
            courseId: selectedCourse,
            userId: userInfo?.userId,
          });
          isTypingRef.current = false;
        }, 2000);
     
      }
    },
    [selectedCourse, userInfo]
  );

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (message.trim() !== "" && selectedCourse) {
        const userId = userInfo?.userId;
        
        socketRef.current?.emit("sendMessage", {
          courseId: selectedCourse,
          message,
          userId,
        });
        setMessage("");
       
      }
    },
    [message, selectedCourse, userInfo]
  );

  const handleCourseClick = useCallback((courseId: string) => {
    setSelectedCourse(courseId);
    setMessages([]);
    setTypingUsers([]);
  }, []);

  const handleReply = (message: Message) => {
   
    console.log("Replying to:", message);

  };

  
  const handleDelete = (messageId: string) => {
    socketRef.current.emit("deleteMessage", {
      messageId : messageId,
      courseId : selectedCourse
    });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, deleted: true, message: "This message was deleted" } : msg
      )
    );
    
  };

  return (
    <main className="flex flex-col md:flex-row w-full h-full gap-5 p-4">
      <section className="w-full md:w-1/4 bg-white h-full rounded-lg overflow-hidden">
      <div className="px-4 py-3 md:px-8 md:py-5">
          <h1 className="text-lg font-bold">All chats</h1>
          <input
            type="search"
            className="border-none w-full bg-gray-200 h-8 mt-3 rounded-md px-3"
            placeholder="Search"
          />
        </div>
        <div className="w-full h-full overflow-y-auto px-2">
          <h1 className="pl-2 text-sm font-semibold">Courses</h1>
          {courseData.map((course, index) => (
            <div
              key={index}
              className={`h-14 w-full px-2 md:px-3 flex items-center cursor-pointer my-3 ${
                selectedCourse === course?.courseId
                  ? "bg-gray-100 rounded-md"
                  : ""
              }`}
              onClick={() => handleCourseClick(course?.courseId)}
            >
              <img
                src={course?.thumbnail}
                alt=""
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
              />
              <p className="pl-3 text-sm md:text-base font-medium">
                {course?.name}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white w-full h-full rounded-lg px-3 py-2 flex flex-col">
        {selectedCourse ? (
          <>
            <div className="flex items-center p-2 bg-black text-white rounded-t-lg gap-5">
              {selectedCourseData && (
                <>
                  <img
                    src={selectedCourseData?.thumbnail}
                    alt=""
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p className="font-medium">{selectedCourseData?.name}</p>
                </>
              )}
              <TypingIndicator typingUsers={typingUsers} />
            </div>
            <div className="flex-grow bg-gray-100 overflow-y-auto rounded-b-lg p-3">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => (
                  <Msg
                    key={index}
                    message={msg}
                    onDelete={handleDelete}
                    // onReply={handleReply}
                    isUserMessage={msg.userId === userInfo?.userId}
                  />
                  // <p key={index}>{msg.message}</p>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet.</p>
              )}
            </div>
            <form className="w-full h-12 flex" onSubmit={submit}>
              <input
                type="text"
                value={message}
                onChange={handleChange}
                className="flex-grow bg-gray-200 outline-none px-4 rounded-md"
                placeholder="Type your message"
              />
              <button type="submit" className="flex items-center px-3">
                <BsSendFill size={24} className="cursor-pointer" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a course to chat
          </div>
        )}
      </section>
    </main>
  );
});

export default GroupChat;