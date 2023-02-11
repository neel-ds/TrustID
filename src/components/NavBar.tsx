import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BiMoon, BiSun } from "react-icons/bi";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";
import {
  Flex,
  Box,
  Text,
  Stack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";

interface Question {
  id: string;
  question: string;
  answer: string;
}

const questions: Question[] = [
  {
    id: "1",
    question: "What is TypeScript?",
    answer:
      "TypeScript is a statically typed, object-oriented programming language that builds on JavaScript by adding optional types and other features to help you write safer and more maintainable code.",
  },
  {
    id: "2",
    question: "What is Tailwind CSS?",
    answer:
      "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. It provides a large set of pre-designed CSS classes that can be combined to create complex designs with ease.",
  },
  {
    id: "3",
    question: "What is an FAQ model?",
    answer:
      "An FAQ model, or frequently asked questions model, is a common design pattern used to display a list of questions and answers in a user-friendly format. It is often used to provide quick answers to common questions without the need for a full documentation or support page.",
  },
];
const Header: React.FC = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showAnswers, setShowAnswers] = useState({});

  const handleShowFAQ = () => {
    setShowFAQ(true);
  };

  const toggleAnswer = (questionId) => {
    setShowAnswers({
      ...showAnswers,
      [questionId]: !showAnswers[questionId],
    });
  };

  const handleCloseFAQ = () => {
    setShowFAQ(false);
    setShowAnswers({});
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const switchTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  const { pathname } = useRouter();

  return (
    <>
      <nav className="fixed z-10 w-full mx-auto bg-blue-200 bg-opacity-80 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-black dark:bg-opacity-80 drop-shadow-lg dark:drop-shadow-[0_10px_25px_rgba(255,255,255,0.25)]">
        <div className="max-w-[1080px] container flex flex-wrap justify-between items-center mx-auto">
          <Link href="/" className="flex items-center flex-1">
            <span className="flex flex-row items-center self-center text-xl font-bold whitespace-nowrap text-[#9504ff] hover:text-[#a137df] dark:text-[#c26fff]">
              <Image
                src="/trustID.png"
                width="50"
                height="50"
                className="mr-2 my-2"
                alt="TrustIDLogo"
              />
              TrustID
            </span>
          </Link>
          <div className="flex md:order-2" style={{ marginLeft: "2rem" }}>
            <ConnectKitButton />
            <button
              data-collapse-toggle="mobile-menu-4"
              type="button"
              className="inline-flex items-center px-3 py-2 ml-2 text-sm text-gray-500 rounded-lg md:ml-0 md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
              <span className="sr-only">Open main menu</span>
              <AiOutlineMenu size="20" />
            </button>
          </div>
          <div
            className={`${
              isOpenMenu ? "block" : "hidden"
            } justify-between items-center w-full md:flex md:w-auto md:order-1`}
          >
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <li></li>
              <li>
                <Link
                  href="/"
                  className={`${
                    pathname === "/"
                      ? "text-[#a137df] dark:text-white"
                      : "text-gray-700"
                  } block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-[#9504ff] md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  <b>Home</b>
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className={`${
                    pathname === "/explore"
                      ? "text-[#a137df] dark:text-white"
                      : "text-gray-700"
                  } block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-[#9504ff] md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  <b>Explore</b>
                </Link>
              </li>
              <li>
                <Link
                  href="/kyc"
                  className={`${
                    pathname === "/kyc"
                      ? "text-[#a137df] dark:text-white"
                      : "text-gray-700"
                  } block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-[#9504ff] md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  <b>Register</b>
                </Link>
              </li>
              <li>
                <Popover trigger={"hover"} placement={"bottom-start"}>
                  <PopoverTrigger>
                    <Link
                      href="#"
                      className={`${
                        pathname === "#"
                          ? "text-[#a137df] dark:text-white"
                          : "text-gray-700"
                      } block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-[#9504ff] md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                      aria-current="page"
                    >
                      <b>Records</b>
                    </Link>
                  </PopoverTrigger>
                  <PopoverContent className="box-border p-4 bg-blue-100 shadow-lg bg-opacity-80 h-25 w-35 dark:bg-black/40 dark:bg-opacity-80 dark:text-white/80 rounded-xl border-1 min-w-sm">
                    <Link
                      href="/addLand"
                      className="group display-block p-2 rounded-md hover:bg-blue-200 hover:text-[#a13bf7]"
                    >
                      <Stack direction={"row"} align={"center"}>
                        <Box>
                          <Text className="pb-1 font-semibold transition ease-in-out delay-10 group-hover:pink-400">
                            {"Add RoR"}
                          </Text>
                        </Box>
                        <Flex className="flex self-center flex-1 transition ease-in-out -translate-x-10 opacity-0 delay-10 group-hover:opacity-100 group-hover:translate-x-0 justify-flex-end">
                          <Icon w={15} h={15} as={ChevronRightIcon} />
                        </Flex>
                      </Stack>
                    </Link>
                    <Link
                      href="/updateproduct"
                      className="group display-block p-2 rounded-md hover:bg-blue-200 hover:text-[#a13bf7]"
                    >
                      <Stack direction={"row"} align={"center"}>
                        <Box>
                          <Text className="pb-1 font-semibold transition ease-in-out delay-10 group-hover:pink-400">
                            {"Transfer RoR"}
                          </Text>
                        </Box>
                        <Flex className="flex self-center flex-1 transition ease-in-out -translate-x-10 opacity-0 delay-10 group-hover:opacity-100 group-hover:translate-x-0 justify-flex-end">
                          <Icon w={15} h={15} as={ChevronRightIcon} />
                        </Flex>
                      </Stack>
                    </Link>
                  </PopoverContent>
                </Popover>
              </li>
              <li>
                <Link
                  href="/producthistory"
                  className={`${
                    pathname === "/producthistory"
                      ? "text-[#a137df] dark:text-white"
                      : "text-gray-700"
                  } block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-[#9504ff] md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                  aria-current="page"
                >
                  <b>RoRs History</b>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="z-10 bg-[#008dff] w-9 h-9 fixed bottom-[18px] right-[50px] flex justify-center items-center rounded-full">
        {theme === "dark" ? (
          <BiMoon
            size="25"
            onClick={switchTheme}
            className="text-white hover:cursor-pointer"
          />
        ) : (
          <BiSun
            size="20"
            onClick={switchTheme}
            className="text-white hover:cursor-pointer"
          />
        )}
      </div>
      <div className="z-10 bg-[#008dff] w-9 h-9 fixed bottom-[85px] right-[50px] flex justify-center items-center rounded-full">
        <div className="relative">
          <button
            onClick={handleShowFAQ}
            className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600"
          >
            Show FAQ
          </button>
          {showFAQ && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-75">
              <div className="max-w-sm mx-auto mt-20 p-10 bg-white rounded-lg shadow-lg overflow-hidden">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="p-5 border-b border-gray-200"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleAnswer(question.id)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {showAnswers[question.id] ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          )}
                        </svg>
                      </button>
                      <div className="ml-3 text-lg font-medium">
                        {question.question}
                      </div>
                    </div>
                    {showAnswers[question.id] && (
                      <div className="ml-8 mt-3 text-gray-600">
                        {question.answer}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleCloseFAQ}
                  className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 mt-5"
                >
                  Close FAQ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
