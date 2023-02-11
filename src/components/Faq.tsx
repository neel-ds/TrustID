import FAQIcon from "./NavBar";

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <FAQIcon
        question1="What is React?"
        answer1="React is a JavaScript library for building user interfaces."
        question2="What are the benefits of using React?"
        answer2="Some of the benefits of using React include increased efficiency and code reusability, a virtual DOM for improved performance, and a large and active community."
      />
    </div>
  );
};

export default FAQPage;
