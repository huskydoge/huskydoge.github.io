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

const CLUSTRMAPS_IMAGE_URL =
  "https://clustrmaps.com/map_v2.png?cl=000000&w=a&t=n&d=KsX45ylDjq2_61A1AolUOdbXxnUJf4u2QvsJIkBT68U&co=ffffff";

/** Render the quiet homepage visitor and activity strip. */
const VisitorActivity = () => (
  <div className={styles.activityStrip}>
    <a
      className={styles.visitorMapLink}
      href="https://clustrmaps.com/site/1bx0x"
      rel="noopener noreferrer"
      target="_blank"
      title="Visit tracker"
    >
      <img
        className={styles.visitorMapImage}
        src={CLUSTRMAPS_IMAGE_URL}
        alt="Visitor map"
        loading="lazy"
        decoding="async"
      />
    </a>
    <img
      className={styles.githubActivityImage}
      src="https://ghchart.rshah.org/huskydoge"
      alt="GitHub commit chart"
      loading="lazy"
      decoding="async"
    />
  </div>
);

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
      <VisitorActivity />
    </div>
  </>
);
