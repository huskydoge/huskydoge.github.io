/** Responsive profile sidebar and content wrapper for standard pages. */
// eslint-disable-next-line import/no-unresolved
import { useLocation } from '@gatsbyjs/reach-router';
import React, { useRef, useContext } from 'react';
import {
  Container, Content, Row, Col, Sidebar, FlexboxGrid, Divider, IconButton,
} from 'rsuite';
import Context from '../../../utils/context';
import { useWindowSize, useSiteMetadata } from '../../../utils/hooks';
import Utils from '../../../utils/pageUtils';
import Affix from '../../Affix';
import FlipAvatar from '../../FlipAvatar';
import Icon from '../../Icon';
import IconListItem from '../../IconListItem';
import LoadableTableOfContents from '../../TableOfContents/loadable';

import * as style from './sidebar.module.less';

/** Render the split author name block. */
const Name = () => {
  const siteMetadata = useSiteMetadata();
  const displayName = siteMetadata.authorAlternative || siteMetadata.author;
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item as={Col} xs={24}>
        <h2 className="centerAlign">{displayName}</h2>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

/** Render affiliations, social links, and contact metadata. */
const UserInfo = () => {
  const siteMetadata = useSiteMetadata();
  return (
    <>
      <div className={`${style.name} centerAlign`}>
      <Row type="flex" className={style.badgeContainer}>
        {siteMetadata.professions.map((profession) => {
          const name = typeof profession === 'string' ? profession : profession.name;
          const url = typeof profession === 'string' ? null : profession.url;
          
          const BadgeContent = (
            <span className={`${style.badge} ${style.badgeGray}`}>
              {name}
            </span>
          );

          return (
            <div key={name}>
              {url ? (
                <a
                  href={url}
                  className={style.badgeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BadgeContent}
                </a>
              ) : (
                BadgeContent
              )}
            </div>
          );
        })}
      </Row>
        <div className="centerAlign box" style={{ marginTop: '0.5rem' }}>
          <FlexboxGrid className={style.socialIcons}>
            {siteMetadata.social.map((social) => (
              <FlexboxGrid.Item as={Col} key={social.url} className={style.iconButtonCol}>
                <IconButton
                  className={style.iconButton}
                  size="sm"
                  appearance="subtle"
                  icon={(
                    <a
                      href={social.url}
                      target="_blank"
                      label="button"
                      rel="noopener noreferrer"
                    >
                      <Icon size="lg" fixedWidth icon={social.icon} />
                    </a>
                  )}
                />
              </FlexboxGrid.Item>
            ))}
          </FlexboxGrid>
        </div>
        <div className={style.contactDetails}>
          {siteMetadata.birthday
            ? (
              <IconListItem icon="calendar" title={siteMetadata.birthday} />
            ) : null}
          {siteMetadata.location
            ? (
              <IconListItem icon="map-marker-alt" title={siteMetadata.location} />
            ) : null}
          {siteMetadata.email
            ? (
              <IconListItem icon="envelope" title={<a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>} />
            ) : null}
        </div>
      </div>
    </>
  );
};

/** Render the avatar sidebar or table of contents for post pages. */
const DomContent = (props) => {
  const siteMetadata = useSiteMetadata();
  const mainSidebar = useRef(null);
  const context = useContext(Context);
  const { pathname } = props;
  // console.log(context);
  return (
    <Sidebar>
      <div ref={mainSidebar}>
        <FlipAvatar
          className={`${style.profileAvatar} centerAlign`}
          frontSrc={Utils.generateFullUrl(siteMetadata, siteMetadata.avatar)}
          backSrc={siteMetadata.avatarBack ? Utils.generateFullUrl(siteMetadata, siteMetadata.avatarBack) : null}
          alt={siteMetadata.authorAlternative || siteMetadata.author}
        />
        <div className={`${style.name} ${style.boxName} centerAlign`}>
          <Name />
        </div>
        {context && context.state && context.state.tableOfContents
        && context.state.pathname === pathname
          ? (
            <>
              <Divider />
              <LoadableTableOfContents
                tableOfContents={context.state.tableOfContents}
                mainSidebar={mainSidebar}
              />
            </>
          ) : <UserInfo />}
      </div>
      {/* <div className={style.resumeDownload}> */}
      {/*  <a href="../resume.pdf" target="_blank">Download CV</a> */}
      {/* </div> */}
    </Sidebar>
  );
};

/** Lay out sidebar content next to the active page body. */
const SidebarWrapper = (props) => {
  const [width] = useWindowSize();
  const { children } = props;
  const context = useContext(Context);
  const { pathname } = useLocation();
  const switchableTopLevelPages = new Set([
    '/',
    '/experience/',
    '/research/',
    '/project/',
    '/bookshelf/',
    '/blogs/',
    '/misc/',
  ]);
  const canSwitchLayout = switchableTopLevelPages.has(pathname);
  const isHomePage = pathname === '/';
  const isResearchPage = pathname === '/research/';
  const layoutMode = context?.state?.pageLayoutMode || 'single';
  const isSingleColumn = canSwitchLayout && layoutMode === 'single';
  const isSingleHome = isSingleColumn && isHomePage;
  const suppressGlobalSidebar = isSingleColumn || isResearchPage;
  let domContent = <DomContent pathname={pathname} />;
  if (width >= 992 && !isSingleColumn) {
    domContent = (
      <Affix top={100}>
        <DomContent pathname={pathname} />
      </Affix>
    );
  }
  if (width < 480) {
    domContent = <></>;
    if (pathname === '/') {
      domContent = <DomContent pathname={pathname} />;
    }
  }
  return (
    <>
      <Container className={style.content}>
        <Content className={style.content}>
          <FlexboxGrid
            className={isSingleColumn ? style.singleColumnGrid : style.doubleColumnGrid}
            style={{ marginBottom: '4rem' }}
          >
            {!suppressGlobalSidebar ? (
              <FlexboxGrid.Item
                as={Col}
                xs={24}
                sm={isSingleColumn ? 24 : 7}
                md={isSingleColumn ? 24 : 7}
                lg={isSingleColumn ? 24 : 6}
                className={`${style.sidebarContent} ${isSingleColumn ? style.singleSidebarContent : ''}`}
              >
                {domContent}
              </FlexboxGrid.Item>
            ) : null}
            <FlexboxGrid.Item
              as={Col}
              xs={24}
              sm={(isSingleColumn || suppressGlobalSidebar) ? 24 : 17}
              md={(isSingleColumn || suppressGlobalSidebar) ? 24 : 17}
              lg={(isSingleColumn || suppressGlobalSidebar) ? 24 : 18}
            >
              <Container className={`${style.boxContent} ${(isSingleColumn || suppressGlobalSidebar) ? style.singleBoxContent : ''} borderRadiusSection`}>
                {children}
              </Container>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </>
  );
};

/** Render the full-width 404 page shell. */
export const Sidebar404 = (props) => {
  const { children } = props;
  return (
    <Container>
      <Content className={`${style.content}`}>
        <Row type="flex">
          <Col sm={24} md={24} lg={24}>
            <Container className={`${style.boxContent} ${style.sideBar404Radius}`}>
              {children}
            </Container>
          </Col>
        </Row>
      </Content>
    </Container>
  );
};

export default SidebarWrapper;
