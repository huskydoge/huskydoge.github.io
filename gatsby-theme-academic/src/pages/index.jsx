/** Gatsby home page composition for the personal site. */
import React from "react";

import AboutMe from "../components/PageFragments/HomePage/AboutMe";
import Awards from "../components/PageFragments/HomePage/Awards";
import Experience from "../components/PageFragments/HomePage/Experience";
import SelectedResearch from "../components/PageFragments/HomePage/SelectedResearch";
import SkillProgress from "../components/PageFragments/HomePage/SkillProgress";
import News from "../components/PageFragments/HomePage/News";
import SEO from "../components/Seo";
import * as styles from "../components/PageFragments/HomePage/homePage.module.less";

/** Render the home page sections in a compact editorial rhythm. */
export default () => (
  <>
    <SEO title="About" description="" path="" keywords={["NodeJS", "Gatsby"]} />
    <div className={styles.homePageBody}>
      <AboutMe />
      <News />
      <SelectedResearch />
      <Experience />
      <Awards />
      {/* <SkillProgress/> */}
      <div className={styles.activityStrip}>
        <img src="https://ghchart.rshah.org/huskydoge" alt="GitHub Commit Chart" />
      </div>
    </div>
  </>
);
