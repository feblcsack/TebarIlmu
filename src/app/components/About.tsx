import { AnimatedTestimonials } from "../components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
    const testimonials = [
        {
          quote:
            "As a Project Manager, what I value most is clarity and efficiency — this platform delivers both in spades. It's a game-changer for how we lead and execute projects.",
          name: "Brilian Krisna Mora",
          designation: "Project Manager",
          src: "/brilian.jpg",
        },
        {
          quote:
            "Design is about experience — and this solution understands users better than most designers do. Smooth, sleek, and simply delightful.",
          name: "Vallerie Anne Jose",
          designation: "UI/UX Designer",
          src: "/vallerie.jpg",
        },
        {
          quote:
            "In research, precision and adaptability are everything. This tool accelerates discovery by making data and collaboration effortless.",
          name: "Muhammad Salman Al Farisi",
          designation: "Researcher",
          src: "salman.jpg",
        },
        {
          quote:
            "I write code that feels like poetry. This tool speaks my language — fast, clean, and built for devs who live to build.",
          name: "Alifian Abdiel Rafif",
          designation: "Programmer",
          src: "/lks.png",
        },
      ];
      
  return <AnimatedTestimonials testimonials={testimonials} />;
}
