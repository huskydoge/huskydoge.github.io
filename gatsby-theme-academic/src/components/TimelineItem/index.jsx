import React from 'react';
import { TimelineEvent } from 'react-event-timeline';

import Icon from '../Icon';

const TimelineItem = (data) => (
  <TimelineEvent
    title={data.title}
    titleStyle={{ fontSize: '11pt', fontWeight: 'bold', color: 'var(--app-text-primary)' }}
    subtitle={data.location}
    subtitleStyle={{ fontSize: '12pt', fontWeight: '400', color: 'var(--app-text-secondary)' }}
    createdAt={<div style={{ color: 'var(--app-text-muted)' }}>{data.date}</div>}
    style={{ fontSize: '11pt', fontWeight: '300', color: 'var(--app-text-secondary)' }}
    icon={<Icon size="sm" fixedWidth icon={data.icon || 'school'} />}
    iconStyle={{ cursor: 'default', background: 'rgba(232, 166, 139, 0.2)', borderRadius: 'var(--app-radius-sm)' }}
    iconColor="#d68d6b"
  />
);

export default TimelineItem;
