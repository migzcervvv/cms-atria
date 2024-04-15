import { Card } from "flowbite-react";
import { PiTarget } from "react-icons/pi";
import { MdSyncProblem } from "react-icons/md";
import { LuGoal } from "react-icons/lu";

export default function Projects() {
  return (
    <>
      <div className="min-h-dvh max-w-6xl mx-auto">
        <div className="flex flex-col justify-center">
          <img
            src="/mycado-logo.png"
            alt="MyCaDO Logo from ATRIA"
            className="md:h-96 md:w-full w-auto h-auto"
          />
          <h1 className="md:text-4xl text-xl font-bold text-center mt-4">
            PIONEERING CAREER DEVELOPMENT IN THE SHIPPING INDUSTRY
          </h1>
        </div>

        <div className="">
          <div className="max-w-6xl mx-auto flex justify-center mt-12 lg:mt-40">
            <h1 className="md:text-4xl text-xl font-bold">
              Project Background
            </h1>
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col lg:flex-row mt-20 justify-evenly text-center relative">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">TRUSTED BY:</h1>
                <div className="dark:bg-white">
                  <img src="/mycado-bizOne-.png" alt="mycado partners" />
                  <img src="/mycado-bizTwo.png" alt="mycado partners" />
                </div>
              </div>
              <div className="flex flex-col max-w-md justify-center p-4">
                <p className="text-left sm:text-justify font-semibold">
                  With the vision to develop a focused and high-impact learning
                  platform, that places the employee at the center, providing
                  consistent support throughout their career journey, a
                  German-Dutch consortium has come together around Mariko GmbH
                  and Atria Learning & Development GmbH from Leer.
                </p>
                <p className="h-2">{"\n"}</p>
                <p className="text-left sm:text-justify font-semibold">
                  The MyCaDO project is part of the programme Interreg VI A
                  Deutschland-Nederland and is co-financed with 1.73 million
                  euros by the European Union and the MB Niedersachsen as well
                  as the provinces of Groningen, Fryslân and Drenthe.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 my-6 md:my-8 mx-3 md:mx-0">
          <Card className="max-w-sm lg:max-w-lg">
            <div className="flex flex-col min-h-full justify-start">
              <div className="flex flex-row gap-3">
                <MdSyncProblem fontSize="50px" />
                <div className="flex justify-center flex-col">
                  <h5 className="text-2xl font-bold tracking-tight">Problem</h5>
                </div>
              </div>
              <ul className="list-disc list-inside">
                <li className="font-normal my-4">
                  Maintaining and increasing competitiveness and employment.
                </li>
                <li className="font-normal my-4">
                  Shortage of skilled workers.
                </li>
                <li className="font-normal my-4">
                  Challenges in operational and regulatory requirements,
                  continuously changing in line with ESG changes.
                </li>
                <li className="font-normal my-4">
                  Need for efficient personnel training and a transparent
                  qualification management system.
                </li>
              </ul>
            </div>
          </Card>
          <Card className="max-w-sm lg:max-w-lg">
            <div className="flex flex-row gap-3">
              <PiTarget fontSize="50px" />
              <div className="flex justify-center flex-col">
                <h5 className="text-2xl font-bold tracking-tight">Solution</h5>
              </div>
            </div>
            <ul className="list-disc list-inside">
              <li className="font-normal">
                A digital platform for creating and tracking personalized career
                development roadmaps.
              </li>
              <li className="font-normal">
                Covers training initiation to further professional
                qualification.
              </li>
              <li className="font-normal">
                Integrates employee, company, and framework condition
                requirements.
              </li>
              <li className="font-normal">
                Includes industry standards, competency needs, and modern
                learning technologies.
              </li>{" "}
              <li className="font-normal">
                Shifts from a “push” (HR-driven) to a “pull” mentality
                (worker-driven) for qualification decisions.
              </li>
              <li className="font-normal">
                Provides structure and guidance for shipping professionals in
                career path decisions.
              </li>
            </ul>
          </Card>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 my-6 md:my-8 mx-3 md:mx-0">
          <Card className="max-w-sm lg:max-w-lg">
            <div className="flex flex-row gap-3">
              <LuGoal fontSize="50px" />
              <div className="flex justify-center flex-col">
                <h5 className="text-2xl font-bold tracking-tight">Result</h5>
              </div>
            </div>
            <ul className="list-disc list-inside">
              <li className="font-normal">
                A digital platform for creating and tracking personalized career
                development roadmaps.
              </li>
              <li className="font-normal">
                Covers training initiation to further professional
                qualification.
              </li>
              <li className="font-normal">
                Integrates employee, company, and framework condition
                requirements.
              </li>
              <li className="font-normal">
                Includes industry standards, competency needs, and modern
                learning technologies.
              </li>{" "}
              <li className="font-normal">
                Shifts from a “push” (HR-driven) to a “pull” mentality
                (worker-driven) for qualification decisions.
              </li>
              <li className="font-normal">
                Provides structure and guidance for shipping professionals in
                career path decisions.
              </li>
            </ul>
          </Card>
          <img
            src="/mycadofinal.png"
            alt="MyCaDO Results"
            className="max-w-xl"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8 my-6 md:my-8 mx-3 md:mx-0">
          <Card className="max-w-sm lg:max-w-lg">
            <p className="font-bold">
              We are proud to work with partners who are committed to inspire
              each other, combining resources, creating synergies and being
              drivers of knowledge. Realizing something that lasts.
            </p>
            <p className="font-bold">Engage - Learn - Act. Together</p>
          </Card>
          <img
            src="/mycadopartners.png"
            alt="MyCaDO Results"
            className="max-w-xl"
          />
        </div>
      </div>
    </>
  );
}
