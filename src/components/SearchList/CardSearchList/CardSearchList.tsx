import { useState } from "react";
import { CardSearchListProps } from "./CardSearchList.types";


const CardSearchList = (props: CardSearchListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = props;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full p-4 md:p-5 lg:p-6 mb-2 bg-[#f8f4f4]">
        <div className="cursor-pointer hover:bg-gray-200 text-sm md:text-base lg:text-lg">
          {user.login}
        </div>
        <button 
        data-testid="expand-repository-button"
        onClick={() => setIsOpen(!isOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
          </svg>
        </button>
      </div>
      {isOpen &&
        (user.repository?.length ? (
          user.repository.map((repo) => (
            <div key={repo.id} className="w-full h-fit pl-4 md:pl-6 lg:pl-10 mb-2">
              <div className="p-4 md:p-5 lg:p-6 bg-[#e8e4e4] flex justify-between px-6 pb-10 md:pb-8 lg:pb-15 md:px-8 lg:px-10">
                <div className="flex flex-col w-full">
                  <div className="flex items-center font-semibold text-lg md:text-xl lg:text-2xl justify-between w-full">
                    {repo.name}
                    <div className="flex gap-2 items-center font-semibold text-lg md:text-xl lg:text-2xl">
                      {repo.stargazers_count}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#1f1f1f"
                      >
                        <g>
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M0 0h24v24H0V0z" fill="none" />
                        </g>
                        <g>
                          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm md:text-base lg:text-lg flex">
                    {repo.description ? repo.description : "No description"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-12 lg:h-18 md:h-15 items-center flex justify-center mb-2">
            <div className="p-2 cursor-pointer text-sm md:text-base lg:text-lg">
              No repository found
            </div>
          </div>
        ))}
    </div>
  );
};

export default CardSearchList;
