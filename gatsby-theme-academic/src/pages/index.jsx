import React from "react";

import AboutMe from "../components/PageFragments/HomePage/AboutMe";
import Awards from "../components/PageFragments/HomePage/Awards";
import Experience from "../components/PageFragments/HomePage/Experience";
import SelectedResearch from "../components/PageFragments/HomePage/SelectedResearch";
import SkillProgress from "../components/PageFragments/HomePage/SkillProgress";
import News from "../components/PageFragments/HomePage/News";
import SEO from "../components/Seo";

export default () => (
  <>
    <SEO title="About" description="" path="" keywords={["NodeJS", "Gatsby"]} />
    <AboutMe />
    <News />
    <Experience />
    <SelectedResearch />
    <Awards />
    <a href='https://clustrmaps.com/site/1bx0x'  title='Visit tracker'><img src='//clustrmaps.com/map_v2.png?cl=000000&w=a&t=n&d=KsX45ylDjq2_61A1AolUOdbXxnUJf4u2QvsJIkBT68U&co=ffffff'/></a>
    {/* <SkillProgress/> */}
    <img src="https://ghchart.rshah.org/huskydoge" alt="GitHub Commit Chart" />

  </>
);
