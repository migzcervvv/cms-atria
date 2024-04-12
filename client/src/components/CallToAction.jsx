import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl text-white">
          Transform Your Maritime Career with MyCaDO!
        </h2>
        <p className="text-white my-2 dark:text-gray-300 text-justify">
          Join MyCaDO, the pioneering career development platform
          revolutionizing the maritime industry. Experience hands-on learning,
          personalized support, and transformative opportunities tailored to
          your career journey. Take charge of your future in shipping with
          MyCaDO today!
        </p>
        <Button
          gradientDuoTone="purpleToBlue"
          className="rounded-tl-xl rounded-bl-none"
          href="https://atria-learning.com/mycado.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="/mycado-logo.png" alt="CTA image" className="rounded-xl" />
      </div>
    </div>
  );
}
