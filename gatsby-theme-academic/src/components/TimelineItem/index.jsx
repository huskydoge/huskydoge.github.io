/** Minimal education timeline item used by the Experience page. */
import React from 'react';
import { TimelineEvent } from 'react-event-timeline';

import Icon from '../Icon';

const educationIconStyle = {
  alignItems: 'center',
  background: '#fff',
  border: '1px solid var(--app-border-strong)',
  borderRadius: '50%',
  boxShadow: 'none',
  cursor: 'default',
  display: 'flex',
  justifyContent: 'center',
};

/** Normalize school icons to one light academic mark. */
const getEducationIcon = (icon) => {
  if (icon === 'school' || icon === 'university') {
    return 'graduation-cap';
  }
  return icon || 'graduation-cap';
};

const TimelineItem = (data) => (
  <TimelineEvent
    title={data.title}
    titleStyle={{ fontSize: '11pt', fontWeight: 'bold', color: 'var(--app-text-primary)' }}
    subtitle={data.location}
    subtitleStyle={{ fontSize: '12pt', fontWeight: '400', color: 'var(--app-text-secondary)' }}
    createdAt={<div style={{ color: 'var(--app-text-muted)' }}>{data.date}</div>}
    style={{ fontSize: '11pt', fontWeight: '300', color: 'var(--app-text-secondary)' }}
    icon={<Icon size="sm" fixedWidth icon={getEducationIcon(data.icon)} />}
    iconStyle={educationIconStyle}
    iconColor="var(--app-text-secondary)"
  />
);

export default TimelineItem;
