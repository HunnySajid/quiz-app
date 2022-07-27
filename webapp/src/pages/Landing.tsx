import { useNavigate } from "react-router-dom";
import LandingIllustration from "../assets/illustations/landing.png";
import Logo from "../assets/logos/White-Purple-Circle.png";
import { Footer } from "../components/Footer";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="landing">
        <div
          style={{ height: "90vh" }}
          className="flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-5 md:mx-auto"
        >
          <div className="w-12/12 md:w-6/12 flex items-center justify-center">
            <div className="h-72 md:h-96 w-72 md:w-96">
              <img
                src={LandingIllustration}
                className="h-full w-full object-cover"
                alt="landing"
              />
            </div>
          </div>
          <div className="w-12/12 md:w-6/12">
            <div className="flex items-center">
              <img
                src={Logo}
                className="h-20 w-20 object-cover"
                alt="landing"
              />
              <h1 className="text-2xl font-thin text-slate-800">Trivia App</h1>
            </div>
            <h2 className="text-4xl font-medium mt-2 text-slate-600">
              Your one stop Quiz Builder App
            </h2>
            <p className="w-10/12 mt-4 text-slate-600 font-medium text-2xl">
              Using Trivia App, it’s super fast and easy to create a quiz - perfect
              for revision guides, driving theory practice and trivia.
            </p>
            <div>
              <button
                onClick={() => navigate("/sign-up")}
                className="px-6 py-4 bg-indigo-600 text-white rounded-md mt-4"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
