import React from "react";

import AboutMe from "../components/PageFragments/HomePage/AboutMe";
import Awards from "../components/PageFragments/HomePage/Awards";
import Experience from "../components/PageFragments/HomePage/Experience";
import SelectedResearch from "../components/PageFragments/HomePage/SelectedResearch";
import SkillProgress from "../components/PageFragments/HomePage/SkillProgress";
import SEO from "../components/Seo";

export default () => (
  <>
    <SEO title="About" description="" path="" keywords={["NodeJS", "Gatsby"]} />
    <AboutMe />
    <Experience />
    <Awards />
    <SelectedResearch />
    <a href="https://clustrmaps.com/site/1bx0x" title="Visit tracker" style="display: none;">
    <img src="//clustrmaps.com/map_v2.png?cl=261b1b&w=a&t=tt&d=KsX45ylDjq2_61A1AolUOdbXxnUJf4u2QvsJIkBT68U&co=ffffff&ct=808080" />
    </a>
    {/* <SkillProgress/> */}
  </>
);
