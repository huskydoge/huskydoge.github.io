import React from 'react';

import SEO from '../components/Seo';
import Resume from '../components/Resume';

const ResumePage = () => (
  <div>
    <SEO
      title="Resume"
      description="My resume consists of my biodata of experience. You can hire me if you feel
          I'm good for any position in your organization. I'm open to various challenges that come
          in the way of building various web applications."
      path="resume"
    />
    <Resume />
  </div>
);

export default ResumePage;
