import { HeroJaime } from "@/components/sections/HeroJaime";
import { JaimeMenu } from "@/components/sections/JaimeMenu";
import { JaimeAtelier } from "@/components/sections/JaimeAtelier";
import { JaimeFooter } from "@/components/layout/JaimeFooter";

export default function Home() {
  return <main><HeroJaime /><JaimeMenu /><JaimeAtelier /><JaimeFooter /></main>;
}
