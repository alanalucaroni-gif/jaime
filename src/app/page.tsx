import { Preloader } from "@/components/motion/Preloader";
import { HeroJaime } from "@/components/sections/HeroJaime";
import { JaimeExperience, JaimeFinal } from "@/components/sections/JaimeExperience";
import { JaimeMenu } from "@/components/sections/JaimeMenu";
import { JaimeFooter } from "@/components/layout/JaimeFooter";

export default function Home() { return <main><Preloader/><HeroJaime/><JaimeExperience/><JaimeMenu/><JaimeFinal/><JaimeFooter/></main>; }
