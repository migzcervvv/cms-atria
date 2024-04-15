import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFillHouseFill, BsLinkedin } from "react-icons/bs";

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="flex justify-center items-center mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <img
                src="/atria-cms-logo.png"
                className="max-w-[200px] object-cover dark:bg-gray-300 dark:rounded-3xl"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              {" "}
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://atria-learning.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Atria Learning
                </Footer.Link>
                <Footer.Link href="/projects">MyCaDO</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              {" "}
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.linkedin.com/company/atria-learning-&-development-gmbh/">
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              {" "}
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://atria-learning.com/pdf/Service%20Agreement%20Atria.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Service Agreement
                </Footer.Link>
                <Footer.Link
                  href="https://atria-learning.com/pdf/Privacy%20Statement%20Atria.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Statement
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Atria Learning and Development GMBH"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://atria-learning.com/"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsFillHouseFill}
            />
            <Footer.Icon
              href="https://www.linkedin.com/company/atria-learning-&-development-gmbh/"
              icon={BsLinkedin}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
